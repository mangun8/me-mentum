'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useGTM } from '@/hooks/useGTM';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { trackLogin } = useGTM();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    // 클릭 시점에 클라이언트 생성 (빌드 타임 초기화 방지)
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError('로그인에 실패했습니다. 다시 시도해 주세요.');
      setIsLoading(false);
      return;
    }

    // OAuth 리다이렉트 전에 GTM 이벤트 발송 (user_id는 콜백 후 확정됨)
    if (data) {
      trackLogin('pending_google_oauth');
    }
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
          <p className="text-secondary">로그인하여 코칭 여정을 시작하세요</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-gray-200 rounded-xl font-medium text-dark hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {/* Google Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isLoading ? '로그인 중...' : 'Google로 계속하기'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
              로그인하면 Me-mentum의{' '}
              <a href="#" className="text-primary hover:underline">서비스 이용약관</a>
              {' '}및{' '}
              <a href="#" className="text-primary hover:underline">개인정보처리방침</a>
              에 동의하는 것으로 간주합니다.
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-secondary hover:text-primary transition-colors">
            ← 메인으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
