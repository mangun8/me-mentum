'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useGTM } from '@/hooks/useGTM';

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { trackLogin } = useGTM();
  const searchParams = useSearchParams();

  // 로그인 후 돌아갈 경로 (없으면 대시보드)
  const next = searchParams?.get('next') ?? '/dashboard';
  const hasError = searchParams?.get('error');

  const handleGoogleLogin = () => {
    setIsLoading(true);
    trackLogin('pending_google_oauth');
    window.location.href = `/api/auth/google?next=${encodeURIComponent(next)}`;
  };

  const handleKakaoLogin = () => {
    setIsLoading(true);
    trackLogin('pending_kakao_oauth', 'kakao');
    window.location.href = `/api/auth/kakao?next=${encodeURIComponent(next)}`;
  };

  const handleNaverLogin = () => {
    setIsLoading(true);
    trackLogin('pending_naver_oauth', 'naver');
    window.location.href = `/api/auth/naver?next=${encodeURIComponent(next)}`;
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-serif italic text-xl shadow-lg shadow-primary/30">
              M
            </span>
            <span className="text-2xl font-bold text-dark">Me-mentum</span>
          </div>
          <h1 className="text-3xl font-bold text-dark mb-2">어서오세요</h1>
          <p className="text-secondary">
            {next !== '/dashboard'
              ? '계속하려면 먼저 로그인해 주세요'
              : '로그인하여 코칭 여정을 시작하세요'}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {(error || hasError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error ?? '로그인 중 문제가 발생했습니다. 다시 시도해 주세요.'}
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-gray-200 rounded-xl font-medium text-dark hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {isLoading ? '로그인 중...' : 'Google로 계속하기'}
          </button>

          {/* Kakao Login Button */}
          <button
            onClick={handleKakaoLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mt-3"
            style={{ backgroundColor: '#FEE500', color: '#191919' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3C6.48 3 2 6.36 2 10.44c0 2.62 1.75 4.93 4.38 6.24-.19.7-.69 2.54-.79 2.94-.12.49.18.48.38.35.16-.1 2.5-1.7 3.52-2.39.49.07.99.1 1.51.1 5.52 0 10-3.36 10-7.24C22 6.36 17.52 3 12 3z" fill="#191919" />
            </svg>
            {isLoading ? '로그인 중...' : '카카오로 계속하기'}
          </button>

          {/* Naver Login Button */}
          <button
            onClick={handleNaverLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mt-3"
            style={{ backgroundColor: '#03C75A' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" fill="#fff" />
            </svg>
            {isLoading ? '로그인 중...' : '네이버로 계속하기'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
              로그인하면 Me-mentum의{' '}
              <Link href="/terms" className="text-primary hover:underline">서비스 이용약관</Link>
              {' '}및{' '}
              <Link href="/privacy" className="text-primary hover:underline">개인정보처리방침</Link>
              에 동의하는 것으로 간주합니다.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-secondary hover:text-primary transition-colors">
            ← 메인으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-light-gray" />}>
      <LoginContent />
    </Suspense>
  );
}
