'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'confirming' | 'success' | 'error'>('confirming');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const paymentKey = searchParams?.get('paymentKey');
    const orderId = searchParams?.get('orderId');
    const amount = searchParams?.get('amount');

    if (!paymentKey || !orderId || !amount) {
      setStatus('error');
      setErrorMessage('결제 정보가 올바르지 않습니다.');
      return;
    }

    // 서버에 결제 승인 요청
    fetch('/api/payment/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(data.error ?? '결제 승인에 실패했습니다.');
        }
      })
      .catch(() => {
        setStatus('error');
        setErrorMessage('네트워크 오류가 발생했습니다.');
      });
  }, [searchParams]);

  if (status === 'confirming') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-dark mb-2">결제 확인 중...</h2>
          <p className="text-secondary text-sm">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-dark mb-4">결제 실패</h2>
          <p className="text-secondary mb-8">{errorMessage}</p>
          <Link href="/apply">
            <button className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors">
              다시 시도하기
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-dark mb-4">결제가 완료되었습니다!</h2>
        <p className="text-secondary mb-8">
          코칭 세션 예약 안내가 곧 발송됩니다.<br />
          My Page에서 예약 현황을 확인하세요.
        </p>
        <Link href="/dashboard">
          <button className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors">
            My Page로 이동
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
