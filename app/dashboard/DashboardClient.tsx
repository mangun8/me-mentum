'use client';

import { useEffect, useState, useRef } from 'react';
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

  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user.user_metadata?.full_name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user.user_metadata?.avatar_url ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    trackLogin(user.id);

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert('이미지 업로드에 실패했습니다.');
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setAvatarUrl(data.publicUrl);
    setUploading(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: nickname,
        avatar_url: avatarUrl,
      },
    });

    if (error) {
      alert('프로필 저장에 실패했습니다.');
    } else {
      setIsEditing(false);
      router.refresh();
    }
    setSaving(false);
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-dark">내 프로필</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-primary hover:underline"
              >
                편집
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors overflow-hidden"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-xs text-center">사진 추가</span>
                  )}
                </div>
                <div className="text-sm text-secondary">
                  <p>클릭하여 프로필 사진 변경</p>
                  {uploading && <p className="text-primary">업로드 중...</p>}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              {/* Nickname */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1">닉네임</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="표시할 이름을 입력하세요"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1">이메일</label>
                <p className="text-sm text-secondary px-4 py-2.5 bg-gray-50 rounded-xl">{user.email}</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {saving ? '저장 중...' : '저장'}
                </button>
                <button
                  onClick={() => {
                    setNickname(user.user_metadata?.full_name ?? '');
                    setAvatarUrl(user.user_metadata?.avatar_url ?? '');
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 text-sm text-secondary hover:text-dark transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">{(nickname || user.email)?.[0]?.toUpperCase()}</span>
                </div>
              )}
              <div>
                <p className="font-medium text-dark">{nickname || user.email}</p>
                <p className="text-sm text-secondary">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  역할: {isAdmin ? '어드민' : '일반 사용자'}
                </p>
              </div>
            </div>
          )}
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
