import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const cookieStore = cookies();
  const savedState = cookieStore.get('naver_oauth_state')?.value;
  const next = cookieStore.get('naver_oauth_next')?.value ?? '/dashboard';

  // 쿠키 정리
  cookieStore.delete('naver_oauth_state');
  cookieStore.delete('naver_oauth_next');

  // CSRF 검증
  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  try {
    // 1. 네이버에서 access_token 발급
    const tokenRes = await fetch('https://nid.naver.com/oauth2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NAVER_CLIENT_ID!,
        client_secret: process.env.NAVER_CLIENT_SECRET!,
        code,
        state,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // 2. 네이버 프로필 조회
    const profileRes = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profileData = await profileRes.json();
    if (profileData.resultcode !== '00') {
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    const { email, name, profile_image, id: naverId } = profileData.response;

    if (!email) {
      return NextResponse.redirect(`${origin}/login?error=email_required`);
    }

    // 3. Supabase admin으로 유저 생성 또는 조회
    const adminClient = createAdminClient();

    // 이메일로 기존 유저 조회
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      // 유저 메타데이터 업데이트
      await adminClient.auth.admin.updateUserById(userId, {
        user_metadata: {
          full_name: name,
          avatar_url: profile_image,
          provider: 'naver',
          naver_id: naverId,
        },
      });
    } else {
      // 새 유저 생성
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          full_name: name,
          avatar_url: profile_image,
          provider: 'naver',
          naver_id: naverId,
        },
      });

      if (createError || !newUser.user) {
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
      }
      userId = newUser.user.id;
    }

    // 4. Magic link로 세션 생성
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    if (linkError || !linkData.properties?.hashed_token) {
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // 5. 서버사이드에서 OTP 검증하여 세션 발급
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: linkData.properties.hashed_token,
      type: 'magiclink',
    });

    if (verifyError) {
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }
}
