import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: '환불정책 | Me-mentum',
  description: 'Me-mentum 환불정책',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark mb-2">환불정책</h1>
        <p className="text-sm text-gray-400 mb-12">시행일: 2025년 4월 1일</p>

        <div className="prose prose-gray max-w-none text-[15px] leading-relaxed space-y-10">
          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">1. 환불 원칙</h2>
            <p className="text-secondary">
              미멘텀(이하 &quot;회사&quot;)은 이용자의 권익 보호를 위해 아래와 같은 환불 기준을 적용합니다.
              수강권(4회권) 구매 후 환불은 코칭 세션 진행 상황에 따라 차등 적용됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">2. 환불 기준</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-medium text-dark">구분</th>
                  <th className="text-left py-3 font-medium text-dark">환불 금액</th>
                </tr>
              </thead>
              <tbody className="text-secondary">
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4">결제 후 7일 이내, 세션 미진행</td>
                  <td className="py-3">전액 환불</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4">1회 세션 진행 후</td>
                  <td className="py-3">결제 금액의 75% 환불</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4">2회 세션 진행 후</td>
                  <td className="py-3">결제 금액의 50% 환불</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4">3회 이상 세션 진행 후</td>
                  <td className="py-3">환불 불가</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">3. 환불 절차</h2>
            <ul className="list-decimal pl-5 space-y-1 text-secondary">
              <li>환불을 원하시는 경우, <strong>admin@mementum.me</strong>로 환불 요청 메일을 보내주세요.</li>
              <li>환불 요청 접수 후 3영업일 이내에 검토 결과를 안내해 드립니다.</li>
              <li>환불 승인 후 결제 수단에 따라 5~10영업일 이내에 환불이 처리됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">4. 환불 제외 사항</h2>
            <ul className="list-disc pl-5 space-y-1 text-secondary">
              <li>예약한 코칭 세션에 사전 연락(24시간 전) 없이 불참한 경우, 해당 세션은 진행된 것으로 간주합니다.</li>
              <li>이용자의 귀책 사유로 서비스를 이용하지 못한 경우에는 환불이 제한될 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">5. 회사 귀책 사유에 의한 환불</h2>
            <p className="text-secondary">
              회사의 사정으로 서비스 제공이 불가능한 경우, 잔여 세션에 대해 전액 환불합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">6. 문의</h2>
            <p className="text-secondary">
              환불 관련 문의사항은 <strong>admin@mementum.me</strong>로 연락해 주세요.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link href="/" className="text-sm text-secondary hover:text-primary transition-colors">
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
