'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RedeemPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(
          {
            CODE_REQUIRED: '코드를 입력해 주세요.',
            CODE_NOT_FOUND: '유효하지 않은 코드입니다.',
            CODE_ALREADY_USED: '이미 사용된 코드입니다.',
            CODE_EXPIRED: '만료된 코드입니다.',
            UNAUTHORIZED: '로그인이 필요합니다.',
          }[data.error as string] ?? '코드 등록에 실패했습니다.'
        );
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-24">
        <div className="max-w-md w-full text-center px-6">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-2xl font-bold text-dark mb-3">친구 회원으로 등록되었습니다</h1>
          <p className="text-secondary mb-8">
            이제 코치님의 1:1 정용훈 코칭 트랙에 접근하실 수 있습니다.
          </p>
          <Link
            href="/program/friend-coaching"
            className="inline-block bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90"
          >
            1:1 정용훈 코칭 보러가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-24">
      <div className="max-w-md w-full px-6">
        <h1 className="text-2xl font-bold text-dark mb-2">초대 코드 입력</h1>
        <p className="text-secondary text-sm mb-8">
          코치님으로부터 받은 8자리 초대 코드를 입력해 주세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
            placeholder="예: A3K9PMRX"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-lg tracking-widest text-center"
            autoFocus
            maxLength={8}
          />

          <button
            type="submit"
            disabled={submitting || code.length < 4}
            className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? '확인 중...' : '코드 등록하기'}
          </button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
