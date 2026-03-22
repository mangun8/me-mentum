import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

async function getNaverProfile(code: string, state: string) {
  // 네이버에서 access_token 발급
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
  if (!tokenData.access_token) return null;

  // 네이버 프로필 조회
  const profileRes = await fetch('https://openapi.naver.com/v1/nid/me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const profileData = await profileRes.json();
  if (profileData.resultcode !== '00') return null;

  return profileData.response;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const cookieStore = cookies();
  const savedState = cookieStore.get('naver_oauth_state')?.value;
  const next = cookieStore.get('naver_oauth_next')?.value ?? '/dashboard';
  const mode = cookieStore.get('naver_oauth_mode')?.value ?? 'login';

  // 쿠키 정리
  cookieStore.delete('naver_oauth_state');
  cookieStore.delete('naver_oauth_next');
  cookieStore.delete('naver_oauth_mode');

  // CSRF 검증
  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  try {
    const profile = await getNaverProfile(code, state);
    if (!profile) {
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    const { email, name, profile_image, id: naverId } = profile;

    // ===== LINK 모드: 현재 로그인된 유저에 네이버 정보 연결 =====
    if (mode === 'link') {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
      }

      const adminClient = createAdminClient();

      // 네이버 이메일 또는 naver_id로 기존 중복 계정이 있으면 삭제
      const { data: allUsers } = await adminClient.auth.admin.listUsers();
      const duplicateUser = allUsers?.users?.find(
        u => u.id !== user.id && (u.user_metadata?.naver_id === naverId || (email && u.email === email))
      );
      if (duplicateUser) {
        await adminClient.auth.admin.deleteUser(duplicateUser.id);
      }

      // 현재 유저의 metadata에 네이버 정보 추가
      await adminClient.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...user.user_metadata,
          naver_id: naverId,
          naver_email: email,
          naver_name: name,
        },
      });

      return NextResponse.redirect(`${origin}/dashboard`);
    }

    // ===== LOGIN 모드: 네이버로 로그인 =====
    const adminClient = createAdminClient();
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const users = existingUsers?.users ?? [];

    // 1순위: naver_id로 기존 유저 조회 (이미 연동된 계정)
    let existingUser = users.find(u => u.user_metadata?.naver_id === naverId);

    // 2순위: 이메일로 조회
    if (!existingUser && email) {
      existingUser = users.find(u => u.email === email);
    }

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      // 네이버 정보 업데이트
      await adminClient.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...existingUser.user_metadata,
          naver_id: naverId,
          naver_email: email,
          // full_name과 avatar_url은 기존 값 유지 (유저가 직접 설정했을 수 있음)
          full_name: existingUser.user_metadata?.full_name || name,
          avatar_url: existingUser.user_metadata?.avatar_url || profile_image,
        },
      });
    } else {
      // 새 유저 생성
      if (!email) {
        return NextResponse.redirect(`${origin}/login?error=email_required`);
      }

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

    // Magic link로 세션 생성
    const targetEmail = existingUser?.email ?? email;
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email: targetEmail!,
    });

    if (linkError || !linkData.properties?.hashed_token) {
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // 서버사이드에서 OTP 검증하여 세션 발급
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
