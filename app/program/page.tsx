'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { PROGRAMS, COACHING_PROCESS_STEPS } from '../../constants';
import { ArrowRight, Check } from 'lucide-react';
import Button from '../../components/Button';
import { Card, CardContent } from '../../components/ui-kit';

export default function ProgramLanding() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-dark text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Programs</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Me-mentum은 단순한 지식 전달이 아닌,<br />
            실제 행동 변화를 이끌어내는 체계적인 코칭 프로세스를 제공합니다.
          </p>
        </div>
      </div>

      {/* 4-Step Process Section */}
      <section id="process" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4">Me-mentum Coaching Process</h2>
            <p className="text-secondary text-lg">데이터 기반의 진단부터 실행까지, 4단계 성장 로드맵</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 z-0"></div>

            {COACHING_PROCESS_STEPS.map((step, idx) => (
              <div key={idx} className="relative z-10 bg-white group">
                <div className="w-24 h-24 bg-white border-2 border-primary text-primary rounded-full flex flex-col items-center justify-center mx-auto mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-lg">
                  <span className="text-sm font-medium opacity-80">Step</span>
                  <span className="text-2xl font-bold">{step.step}</span>
                </div>

                <div className="text-center px-4">
                  <h3 className="text-xl font-bold text-dark mb-1">{step.title}</h3>
                  <p className="text-sm text-primary font-medium mb-4 uppercase tracking-wide">{step.subtitle}</p>
                  <p className="text-secondary text-sm leading-relaxed mb-6 min-h-[80px]">
                    {step.description}
                  </p>

                  <div className="bg-blue-50/50 rounded-lg p-4 text-left">
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start text-xs text-secondary">
                          <Check className="w-3 h-3 text-primary mr-2 mt-0.5 shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track List Section */}
      <section className="py-24 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4">Select Your Track</h2>
            <p className="text-secondary text-lg">당신의 현재 상황과 목표에 맞는 최적의 트랙을 선택하세요.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.values(PROGRAMS).filter((p) => p.audience !== 'friend').map((program) => (
              <Link key={program.id} href={`/program/${program.id}`} className="group">
                <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="text-primary font-bold text-sm tracking-widest uppercase mb-2">
                          For {program.target}
                        </div>
                        <h3 className="text-2xl font-bold text-dark group-hover:text-primary transition-colors">
                          {program.title}
                        </h3>
                      </div>
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="text-secondary mb-8 flex-grow leading-relaxed">
                      {program.description}
                    </p>

                    <div className="space-y-3 border-t border-gray-100 pt-6">
                      {program.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <Check className="w-4 h-4 text-primary mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
