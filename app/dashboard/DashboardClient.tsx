'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useGTM } from '@/hooks/useGTM';
import Cal, { getCalApi } from '@calcom/embed-react';
import { Calendar, Ticket, Clock, Video } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface Booking {
  id: string;
  scheduled_at: string;
  status: string;
  programs: { title: string; track: string } | null;
  coaches: { name: string } | null;
}

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

  const [remainingTickets, setRemainingTickets] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    trackLogin(user.id);

    if (isAdmin) {
      console.log('%c[Me-mentum] Admin 권한 확인됨', 'color: #2563eb; font-weight: bold;');
      console.log({ role: 'admin', email: user.email, id: user.id });
    }

    // 수강권 및 예약 데이터 로드
    async function loadDashboardData() {
      const [userRes, bookingsRes] = await Promise.all([
        supabase
          .from('users')
          .select('remaining_tickets')
          .eq('id', user.id)
          .single(),
        supabase
          .from('bookings')
          .select('id, scheduled_at, status, programs(title, track), coaches(name)')
          .eq('user_id', user.id)
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(10),
      ]);

      if (userRes.data) {
        setRemainingTickets(userRes.data.remaining_tickets);
      }
      if (bookingsRes.data) {
        setBookings(bookingsRes.data as unknown as Booking[]);
      }
      setLoadingData(false);
    }

    loadDashboardData();
  }, []);

  const [linking, setLinking] = useState<string | null>(null);

  const nextBooking = bookings.find(b => b.status === 'confirmed' || b.status === 'pending');

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return { text: '확정', color: 'bg-green-50 text-green-700' };
      case 'pending': return { text: '대기', color: 'bg-yellow-50 text-yellow-700' };
      case 'cancelled': return { text: '취소', color: 'bg-red-50 text-red-700' };
      case 'completed': return { text: '완료', color: 'bg-gray-100 text-gray-500' };
      default: return { text: status, color: 'bg-gray-100 text-gray-500' };
    }
  };

  // 연동된 프로바이더 확인: identities (빌트인) + metadata (커스텀 연동)
  const identityProviders = user.identities?.map(i => i.provider) ?? [];
  const hasGoogleLinked = identityProviders.includes('google') || !!user.user_metadata?.linked_google;
  const hasKakaoLinked = identityProviders.includes('kakao') || !!user.user_metadata?.linked_kakao;
  const hasNaverLinked = !!user.user_metadata?.naver_id;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleLinkProvider = (provider: 'google' | 'kakao' | 'naver') => {
    setLinking(provider);
    if (provider === 'naver') {
      window.location.href = `/api/auth/naver?mode=link`;
    } else {
      window.location.href = `/api/auth/link/${provider}`;
    }
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="space-y-6">

        {/* User Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
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

        {/* 계정 연동 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-dark mb-4">계정 연동</h2>
          <p className="text-sm text-secondary mb-4">다른 소셜 계정을 연동하면 어떤 계정으로든 로그인할 수 있습니다.</p>
          <div className="space-y-3">
            {/* Google */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span className="text-sm font-medium">Google</span>
              </div>
              {hasGoogleLinked ? (
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full">연동됨</span>
              ) : (
                <button
                  onClick={() => handleLinkProvider('google')}
                  disabled={linking === 'google'}
                  className="text-xs text-primary font-medium hover:underline disabled:opacity-50"
                >
                  {linking === 'google' ? '연동 중...' : '연동하기'}
                </button>
              )}
            </div>

            {/* Kakao */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M12 3C6.48 3 2 6.36 2 10.44c0 2.62 1.75 4.93 4.38 6.24-.19.7-.69 2.54-.79 2.94-.12.49.18.48.38.35.16-.1 2.5-1.7 3.52-2.39.49.07.99.1 1.51.1 5.52 0 10-3.36 10-7.24C22 6.36 17.52 3 12 3z" fill="#191919"/></svg>
                <span className="text-sm font-medium">카카오</span>
              </div>
              {hasKakaoLinked ? (
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full">연동됨</span>
              ) : (
                <button
                  onClick={() => handleLinkProvider('kakao')}
                  disabled={linking === 'kakao'}
                  className="text-xs text-primary font-medium hover:underline disabled:opacity-50"
                >
                  {linking === 'kakao' ? '연동 중...' : '연동하기'}
                </button>
              )}
            </div>

            {/* Naver */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#03C75A"/><path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" fill="#fff" transform="scale(0.5) translate(12, 12)"/></svg>
                <span className="text-sm font-medium">네이버</span>
              </div>
              {hasNaverLinked ? (
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full">연동됨</span>
              ) : (
                <button
                  onClick={() => handleLinkProvider('naver')}
                  disabled={linking === 'naver'}
                  className="text-xs text-primary font-medium hover:underline disabled:opacity-50"
                >
                  {linking === 'naver' ? '연동 중...' : '연동하기'}
                </button>
              )}
            </div>
          </div>
        </div>

        </div>{/* End Left Column */}

        {/* Right Column */}
        <div className="space-y-6">

          {/* 수강권 현황 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-dark mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" />
              수강권 현황
            </h2>
            {loadingData ? (
              <div className="animate-pulse h-16 bg-gray-100 rounded-xl" />
            ) : (
              <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4">
                <div>
                  <p className="text-sm text-secondary">잔여 코칭 세션</p>
                  <p className="text-3xl font-bold text-primary mt-1">{remainingTickets}<span className="text-base font-medium text-secondary ml-1">회</span></p>
                </div>
                {remainingTickets === 0 && (
                  <a
                    href="/apply"
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors"
                  >
                    수강권 구매
                  </a>
                )}
              </div>
            )}
          </div>

          {/* 다가오는 코칭 배너 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-dark mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              다가오는 코칭
            </h2>
            {loadingData ? (
              <div className="animate-pulse h-20 bg-gray-100 rounded-xl" />
            ) : nextBooking ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-secondary mb-1">{nextBooking.programs?.title ?? '코칭 세션'}</p>
                    <p className="text-lg font-bold text-dark">
                      {formatDate(nextBooking.scheduled_at)}
                    </p>
                    <p className="text-primary font-medium">{formatTime(nextBooking.scheduled_at)}</p>
                    {nextBooking.coaches?.name && (
                      <p className="text-sm text-secondary mt-2">코치: {nextBooking.coaches.name}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusLabel(nextBooking.status).color}`}>
                      {statusLabel(nextBooking.status).text}
                    </span>
                    <Video className="w-5 h-5 text-secondary" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-secondary text-sm">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                예정된 코칭 세션이 없습니다.<br />
                아래에서 새 세션을 예약해보세요.
              </div>
            )}
          </div>

          {/* 예약된 일정 목록 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-dark mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              예약된 일정
            </h2>
            {loadingData ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse h-14 bg-gray-100 rounded-xl" />
                ))}
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map((booking) => {
                  const st = statusLabel(booking.status);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">
                            {new Date(booking.scheduled_at).getDate()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-dark">{formatDate(booking.scheduled_at)}</p>
                          <p className="text-xs text-secondary">{formatTime(booking.scheduled_at)} · {booking.programs?.title ?? '코칭 세션'}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${st.color}`}>
                        {st.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-secondary text-sm">
                예약된 일정이 없습니다.
              </div>
            )}
          </div>

        </div>{/* End Right Column */}
        </div>{/* End Grid */}

        {/* 코칭 세션 예약 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-dark mb-4">코칭 세션 예약</h2>
          {!loadingData && remainingTickets <= 0 ? (
            <div className="text-center py-12">
              <Ticket className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-secondary mb-2">잔여 수강권이 없습니다.</p>
              <p className="text-sm text-gray-400 mb-6">수강권을 구매하시면 코칭 세션을 예약할 수 있습니다.</p>
              <a
                href="/apply"
                className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors inline-block"
              >
                수강권 구매하기
              </a>
            </div>
          ) : (
            <>
              <p className="text-sm text-secondary mb-6">원하는 날짜와 시간을 선택하여 1:1 코칭 세션을 예약하세요.</p>
              <Cal
                calLink="me-mentum/coaching"
                style={{ width: '100%', height: '100%', overflow: 'scroll' }}
                config={{
                  name: user.user_metadata?.full_name ?? '',
                  email: user.email ?? '',
                  theme: 'light',
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
