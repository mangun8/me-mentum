'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useGTM } from '@/hooks/useGTM';
import type { User } from '@supabase/supabase-js';

interface Props {
  user: User;
  isAdmin: boolean;
}

export default function DashboardClient({ user, isAdmin }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const { trackLogin } = useGTM();

  useEffect(() => {
    // 로그인 성공 GTM 이벤트
    trackLogin(user.id);

    // Admin 플래그 콘솔 확인
    if (isAdmin) {
      console.log('%c[Me-mentum] Admin 권한 확인됨', 'color: #2563eb; font-weight: bold;');
      console.log({ role: 'admin', email: user.email, id: user.id });
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-serif italic text-lg">M</span>
            <span className="font-bold text-dark">Me-mentum</span>
            {isAdmin && (
              <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                ADMIN
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-secondary hover:text-dark transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark">
            안녕하세요,{' '}
            <span className="text-primary">
              {user.user_metadata?.full_name ?? user.email}
            </span>
            님 👋
          </h1>
          <p className="text-secondary mt-2">
            Me-mentum 대시보드에 오신 것을 환영합니다.
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 max-w-md">
          <h2 className="font-bold text-dark mb-4">내 프로필</h2>
          <div className="flex items-center gap-4">
            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-dark">{user.user_metadata?.full_name}</p>
              <p className="text-sm text-secondary">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                역할: {isAdmin ? '어드민' : '일반 사용자'}
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚀</span>
          </div>
          <h3 className="text-xl font-bold text-dark mb-2">대시보드 준비 중</h3>
          <p className="text-secondary text-sm">
            코칭 신청 현황, 세션 일정 등의 기능이 곧 추가됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
