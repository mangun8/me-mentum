'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Clock, Users, ChevronRight, Star } from 'lucide-react';
import { PROGRAMS } from '../../../constants';
import { TrackType } from '../../../types';
import Button from '../../../components/Button';
import { Card, CardHeader, CardTitle, CardContent, Badge, AccordionItem, Separator } from '../../../components/ui-kit';

export default function Program() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  // Find program by ID or default to Junior
  const programKey = Object.keys(PROGRAMS).find(key => PROGRAMS[key].id === id) || TrackType.JUNIOR;
  const program = PROGRAMS[programKey];

  // State for accordion
  const [openWeek, setOpenWeek] = useState<number | null>(1);

  // State for pricing plan
  const [planType, setPlanType] = useState<'basic' | 'premium'>('basic');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!program) return <div>Program not found</div>;

  const isFounder = program.id === 'founder';
  const currentPrice = isFounder
    ? program.price
    : new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(
        planType === 'basic' ? program.priceValue : program.priceValue + 50000
      );

  const currentBenefit = planType === 'basic'
    ? '데이터 기반 자가진단 (LCP 무료 버전)'
    : '심층 강점 진단 리포트 (CliftonStrengths / LCP Full)';

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
                  <Users className="w-5 h-5 text-primary" />
                  <span>최대 6명 소수 정예</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span>4.9/5.0 만족도</span>
                </div>
              </div>
            </div>

            {/* CTA Box for Desktop */}
            <div className="hidden md:block bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-80 shrink-0 shadow-lg">
              {!isFounder && (
                <div className="flex flex-col gap-2 mb-6">
                  <div
                    onClick={() => setPlanType('basic')}
                    className={`cursor-pointer p-3 rounded-lg border transition-all ${
                      planType === 'basic'
                        ? 'bg-primary/20 border-primary ring-1 ring-primary'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-white">기본 코칭</span>
                      {planType === 'basic' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                    </div>
                    <p className="text-xs text-gray-400">오프너 진단 (LCP 무료 버전) 포함</p>
                  </div>

                  <div
                    onClick={() => setPlanType('premium')}
                    className={`cursor-pointer p-3 rounded-lg border transition-all ${
                      planType === 'premium'
                        ? 'bg-primary/20 border-primary ring-1 ring-primary'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-white">프리미엄 진단 코칭</span>
                      {planType === 'premium' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                    </div>
                    <p className="text-xs text-gray-400">기본 진단 + 심층 강점 진단 리포트 포함</p>
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-300 mb-1">수강료</div>
              <div className="text-3xl font-bold mb-6">{currentPrice}</div>
              <Link href={`/apply?track=${program.id}&plan=${planType}`}>
                <Button fullWidth className="bg-primary hover:bg-primary-hover border-none">지금 신청하기</Button>
              </Link>
              <p className="text-xs text-center text-gray-400 mt-3">카드 무이자 할부 가능</p>
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
                <h2 className="text-2xl font-bold text-dark">커리큘럼</h2>
                <Badge variant="secondary">Total {program.curriculum.length} Weeks</Badge>
              </div>

              <div className="border border-gray-200 rounded-xl divide-y divide-gray-200">
                {program.curriculum.map((item) => (
                  <div key={item.week} className="px-6">
                    <AccordionItem
                      title={`Week ${item.week}. ${item.title}`}
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
                <div className="text-sm text-gray-500 mb-1">수강료</div>
                <div className="text-3xl font-bold mb-4 text-dark">{program.price}</div>
                <Link href={`/apply?track=${program.id}`}>
                  <Button fullWidth>지금 신청하기</Button>
                </Link>
              </div>

              {/* Benefits Card */}
              <Card>
                <CardHeader>
                  <CardTitle>수강생 혜택</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Dynamic First Benefit */}
                  {!isFounder && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-bold text-primary">{currentBenefit}</span>
                    </div>
                  )}

                  {program.features.slice(isFounder ? 0 : 1).map((feature, idx) => (
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
