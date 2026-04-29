'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Clock, ChevronRight, Star, Info } from 'lucide-react';
import { DIAGNOSIS_OPTIONS, PROGRAMS, TRIAL_SURCHARGE } from '../../../constants';
import { TrackType } from '../../../types';
import Button from '../../../components/Button';
import { Card, CardHeader, CardTitle, CardContent, Badge, AccordionItem, Separator } from '../../../components/ui-kit';

const formatKRW = (n: number) =>
  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(n);

export default function Program() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  // Find program by ID or default to Junior
  const programKey = Object.keys(PROGRAMS).find(key => PROGRAMS[key].id === id) || TrackType.JUNIOR;
  const program = PROGRAMS[programKey];

  // State for accordion
  const [openWeek, setOpenWeek] = useState<number | null>(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!program) return <div>Program not found</div>;

  const isFounder = program.id === 'founder';

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-dark text-white pt-24 pb-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="max-w-3xl">
              <div className="flex gap-2 mb-6">
                <Badge variant="default" className="bg-primary text-white font-bold border-none hover:bg-primary-hover">Track</Badge>
                <Badge variant="outline" className="text-white border-white/30 bg-white/10 hover:bg-white/20">For {program.target}</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">{program.title}</h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl">{program.description}</p>

              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{program.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span>4.9/5.0 만족도</span>
                </div>
              </div>
            </div>

            {/* CTA Box for Desktop */}
            <div className="hidden md:block bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-80 shrink-0 shadow-lg">
              {isFounder ? (
                <>
                  <div className="text-sm text-gray-300 mb-1">수강료</div>
                  <div className="text-3xl font-bold mb-4">{program.price}</div>
                </>
              ) : (
                <>
                  <div className="text-sm text-gray-300 mb-1">정규 4회 패키지</div>
                  <div className="text-3xl font-bold mb-1">{formatKRW(program.priceValue)}</div>
                  <div className="text-sm text-gray-400">
                    회당 {formatKRW(program.pricePerSession)} × 4회 · 4개월 내 자율 진행
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 mb-4">
                    * 선택 진단 옵션에 따라 추가 비용 발생
                  </p>
                </>
              )}
              <Link href={`/apply?track=${program.id}`}>
                <Button fullWidth className="bg-primary hover:bg-primary-hover border-none">정규 4회 신청</Button>
              </Link>
              {!isFounder && (
                <>
                  <Link href={`/apply?track=${program.id}&mode=trial`} className="block mt-2">
                    <Button
                      fullWidth
                      className="bg-transparent text-white border border-white/30 hover:bg-white/10 hover:border-white/50 focus:ring-white/40"
                    >
                      1회 체험 · {formatKRW(program.pricePerSession + TRIAL_SURCHARGE)}
                    </Button>
                  </Link>
                  <p className="text-[11px] text-center text-gray-400 mt-2 leading-relaxed">
                    체험 후 정규 결제 시 체험비 전액 차감
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-12">

            {/* About Program */}
            <section>
              <h2 className="text-2xl font-bold text-dark mb-4">프로그램 소개</h2>
              <p className="text-secondary leading-relaxed text-lg">
                {program.longDescription}
              </p>
            </section>

            <Separator />

            {/* Recommended For */}
            <section>
              <h2 className="text-2xl font-bold text-dark mb-6">이런 분들께 추천합니다</h2>
              <div className="grid grid-cols-1 gap-4">
                {program.recommendedFor.map((rec, idx) => (
                  <Card key={idx} className="bg-blue-50/50 border-blue-100 hover:border-primary/30 transition-colors">
                    <CardContent className="flex items-center gap-4 py-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-dark">{rec}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <Separator />

            {/* Curriculum Accordion */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-dark">코칭 주제</h2>
                <Badge variant="secondary">{isFounder ? '맞춤 운영' : '4개월 내 4회 세션'}</Badge>
              </div>
              <p className="text-sm text-secondary mb-4 flex items-start gap-2">
                <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>4개월 안에 자유로운 일정으로 4회 세션을 진행하며, 아래 주제들 중 본인 상황에 맞춰 함께 다룹니다.</span>
              </p>

              <div className="border border-gray-200 rounded-xl divide-y divide-gray-200">
                {program.curriculum.map((item) => (
                  <div key={item.week} className="px-6">
                    <AccordionItem
                      title={`${item.week}. ${item.title}`}
                      isOpen={openWeek === item.week}
                      onClick={() => setOpenWeek(openWeek === item.week ? null : item.week)}
                    >
                      {item.description}
                    </AccordionItem>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Mobile CTA (Hidden on desktop) */}
              <div className="md:hidden bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
                {isFounder ? (
                  <>
                    <div className="text-sm text-gray-500 mb-1">수강료</div>
                    <div className="text-3xl font-bold mb-4 text-dark">{program.price}</div>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-gray-500 mb-1">정규 4회 패키지</div>
                    <div className="text-3xl font-bold mb-1 text-dark">{formatKRW(program.priceValue)}</div>
                    <div className="text-sm text-gray-500">
                      회당 {formatKRW(program.pricePerSession)} × 4회 · 4개월 내 자율
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 mb-4">
                      * 선택 진단 옵션에 따라 추가 비용 발생
                    </p>
                  </>
                )}
                <Link href={`/apply?track=${program.id}`}>
                  <Button fullWidth>정규 4회 신청</Button>
                </Link>
                {!isFounder && (
                  <>
                    <Link href={`/apply?track=${program.id}&mode=trial`} className="block mt-2">
                      <Button fullWidth variant="outline">
                        1회 체험 · {formatKRW(program.pricePerSession + TRIAL_SURCHARGE)}
                      </Button>
                    </Link>
                    <p className="text-[11px] text-center text-gray-500 mt-2 leading-relaxed">
                      체험 후 정규 결제 시 체험비 전액 차감
                    </p>
                  </>
                )}
              </div>

              {/* Diagnosis Options Card */}
              {!isFounder && (
                <Card>
                  <CardHeader>
                    <CardTitle>선택 가능한 진단 옵션</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-secondary leading-relaxed mb-2">
                      트랙과 무관하게 본인이 원하는 진단을 자유롭게 선택할 수 있습니다.
                      옵션은 결제 단계에서 선택하며, 선택에 따라 금액이 추가됩니다.
                    </p>
                    {DIAGNOSIS_OPTIONS.map((opt) => (
                      <div key={opt.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-dark">{opt.name}</p>
                          <p className="text-xs text-secondary mt-1 leading-relaxed whitespace-pre-line">{opt.description}</p>
                        </div>
                        <span className={`text-sm font-bold shrink-0 ${opt.addPrice === 0 ? 'text-primary' : 'text-dark'}`}>
                          {opt.addPrice === 0 ? '기본 포함' : `+${formatKRW(opt.addPrice)}`}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Benefits Card */}
              <Card>
                <CardHeader>
                  <CardTitle>수강생 혜택</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {program.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 px-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-secondary">{feature}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Coach Profile Card (Mock) */}
              <Card>
                <CardHeader>
                  <CardTitle>전담 코치</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      <img src="https://picsum.photos/200" alt="Coach" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Sarah Kim</p>
                      <p className="text-xs text-gray-500">KPC 인증 코치</p>
                    </div>
                  </div>
                  <p className="text-sm text-secondary mb-4">
                    "이론이 아닌 경험으로, 정답이 아닌 방향을 코칭합니다."
                  </p>
                  <Link href="/about" className="text-primary text-sm font-medium hover:underline flex items-center">
                    코치 소개 더보기 <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
