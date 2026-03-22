import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get('next') ?? '/dashboard';

  // CSRF 방지용 state 생성
  const state = crypto.randomUUID();

  // state와 next를 쿠키에 저장 (callback에서 검증)
  const cookieStore = cookies();
  cookieStore.set('naver_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10분
    path: '/',
  });
  cookieStore.set('naver_oauth_next', next, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.NAVER_CLIENT_ID!,
    redirect_uri: `${origin}/api/auth/naver/callback`,
    state,
  });

  return NextResponse.redirect(`https://nid.naver.com/oauth2.0/authorize?${params}`);
}
