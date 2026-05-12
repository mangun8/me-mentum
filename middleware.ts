import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// 로그인 없이 접근 불가한 경로
const PROTECTED_ROUTES = ['/dashboard', '/apply', '/redeem'];

// 로그인 상태에서 접근 불필요한 경로
const AUTH_ROUTES = ['/login'];

// 코치(운영자) role 필요 경로
const ADMIN_ROUTES = ['/admin', '/api/admin'];

const COACH_EMAILS = (process.env.COACH_EMAILS ?? '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 세션 갱신 (중요: getUser() 호출 필수)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 보호된 경로에 비로그인 접근 → /login?next=<현재경로> 리다이렉트
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // 로그인 상태에서 /login 접근 → /dashboard 리다이렉트
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  // 어드민 경로: 로그인 + coach role 필요
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  if (isAdminRoute) {
    if (!user) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
      }
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const email = user.email?.toLowerCase() ?? '';
    let isCoach = COACH_EMAILS.includes(email);
    if (!isCoach) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      isCoach = profile?.role === 'coach';
    }

    if (!isCoach) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
      }
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = '/';
      return NextResponse.redirect(homeUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
