'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, ChevronRight, CreditCard, User } from 'lucide-react';
import Button from '../../components/Button';
import { PROGRAMS } from '../../constants';
import { ApplyStep } from '../../types';
import { loadPaymentWidget, ANONYMOUS, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

// selectedTrack(id)으로 프로그램을 찾는 헬퍼
function getProgram(trackId: string) {
  return Object.values(PROGRAMS).find(p => p.id === trackId);
}

function ApplyContent() {
  const searchParams = useSearchParams();
  const initialTrackId = searchParams?.get('track') ?? null;

  const [step, setStep] = useState<ApplyStep>(ApplyStep.TRACK_SELECTION);
  const [selectedTrack, setSelectedTrack] = useState<string>(initialTrackId || 'junior');
  const [paymentWidget, setPaymentWidget] = useState<PaymentWidgetInstance | null>(null);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const paymentMethodsRef = useRef<HTMLDivElement>(null);
  const agreementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTrackId) {
      const match = Object.values(PROGRAMS).find(p => p.id === initialTrackId);
      if (match) {
        setSelectedTrack(match.id);
      }
    }
  }, [initialTrackId]);

  // 결제 위젯 초기화
  useEffect(() => {
    if (step !== ApplyStep.PAYMENT) return;

    const program = getProgram(selectedTrack);
    if (!program || program.priceValue <= 0) return;

    loadPaymentWidget(CLIENT_KEY, ANONYMOUS)
      .then(async (widget) => {
        setPaymentWidget(widget);

        await widget.renderPaymentMethods(
          '#payment-methods',
          { value: program.priceValue }
        );

        await widget.renderAgreement('#agreement');

        setIsPaymentReady(true);
      })
      .catch((err) => {
        console.error('결제 위젯 로드 실패:', err);
      });
  }, [step, selectedTrack]);

  const nextStep = () => {
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    setIsPaymentReady(false);
    setPaymentWidget(null);
  };

  const handlePayment = async () => {
    const program = getProgram(selectedTrack);
    if (!paymentWidget || !program || isProcessing) return;
    setIsProcessing(true);

    const orderId = `mementum_${selectedTrack}_${Date.now()}`;

    try {
      await paymentWidget.requestPayment({
        orderId,
        orderName: `${program.title} 코칭 패키지`,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch {
      setIsProcessing(false);
    }
  };

  const renderProgressBar = () => (
    <div className="w-full bg-gray-100 h-2 rounded-full mb-8 overflow-hidden">
      <div
        className="bg-primary h-full transition-all duration-500 ease-in-out"
        style={{ width: `${(step / 2) * 100}%` }}
      ></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-dark">코칭 신청하기</h1>
          <p className="text-secondary mt-2">나에게 맞는 성장의 모멘텀을 찾아보세요.</p>
        </div>

        {step < ApplyStep.COMPLETE && renderProgressBar()}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Step 1: Track Selection */}
          {step === ApplyStep.TRACK_SELECTION && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                1. 트랙 선택
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {Object.values(PROGRAMS).map((program) => (
                  <div
                    key={program.id}
                    onClick={() => setSelectedTrack(program.id)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                      selectedTrack === program.id
                        ? 'border-primary bg-blue-50 shadow-sm'
                        : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className={`font-bold ${selectedTrack === program.id ? 'text-primary' : 'text-dark'}`}>
                          {program.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{program.target} · {program.price}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedTrack === program.id ? 'border-primary bg-primary' : 'border-gray-300'
                      }`}>
                        {selectedTrack === program.id && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={nextStep} size="lg" className="w-full md:w-auto">
                  다음: 결제하기 <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Payment (TossPayments Widget) */}
          {step === ApplyStep.PAYMENT && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                2. 결제
              </h2>

              {/* 주문 요약 */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>선택한 트랙</span>
                  <span className="font-medium text-dark">{getProgram(selectedTrack)?.title}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                  <span>총 결제금액</span>
                  <span className="text-primary">{getProgram(selectedTrack)?.price}</span>
                </div>
              </div>

              {/* Founder Track은 문의 */}
              {(getProgram(selectedTrack)?.priceValue ?? 0) <= 0 ? (
                <div className="text-center py-8">
                  <p className="text-secondary mb-4">Founder Track은 맞춤형 프로그램입니다.</p>
                  <a
                    href="mailto:support@mementum.lab"
                    className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors inline-block"
                  >
                    상담 문의하기
                  </a>
                </div>
              ) : (
                <>
                  {/* 토스페이먼츠 결제 수단 위젯 */}
                  <div id="payment-methods" ref={paymentMethodsRef} />

                  {/* 토스페이먼츠 약관 동의 위젯 */}
                  <div id="agreement" ref={agreementRef} />

                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={prevStep}>이전</Button>
                    <Button
                      onClick={handlePayment}
                      disabled={!isPaymentReady || isProcessing}
                      size="lg"
                      className="bg-dark hover:bg-slate-800"
                    >
                      {isProcessing ? '처리 중...' : '결제하기'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Apply() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ApplyContent />
    </Suspense>
  );
}
