import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  const cookieStore = cookies();
  const originalUserId = cookieStore.get('link_original_user_id')?.value;
  cookieStore.delete('link_original_user_id');

  if (!code || !originalUserId) {
    return NextResponse.redirect(`${origin}/dashboard?error=link_failed`);
  }

  try {
    // 1. 코드를 교환하여 연동할 계정의 정보를 얻음
    const supabase = createClient();
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError || !sessionData.user) {
      return NextResponse.redirect(`${origin}/dashboard?error=link_failed`);
    }

    const linkedUser = sessionData.user;
    const linkedProvider = linkedUser.app_metadata?.provider; // 'google' or 'kakao'
    const linkedIdentity = linkedUser.identities?.[0];

    const adminClient = createAdminClient();

    // 2. 연동한 계정이 원래 유저와 다른 계정이면 → 중복 계정 정리
    if (linkedUser.id !== originalUserId) {
      // 중복 계정 삭제
      await adminClient.auth.admin.deleteUser(linkedUser.id);
    }

    // 3. 원래 유저의 metadata에 연동 정보 추가
    const { data: originalUserData } = await adminClient.auth.admin.getUserById(originalUserId);
    const originalUser = originalUserData?.user;

    if (!originalUser) {
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    const providerKey = `linked_${linkedProvider}`;
    await adminClient.auth.admin.updateUserById(originalUserId, {
      user_metadata: {
        ...originalUser.user_metadata,
        [providerKey]: {
          id: linkedIdentity?.identity_data?.sub ?? linkedIdentity?.id,
          email: linkedUser.email,
          name: linkedIdentity?.identity_data?.full_name ?? linkedIdentity?.identity_data?.name,
          avatar_url: linkedIdentity?.identity_data?.avatar_url,
        },
      },
    });

    // 4. 원래 유저로 세션 복원
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email: originalUser.email!,
    });

    if (linkError || !linkData.properties?.hashed_token) {
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: linkData.properties.hashed_token,
      type: 'magiclink',
    });

    if (verifyError) {
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    return NextResponse.redirect(`${origin}/dashboard`);
  } catch {
    return NextResponse.redirect(`${origin}/dashboard?error=link_failed`);
  }
}
