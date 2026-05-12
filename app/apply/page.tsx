'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, ChevronRight, CreditCard, User, Stethoscope, Package } from 'lucide-react';
import Button from '../../components/Button';
import { DIAGNOSIS_OPTIONS, PROGRAMS, TRIAL_SURCHARGE } from '../../constants';
import { ApplyStep } from '../../types';

type PackageMode = 'full' | 'trial';
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

const formatKRW = (n: number) =>
  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(n);

function getProgram(trackId: string) {
  return Object.values(PROGRAMS).find(p => p.id === trackId);
}

function getDiagnosisOption(optionId: string) {
  return DIAGNOSIS_OPTIONS.find(o => o.id === optionId) ?? DIAGNOSIS_OPTIONS[0];
}

function ApplyContent() {
  const searchParams = useSearchParams();
  const initialTrackId = searchParams?.get('track') ?? null;
  const initialOptionId = searchParams?.get('option') ?? null;
  const initialMode: PackageMode = searchParams?.get('mode') === 'trial' ? 'trial' : 'full';

  const [step, setStep] = useState<ApplyStep>(ApplyStep.TRACK_SELECTION);
  const [selectedTrack, setSelectedTrack] = useState<string>(initialTrackId || 'junior');
  const [selectedOption, setSelectedOption] = useState<string>(initialOptionId || 'basic');
  const [packageMode, setPackageMode] = useState<PackageMode>(initialMode);
  const [trialCreditAmount, setTrialCreditAmount] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [widgets, setWidgets] = useState<any>(null);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const program = getProgram(selectedTrack);
  const option = getDiagnosisOption(selectedOption);
  const isFriend = program?.audience === 'friend';

  const isTrial = packageMode === 'trial';
  const baseAmount = !program
    ? 0
    : isTrial
      ? program.pricePerSession + TRIAL_SURCHARGE
      : program.priceValue;
  // 체험권 차감은 정규 패키지(full)에만 적용, 친구 트랙은 차감 없음
  const creditDiscount = isTrial || isFriend
    ? 0
    : Math.min(trialCreditAmount, baseAmount + option.addPrice);
  const totalAmount = baseAmount + option.addPrice - creditDiscount;
  const baseLabel = isFriend
    ? '1:1 정용훈 코칭 (1회 60분)'
    : isTrial
      ? '1회 체험권'
      : `${program?.title ?? ''} 4회 패키지`;

  useEffect(() => {
    if (initialTrackId) {
      const match = Object.values(PROGRAMS).find(p => p.id === initialTrackId);
      if (match) {
        setSelectedTrack(match.id);
      }
    }
  }, [initialTrackId]);

  useEffect(() => {
    if (initialOptionId && DIAGNOSIS_OPTIONS.some(o => o.id === initialOptionId)) {
      setSelectedOption(initialOptionId);
    }
  }, [initialOptionId]);

  // Founder는 단가 0이라 체험권 불가 → full로 강제
  useEffect(() => {
    if (program && program.pricePerSession <= 0 && packageMode === 'trial') {
      setPackageMode('full');
    }
  }, [program, packageMode]);

  // 친구 트랙은 단발 단일 옵션 강제
  useEffect(() => {
    if (isFriend) {
      setPackageMode('full');
      setSelectedOption('basic');
    }
  }, [isFriend]);

  // 트랙 변경 시 체험권 잔액 조회
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/payments/trial-credit?track=${encodeURIComponent(selectedTrack)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setTrialCreditAmount(data.creditAmount ?? 0);
        }
      } catch {
        if (!cancelled) setTrialCreditAmount(0);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedTrack]);

  // v2 결제 위젯 초기화
  useEffect(() => {
    if (step !== ApplyStep.PAYMENT) return;
    if (!program || totalAmount <= 0) return;

    (async () => {
      try {
        const tossPayments = await loadTossPayments(CLIENT_KEY);
        const w = tossPayments.widgets({ customerKey: ANONYMOUS });

        await w.setAmount({ currency: 'KRW', value: totalAmount });
        await w.renderPaymentMethods({ selector: '#payment-methods' });
        await w.renderAgreement({ selector: '#agreement' });

        setWidgets(w);
        setIsPaymentReady(true);
      } catch (err) {
        console.error('결제 위젯 로드 실패:', err);
      }
    })();
  }, [step, selectedTrack, selectedOption, packageMode, totalAmount, program]);

  const nextStep = () => {
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    setIsPaymentReady(false);
    setWidgets(null);
  };

  const handlePayment = async () => {
    if (!widgets || !program || isProcessing) return;
    setIsProcessing(true);

    const orderId = `mementum_${selectedTrack}_${packageMode}_${selectedOption}_${Date.now()}`;
    const orderLabel = isFriend
      ? `${program.title} 1회`
      : isTrial
        ? `${program.title} 1회 체험`
        : `${program.title} 4회 패키지`;

    try {
      await widgets.requestPayment({
        orderId,
        orderName: `${orderLabel} + ${option.name}`,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      console.error('결제 요청 실패:', err);
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
          {/* Step 1: Track + Diagnosis Option Selection */}
          {step === ApplyStep.TRACK_SELECTION && (
            <div className="space-y-8">
              {isFriend ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    신청 내역
                  </h2>
                  <div className="p-5 rounded-xl border-2 border-primary bg-blue-50">
                    <h3 className="font-bold text-primary text-lg">{program?.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {program?.target} · 1회 60분 · {formatKRW(program?.priceValue ?? 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                      {program?.longDescription}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    1. 트랙 선택
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.values(PROGRAMS).filter((p) => p.audience !== 'friend').map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedTrack(p.id)}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                          selectedTrack === p.id
                            ? 'border-primary bg-blue-50 shadow-sm'
                            : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className={`font-bold ${selectedTrack === p.id ? 'text-primary' : 'text-dark'}`}>
                              {p.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{p.target} · {p.price}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedTrack === p.id ? 'border-primary bg-primary' : 'border-gray-300'
                          }`}>
                            {selectedTrack === p.id && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Package Mode (Founder·친구 트랙 제외) */}
              {!isFriend && (program?.pricePerSession ?? 0) > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    2. 수강 형태 선택
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setPackageMode('full')}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                        packageMode === 'full'
                          ? 'border-primary bg-blue-50 shadow-sm'
                          : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={`font-bold ${packageMode === 'full' ? 'text-primary' : 'text-dark'}`}>
                          정규 4회 패키지
                        </h3>
                        {packageMode === 'full' && <Check className="w-4 h-4 text-primary" />}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        회당 {formatKRW(program?.pricePerSession ?? 0)} × 4회 · 4개월 내 자율
                      </p>
                      <p className="text-sm font-bold text-dark">{formatKRW(program?.priceValue ?? 0)}</p>
                    </div>

                    <div
                      onClick={() => setPackageMode('trial')}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                        packageMode === 'trial'
                          ? 'border-primary bg-blue-50 shadow-sm'
                          : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={`font-bold ${packageMode === 'trial' ? 'text-primary' : 'text-dark'}`}>
                          1회 체험권
                        </h3>
                        {packageMode === 'trial' && <Check className="w-4 h-4 text-primary" />}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">약정 없는 단발 체험</p>
                      <p className="text-sm font-bold text-dark">
                        {formatKRW((program?.pricePerSession ?? 0) + TRIAL_SURCHARGE)}
                      </p>
                      <p className="text-[11px] text-primary mt-2 leading-relaxed">
                        이후 4회 패키지 결제 시 체험비 전액 차감
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 친구 트랙 결제 요약 (진단 옵션 없음) */}
              {isFriend && (
                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{baseLabel}</span>
                    <span className="font-medium text-dark">{formatKRW(baseAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2">
                    <span>예상 결제금액</span>
                    <span className="text-primary">{formatKRW(totalAmount)}</span>
                  </div>
                </div>
              )}

              {/* Diagnosis Option (Founder·친구 트랙 제외) */}
              {!isFriend && (program?.priceValue ?? 0) > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-primary" />
                    3. 진단 옵션 선택
                  </h2>
                  <p className="text-sm text-secondary">
                    트랙과 무관하게 본인이 원하는 진단을 자유롭게 선택할 수 있습니다.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {DIAGNOSIS_OPTIONS.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedOption(opt.id)}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                          selectedOption === opt.id
                            ? 'border-primary bg-blue-50 shadow-sm'
                            : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <h3 className={`font-bold ${selectedOption === opt.id ? 'text-primary' : 'text-dark'}`}>
                              {opt.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed whitespace-pre-line">{opt.description}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-sm font-bold ${opt.addPrice === 0 ? 'text-primary' : 'text-dark'}`}>
                              {opt.addPrice === 0 ? '기본 포함' : `+${formatKRW(opt.addPrice)}`}
                            </span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedOption === opt.id ? 'border-primary bg-primary' : 'border-gray-300'
                            }`}>
                              {selectedOption === opt.id && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{baseLabel}</span>
                      <span className="font-medium text-dark">{formatKRW(baseAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>진단 옵션 ({option.name})</span>
                      <span className="font-medium text-dark">
                        {option.addPrice === 0 ? '₩0' : `+${formatKRW(option.addPrice)}`}
                      </span>
                    </div>
                    {creditDiscount > 0 && (
                      <div className="flex justify-between text-sm text-primary">
                        <span>기존 체험권 차감</span>
                        <span className="font-medium">-{formatKRW(creditDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2">
                      <span>예상 결제금액</span>
                      <span className="text-primary">{formatKRW(totalAmount)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button onClick={nextStep} size="lg" className="w-full md:w-auto">
                  다음: 결제하기 <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Payment (TossPayments Widget v2) */}
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
                  <span className="font-medium text-dark">{program?.title}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{baseLabel}</span>
                  <span className="font-medium text-dark">{formatKRW(baseAmount)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>진단 옵션 ({option.name})</span>
                  <span className="font-medium text-dark">
                    {option.addPrice === 0 ? '₩0' : `+${formatKRW(option.addPrice)}`}
                  </span>
                </div>
                {creditDiscount > 0 && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>기존 체험권 차감</span>
                    <span className="font-medium">-{formatKRW(creditDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                  <span>총 결제금액</span>
                  <span className="text-primary">{formatKRW(totalAmount)}</span>
                </div>
              </div>

              {/* Founder Track은 문의 */}
              {(program?.priceValue ?? 0) <= 0 ? (
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
                  <div id="payment-methods" style={{ minHeight: '200px' }} />

                  {/* 토스페이먼츠 약관 동의 위젯 */}
                  <div id="agreement" />

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
