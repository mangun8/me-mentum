import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: '서비스 이용약관 | Me-mentum',
  description: 'Me-mentum 서비스 이용약관',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark mb-2">서비스 이용약관</h1>
        <p className="text-sm text-gray-400 mb-12">시행일: 2026년 4월 1일</p>

        <div className="prose prose-gray max-w-none text-[15px] leading-relaxed space-y-10">
          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">제1조 (목적)</h2>
            <p className="text-secondary">
              이 약관은 미멘텀(이하 &quot;회사&quot;)이 제공하는 온라인 코칭 서비스(이하 &quot;서비스&quot;)의
              이용 조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">제2조 (정의)</h2>
            <ul className="list-disc pl-5 space-y-1 text-secondary">
              <li>&quot;서비스&quot;란 회사가 제공하는 갤럽 강점 기반 1:1 비즈니스 코칭, 코칭 세션 예약, 세션 기록 열람 등 관련 제반 서비스를 말합니다.</li>
              <li>&quot;이용자&quot;란 이 약관에 따라 회사가 제공하는 서비스를 이용하는 회원을 말합니다.</li>
              <li>&quot;수강권&quot;이란 코칭 세션 4회를 이용할 수 있는 단위 상품을 말합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">제3조 (약관의 효력 및 변경)</h2>
            <ul className="list-decimal pl-5 space-y-1 text-secondary">
              <li>이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
              <li>회사는 합리적인 사유가 있을 경우 관련 법령에 위배되지 않는 범위에서 이 약관을 변경할 수 있습니다. 일반적인 변경은 적용일 7일 전, 이용자에게 불리한 변경은 최소 30일 전에 서비스 내 공지 또는 이메일을 통해 고지합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">제4조 (회원가입 및 계정)</h2>
            <ul className="list-decimal pl-5 space-y-1 text-secondary">
              <li>이용자는 Google, 카카오, 네이버 소셜 로그인을 통해 회원가입할 수 있습니다.</li>
              <li>이용자는 본인의 계정 정보를 관리할 책임이 있으며, 제3자에게 이를 양도하거나 대여할 수 없습니다.</li>
              <li>이용자가 등록한 정보에 변경이 있는 경우, 즉시 수정하여야 합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">제5조 (서비스의 내용)</h2>
            <p className="text-secondary">회사가 제공하는 서비스는 다음과 같습니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-secondary">
              <li>갤럽 강점 검사 기반 1:1 비즈니스 코칭 세션 (Zoom 화상)</li>
              <li>코칭 세션 예약 및 일정 관리</li>
              <li>AI 기반 코칭 세션 요약 및 인사이트 제공</li>
              <li>코칭 결과물 열람 및 관리</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">제6조 (결제)</h2>
            <ul className="list-decimal pl-5 space-y-1 text-secondary">
              <li>서비스 이용을 위해 이용자는 수강권(4회)을 구매해야 합니다.</li>
              <li>결제는 토스페이먼츠를 통해 처리되며, 신용카드, 간편결제(카카오페이, 네이버페이 등) 등을 이용할 수 있습니다.</li>
              <li>결제가 완료되면 수강권이 즉시 이용자의 계정에 부여됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">제7조 (환불)</h2>
            <p className="text-secondary">
              환불에 관한 세부 사항은{' '}
              <Link href="/refund-policy" className="text-primary hover:underline">환불정책</Link>
              에서 확인하실 수 있습니다.
              환불 처리는 『전자상거래 등에서의 소비자보호에 관한 법률』 등 관련 법령을 준수하여 진행됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">제8조 (코칭 세션 녹화 및 기록)</h2>
            <ul className="list-decimal pl-5 space-y-1 text-secondary">
              <li>코칭 세션의 녹화 및 AI 분석은 이용자의 명시적인 사전 동의를 받은 경우에만 진행합니다. 이용자가 동의하지 않는 경우 녹화 및 AI 분석은 진행하지 않습니다.</li>
              <li>동의한 경우, 녹화된 내용은 AI를 활용하여 텍스트로 변환 및 요약되며, 이용자에게 인사이트로 제공됩니다.</li>
              <li>녹화본 및 요약 기록은 이용자 본인과 회사의 코치만 열람할 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">제9조 (이용자의 의무)</h2>
            <ul className="list-decimal pl-5 space-y-1 text-secondary">
              <li>이용자는 서비스 이용 시 관련 법령, 이 약관, 이용안내 등을 준수하여야 합니다.</li>
              <li>이용자는 서비스를 통해 얻은 코칭 내용을 회사의 사전 동의 없이 상업적으로 이용하거나 제3자에게 제공할 수 없습니다.</li>
              <li>예약한 코칭 세션에 사전 연락 없이 불참하는 경우, 해당 세션은 사용된 것으로 처리됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">제10조 (회사의 의무)</h2>
            <ul className="list-decimal pl-5 space-y-1 text-secondary">
              <li>회사는 관련 법령과 이 약관이 정하는 바에 따라 지속적이고 안정적으로 서비스를 제공하기 위해 노력합니다.</li>
              <li>회사는 이용자의 개인정보를 보호하기 위해 관련 법령이 정하는 바에 따라 적절한 보안 시스템을 갖추어야 합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">제11조 (서비스의 중단)</h2>
            <p className="text-secondary">
              회사는 시스템 점검, 장비 교체 등 부득이한 사유가 있는 경우 서비스 제공을 일시적으로 중단할 수 있으며,
              이 경우 사전에 공지합니다. 다만, 긴급한 사유가 있는 경우 사후에 공지할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">제12조 (면책사항)</h2>
            <ul className="list-decimal pl-5 space-y-1 text-secondary">
              <li>회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적 사유로 서비스를 제공할 수 없는 경우에는 책임이 면제됩니다.</li>
              <li>코칭 서비스는 이용자의 성장을 지원하기 위한 것이며, 특정 결과를 보장하지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">제13조 (분쟁 해결)</h2>
            <p className="text-secondary">
              서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 상호 협의하여 해결하도록 노력합니다.
              협의가 이루어지지 않는 경우, 관할 법원은 제소 당시 이용자의 주소를 관할하는 지방법원으로 합니다.
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
