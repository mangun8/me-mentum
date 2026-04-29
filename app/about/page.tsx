'use client';

import React, { useState } from 'react';
import { Award, BookOpen, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../components/Button';
import Link from 'next/link';
import { COACH_CERTIFICATIONS } from '../../constants';

export default function About() {
  const [activeCert, setActiveCert] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Intro */}
      <div className="py-24 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-dark mb-8">
          우리는 누구나 자신만의<br />
          <span className="text-primary">위대한 모멘텀</span>을 가지고 있다고 믿습니다.
        </h1>
        <p className="text-xl text-secondary leading-relaxed">
          스타트업은 빠르게 성장하지만, 그 안의 구성원들은 종종 방향을 잃습니다.<br />
          Me-mentum은 '속도'보다 '방향'을, '열심'보다 '맥락'을 코칭합니다.
        </p>
      </div>

      {/* Coach Profile */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-12">
            <div className="w-full md:w-1/3 sticky top-24">
              <div className="aspect-[3/4] bg-gray-200 rounded-2xl overflow-hidden relative shadow-xl">
                <img
                  src="/coach-yonghun.jpg"
                  alt="Yonghun Jeong (정용훈)"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6">
                  <p className="text-white font-bold text-xl">Yonghun Jeong(정용훈)</p>
                  <p className="text-gray-300 text-sm">Head Coach & Founder</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl font-bold text-dark mb-6">Coach&apos;s Philosophy</h2>
              <div className="space-y-8 mb-16">
                <div className="flex gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm h-fit">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Professionalism</h3>
                    <p className="text-secondary">
                      ICF(국제코칭연맹) 인증 코치 자격(PCC)을 보유하고 있으며,
                      10년 이상의 IT 스타트업 HR 리더 경험을 바탕으로 현실적인 솔루션을 제시합니다.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm h-fit">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Evidence-Based</h3>
                    <p className="text-secondary">
                      단순한 '감'이 아닌, 심리학과 경영학 이론에 기반한 진단 도구를 사용합니다.
                      모든 코칭 세션은 구조화된 프로세스를 따릅니다.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm h-fit">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Psychological Safety</h3>
                    <p className="text-secondary">
                      코칭 룸은 가장 안전한 대화의 장입니다.
                      어떤 고민이든 비판 없이 경청하며, 스스로 답을 찾을 수 있도록 돕습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Certifications & Tools (Interactive) */}
              <div className="border-t border-gray-200 pt-12">
                <h3 className="text-2xl font-bold text-dark mb-8">Certifications & Tools</h3>
                <div className="grid grid-cols-1 gap-4">
                  {COACH_CERTIFICATIONS.map((cert) => (
                    <div
                      key={cert.id}
                      className={`bg-white border rounded-xl transition-all duration-300 overflow-hidden ${
                        activeCert === cert.id
                          ? 'border-primary shadow-md ring-1 ring-primary'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <button
                        onClick={() => setActiveCert(activeCert === cert.id ? null : cert.id)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
                            activeCert === cert.id ? 'bg-primary text-white' : 'bg-blue-50 text-primary'
                          }`}>
                            {cert.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className={`font-bold text-lg ${activeCert === cert.id ? 'text-primary' : 'text-dark'}`}>
                              {cert.name}
                            </h4>
                            <p className="text-sm text-gray-500">{cert.summary}</p>
                          </div>
                        </div>
                        {activeCert === cert.id ? (
                          <ChevronUp className="w-5 h-5 text-primary" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      <div className={`px-6 bg-gray-50 transition-all duration-300 ease-in-out ${
                        activeCert === cert.id ? 'max-h-48 py-6 opacity-100' : 'max-h-0 py-0 opacity-0'
                      }`}>
                        <p className="text-secondary leading-relaxed">
                          {cert.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12">
                <Link href="/apply">
                  <Button size="lg">코치와 커피챗 신청하기 (무료)</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
