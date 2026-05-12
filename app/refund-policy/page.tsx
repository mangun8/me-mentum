import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: '환불정책',
  description: 'Me-mentum 환불정책 — 정규 패키지·체험권·전환 시 환불 기준.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark mb-2">환불정책</h1>
        <p className="text-sm text-gray-400 mb-12">시행일: 2026년 5월 12일</p>

        <div className="prose prose-gray max-w-none text-[15px] leading-relaxed space-y-10">
          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">1. 환불 원칙</h2>
            <p className="text-secondary mb-3">
              미멘텀(이하 &quot;회사&quot;)은 이용자의 권익 보호를 위해 아래와 같은 환불 기준을 적용합니다.
              수강권 구매 후 단 한 번의 세션도 진행되지 않은 경우에는 결제일로부터 경과한 기간과 무관하게 전액 환불해 드립니다.
            </p>
            <p className="text-secondary">
              세션이 시작된 이후에는 진행 회차에 관계없이 잔여 회차에 비례하여 환불해 드리며,
              이 경우 결제 대행사 수수료 등 회사에 실제 발생한 비용을 공제한 금액을 기준으로 산정합니다.
              1회 체험권 결제분은 체험 세션 1회 분량으로 산입되어 진행 시 소진된 것으로 봅니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">2. 환불 기준</h2>

            <h3 className="text-base font-semibold text-dark mt-6 mb-3">(1) 정규 패키지 — 단독 결제</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-medium text-dark">구분</th>
                  <th className="text-left py-3 font-medium text-dark">환불 금액</th>
                </tr>
              </thead>
              <tbody className="text-secondary">
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4">세션 미진행 (기간 무관)</td>
                  <td className="py-3">결제 금액 전액 환불 (공제 없음)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 align-top">1회 이상 세션 진행 후</td>
                  <td className="py-3">
                    (결제 금액 − 결제 대행사 수수료 등 실비) × 잔여 회차 / 전체 회차
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm text-secondary">
              <p className="font-medium text-dark mb-2">계산 예시 (4회 80만원 패키지, 결제 수수료 약 3% 가정)</p>
              <ul className="space-y-1 list-disc pl-5">
                <li>1회 진행 후 → (800,000 − 24,000) × 3/4 ≈ <strong>582,000원</strong></li>
                <li>2회 진행 후 → (800,000 − 24,000) × 2/4 = <strong>388,000원</strong></li>
                <li>3회 진행 후 → (800,000 − 24,000) × 1/4 = <strong>194,000원</strong></li>
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                ※ 결제 대행사 수수료는 토스페이먼츠 정산 내역상 실제 차감된 금액을 기준으로 하며, 결제 수단·가맹점 등급에 따라 통상 결제 금액의 1~3% 범위입니다.
              </p>
            </div>

            <h3 className="text-base font-semibold text-dark mt-8 mb-3">(2) 1회 체험권</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-medium text-dark">구분</th>
                  <th className="text-left py-3 font-medium text-dark">환불 금액</th>
                </tr>
              </thead>
              <tbody className="text-secondary">
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4">체험 세션 미진행</td>
                  <td className="py-3">결제 금액 전액 환불 (공제 없음)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4">체험 세션 진행 후 (정규 미전환)</td>
                  <td className="py-3">환불 불가 (체험 1회로 모두 소진)</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-base font-semibold text-dark mt-8 mb-3">(3) 1회 체험권 → 정규 패키지 전환 후</h3>
            <p className="text-secondary text-sm mb-3">
              체험 결제분은 체험 세션 1회로 소진된 것으로 보아 환불 대상에서 제외됩니다.
              정규 결제 시 추가로 결제한 차액(이하 &quot;정규 결제 차액&quot;)을 기준으로,
              정규 패키지(4회) 중 잔여 회차에 비례하여 환불됩니다.
            </p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-medium text-dark">누적 진행 (체험 포함)</th>
                  <th className="text-left py-3 font-medium text-dark">환불 금액</th>
                </tr>
              </thead>
              <tbody className="text-secondary">
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4">체험만 1회 진행, 정규 미진행</td>
                  <td className="py-3">정규 결제 차액 전액 환불 (공제 없음)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 align-top">정규 세션 1회 이상 진행 후</td>
                  <td className="py-3">
                    (정규 결제 차액 − 결제 대행사 수수료 등 실비) × 정규 잔여 회차 / 4
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4">정규 4회 모두 진행 완료</td>
                  <td className="py-3">환불 불가 (잔여 회차 없음)</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">3. 환불 절차</h2>
            <ul className="list-decimal pl-5 space-y-1 text-secondary">
              <li>환불을 원하시는 경우, <strong>admin@mementum.me</strong> 또는 <strong>공식 카카오톡 채널</strong>을 통해 환불을 요청해 주세요.</li>
              <li>환불 요청 접수 후 3영업일 이내에 검토 결과를 안내해 드립니다.</li>
              <li>환불 승인 후 결제 수단에 따라 5~10영업일 이내에 환불이 처리됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">4. 환불 제외 사항</h2>
            <ul className="list-disc pl-5 space-y-1 text-secondary">
              <li>예약한 코칭 세션 시작 24시간 전까지 사전 연락 없이 불참(노쇼)한 경우, 해당 세션은 정상 진행된 것으로 간주하여 수강 횟수가 차감됩니다.</li>
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
              환불 관련 문의사항은 <strong>admin@mementum.me</strong> 또는 <strong>공식 카카오톡 채널</strong>로 연락해 주세요.
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
