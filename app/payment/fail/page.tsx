'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function FailContent() {
  const searchParams = useSearchParams();
  const message = searchParams?.get('message') ?? '결제가 취소되었거나 실패했습니다.';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-red-500">!</span>
        </div>
        <h2 className="text-2xl font-bold text-dark mb-4">결제 실패</h2>
        <p className="text-secondary mb-8">{message}</p>
        <Link href="/apply">
          <button className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors">
            다시 시도하기
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <FailContent />
    </Suspense>
  );
}
