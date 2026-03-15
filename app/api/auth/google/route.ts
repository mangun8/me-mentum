import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get('next') ?? '/dashboard';

  const supabase = createClient();

  // 서버에서 OAuth URL을 가져와서 리다이렉트
  // skipBrowserRedirect: true → URL만 반환, 브라우저 직접 이동 안 함
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // 서버에서 Google OAuth URL로 리다이렉트
  return NextResponse.redirect(data.url);
}
