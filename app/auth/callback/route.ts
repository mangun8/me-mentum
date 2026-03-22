import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const supabase = createClient();
  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !sessionData.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const loggedInUser = sessionData.user;
  const provider = loggedInUser.app_metadata?.provider; // 'google' or 'kakao'
  const providerIdentity = loggedInUser.identities?.[0];
  const providerSub = providerIdentity?.identity_data?.sub ?? providerIdentity?.id;

  // 이 프로바이더가 다른 유저의 metadata에 연동(linked_*)으로 등록되어 있는지 확인
  const adminClient = createAdminClient();
  const { data: allUsers } = await adminClient.auth.admin.listUsers();
  const users = allUsers?.users ?? [];

  const linkedOwner = users.find(u => {
    if (u.id === loggedInUser.id) return false;
    const linkedData = u.user_metadata?.[`linked_${provider}`];
    return linkedData?.id === providerSub || linkedData?.email === loggedInUser.email;
  });

  if (linkedOwner) {
    // 현재 로그인된 계정(중복)을 삭제하고, 연동 주인 계정으로 세션 전환
    await adminClient.auth.admin.deleteUser(loggedInUser.id);

    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email: linkedOwner.email!,
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
  }

  return NextResponse.redirect(`${origin}${next}`);
}
