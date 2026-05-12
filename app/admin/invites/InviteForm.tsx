'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InviteForm() {
  const router = useRouter();
  const [note, setNote] = useState('');
  const [expiresInDays, setExpiresInDays] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [issuedCode, setIssuedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setIssuedCode(null);

    try {
      const res = await fetch('/api/admin/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note: note || undefined,
          expiresInDays: expiresInDays ? Number(expiresInDays) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'UNKNOWN_ERROR');
      }
      setIssuedCode(data.invite.code);
      setNote('');
      setExpiresInDays('');
      router.refresh();
    } catch (err: any) {
      setError(err.message || '발급에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-dark mb-1">
          메모 (선택)
        </label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="예: 김OO 친구 / 카톡 OO"
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          maxLength={100}
        />
      </div>

      <div>
        <label htmlFor="expires" className="block text-sm font-medium text-dark mb-1">
          만료 일수 (선택 — 비우면 무기한)
        </label>
        <input
          id="expires"
          type="number"
          min={1}
          max={365}
          value={expiresInDays}
          onChange={(e) => setExpiresInDays(e.target.value)}
          placeholder="예: 30"
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-primary text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
      >
        {submitting ? '발급 중...' : '새 코드 발급'}
      </button>

      {issuedCode && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800 mb-2">발급 완료</p>
          <div className="flex items-center gap-3">
            <code className="font-mono text-xl font-bold text-dark">{issuedCode}</code>
            <button
              type="button"
              onClick={() => handleCopy(issuedCode)}
              className="text-xs text-primary hover:underline"
            >
              복사
            </button>
          </div>
          <p className="text-xs text-green-700 mt-2">
            이 코드를 친구에게 전달하세요. <code>/redeem</code> 페이지에 입력하면 친구 회원으로 전환됩니다.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          발급 실패: {error}
        </div>
      )}
    </form>
  );
}
