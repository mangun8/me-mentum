import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: '개인정보처리방침 | Me-mentum',
  description: 'Me-mentum 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark mb-2">개인정보처리방침</h1>
        <p className="text-sm text-gray-400 mb-12">시행일: 2025년 4월 1일</p>

        <div className="prose prose-gray max-w-none text-[15px] leading-relaxed space-y-10">
          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">1. 개인정보의 수집 및 이용 목적</h2>
            <p className="text-secondary">
              미멘텀(이하 &quot;회사&quot;)은 다음의 목적을 위하여 개인정보를 처리합니다.
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
              이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-secondary">
              <li>회원 가입 및 관리: 회원제 서비스 이용에 따른 본인확인, 서비스 부정이용 방지</li>
              <li>서비스 제공: 코칭 세션 예약·진행·관리, 코칭 결과물 제공</li>
              <li>결제 및 환불 처리: 수강권 결제, 환불 처리</li>
              <li>마케팅 및 서비스 개선: 서비스 이용 통계 분석, 맞춤형 서비스 제공</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">2. 수집하는 개인정보 항목</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-medium text-dark">수집 방법</th>
                  <th className="text-left py-2 font-medium text-dark">수집 항목</th>
                </tr>
              </thead>
              <tbody className="text-secondary">
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">Google 로그인</td>
                  <td className="py-2">이메일 주소, 이름, 프로필 이미지</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">카카오 로그인</td>
                  <td className="py-2">이메일 주소, 닉네임, 프로필 이미지</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">네이버 로그인</td>
                  <td className="py-2">이메일 주소, 이름, 프로필 이미지</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">결제 시</td>
                  <td className="py-2">결제 수단 정보(토스페이먼츠를 통해 처리, 회사는 카드번호 등을 직접 저장하지 않음)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">서비스 이용 중</td>
                  <td className="py-2">코칭 세션 녹화본(음성), 세션 요약 기록, 예약 이력</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">자동 수집</td>
                  <td className="py-2">접속 IP, 브라우저 유형, 방문 일시, 서비스 이용 기록(Google Analytics를 통해 수집)</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">3. 개인정보의 보유 및 이용 기간</h2>
            <p className="text-secondary">
              회원 탈퇴 시까지 보유하며, 탈퇴 후에는 지체 없이 파기합니다.
              단, 관계 법령에 의해 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-secondary">
              <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
              <li>웹사이트 방문 기록: 3개월 (통신비밀보호법)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">4. 개인정보의 제3자 제공</h2>
            <p className="text-secondary">
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-secondary">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">5. 개인정보 처리의 위탁</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-medium text-dark">위탁받는 자</th>
                  <th className="text-left py-2 font-medium text-dark">위탁 업무 내용</th>
                </tr>
              </thead>
              <tbody className="text-secondary">
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">토스페이먼츠</td>
                  <td className="py-2">결제 처리</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">Supabase (미국)</td>
                  <td className="py-2">회원 인증 및 데이터 저장</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">Cal.com</td>
                  <td className="py-2">코칭 세션 예약 관리</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Vercel (미국)</td>
                  <td className="py-2">웹사이트 호스팅</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">6. 정보주체의 권리·의무 및 행사 방법</h2>
            <p className="text-secondary">
              이용자는 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
              권리 행사는 아래 연락처로 이메일을 통해 하실 수 있으며, 지체 없이 조치하겠습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">7. 개인정보의 파기</h2>
            <p className="text-secondary">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
              지체 없이 해당 개인정보를 파기합니다. 전자적 파일 형태의 정보는 복구 및 재생할 수 없도록
              안전하게 삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">8. 개인정보 보호책임자</h2>
            <ul className="text-secondary space-y-1">
              <li>성명: 정용훈</li>
              <li>직책: 대표</li>
              <li>이메일: admin@mementum.me</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-3">9. 개인정보처리방침의 변경</h2>
            <p className="text-secondary">
              이 개인정보처리방침은 2025년 4월 1일부터 적용됩니다.
              변경 사항이 있을 경우 웹사이트를 통해 공지할 예정입니다.
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
