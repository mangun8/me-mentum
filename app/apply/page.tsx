'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, ChevronRight, Calendar, CreditCard, User } from 'lucide-react';
import Button from '../../components/Button';
import { PROGRAMS } from '../../constants';
import { ApplyStep } from '../../types';

function ApplyContent() {
  const searchParams = useSearchParams();
  const initialTrackId = searchParams?.get('track') ?? null;

  const [step, setStep] = useState<ApplyStep>(ApplyStep.TRACK_SELECTION);
  const [selectedTrack, setSelectedTrack] = useState<string>(initialTrackId || 'junior');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Auto-select track if provided in URL
  useEffect(() => {
    if (initialTrackId) {
      const match = Object.values(PROGRAMS).find(p => p.id === initialTrackId);
      if (match) {
        setSelectedTrack(match.id);
      }
    }
  }, [initialTrackId]);

  const nextStep = () => {
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const renderProgressBar = () => (
    <div className="w-full bg-gray-100 h-2 rounded-full mb-8 overflow-hidden">
      <div
        className="bg-primary h-full transition-all duration-500 ease-in-out"
        style={{ width: `${(step / 3) * 100}%` }}
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
                  다음: 일정 선택 <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Schedule (Mock Calendly) */}
          {step === ApplyStep.SCHEDULE && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                2. 첫 세션 일정 예약
              </h2>
              <p className="text-sm text-gray-500">원활한 코칭을 위해 첫 번째 세션(Kick-off) 시간을 예약해주세요.</p>

              <div className="border border-gray-200 rounded-xl p-4">
                {/* Mock Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-gray-400 font-medium py-2">{d}</div>
                  ))}
                  {Array.from({ length: 30 }).map((_, i) => (
                    <button
                      key={i}
                      disabled={i < 5} // Disable past dates
                      onClick={() => setSelectedDate(`2024-06-${i + 1}`)}
                      className={`py-2 rounded-lg hover:bg-blue-50 focus:outline-none transition-colors ${
                        i < 5 ? 'text-gray-300 cursor-not-allowed' : 'text-dark font-medium'
                      } ${selectedDate === `2024-06-${i + 1}` ? 'bg-primary text-white hover:bg-primary-hover shadow-sm' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                {selectedDate && (
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h4 className="font-medium mb-3">가능한 시간대</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['10:00', '14:00', '16:00', '19:00'].map(time => (
                        <button key={time} className="px-3 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 text-sm font-medium transition-colors">
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={prevStep}>이전</Button>
                <Button onClick={nextStep} disabled={!selectedDate} size="lg">
                  다음: 결제하기 <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === ApplyStep.PAYMENT && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                3. 결제 정보
              </h2>

              <div className="bg-gray-50 p-4 rounded-xl space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>선택한 트랙</span>
                  <span className="font-medium text-dark">{PROGRAMS[selectedTrack]?.title}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>예약 일정</span>
                  <span className="font-medium text-dark">{selectedDate} 14:00</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                  <span>총 결제금액</span>
                  <span className="text-primary">{PROGRAMS[selectedTrack]?.price}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">이름</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="홍길동" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">카드 번호</label>
                  <div className="flex gap-2">
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="0000-0000-0000-0000" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="ghost" onClick={prevStep}>이전</Button>
                <Button onClick={nextStep} size="lg" className="bg-dark hover:bg-slate-800">
                  결제하기
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === ApplyStep.COMPLETE && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-dark mb-4">신청이 완료되었습니다!</h2>
              <p className="text-secondary mb-8">
                코칭 신청 확인 메일이 발송되었습니다.<br />
                예약하신 시간에 뵙겠습니다.
              </p>
              <Link href="/">
                <Button>메인으로 돌아가기</Button>
              </Link>
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
