import React from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart2, Brain, Activity } from 'lucide-react';
import Button from '../components/Button';
import { DIAGNOSIS_TOOLS, REVIEWS } from '../constants';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue-50 border border-blue-100 text-primary font-semibold text-sm tracking-wide uppercase">
              Professional Coaching
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-dark mb-6 leading-tight">
              성장의 모멘텀은<br />
              <span className="text-primary">나에 대한 이해</span>로부터<br />
              시작합니다
            </h1>
            <p className="text-lg md:text-xl text-secondary mb-10 max-w-2xl leading-relaxed">
              막연한 조언이 아닌, 검증된 자가진단 데이터에 기반한 코칭.<br />
              Me-mentum이 당신을 성과를 내는 '진짜 일잘러'로 성장시켜 드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/program">
                <Button size="lg" className="gap-2 font-bold">
                  코칭 프로세스 <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/apply">
                <Button size="lg" variant="outline">
                  코칭 신청하기
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Abstract Background Element - Minimalist Circle */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl opacity-50 -translate-y-1/4 translate-x-1/4 -z-10"></div>

        {/* Hero Graphic - Data Visualization */}
        <div className="hidden lg:block absolute top-20 right-10 xl:right-20 w-[480px] h-[560px] z-0">
          <div className="relative w-full h-full">
            {/* Floating Cards */}
            <div className="absolute top-10 right-10 w-64 p-5 bg-white rounded-xl shadow-lg border border-gray-100 z-20 animate-float">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-gray-500">Growth Rate</span>
                <span className="text-primary font-bold text-lg">+124%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[80%]"></div>
              </div>
            </div>

            {/* Main Chart Card */}
            <div className="absolute bottom-0 left-0 w-full h-[450px] bg-white rounded-2xl shadow-xl border border-gray-100 p-8 overflow-hidden">
              <div className="flex justify-between items-end h-full pb-8 px-4 gap-6">
                {/* Bar 1 */}
                <div className="w-1/4 h-[40%] bg-blue-50 rounded-t-lg relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold text-gray-400">Q1</div>
                </div>
                {/* Bar 2 */}
                <div className="w-1/4 h-[55%] bg-blue-100 rounded-t-lg relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold text-gray-400">Q2</div>
                </div>
                {/* Bar 3 */}
                <div className="w-1/4 h-[70%] bg-blue-200 rounded-t-lg relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold text-gray-400">Q3</div>
                </div>
                {/* Bar 4 (Active) */}
                <div className="w-1/4 h-[90%] bg-primary rounded-t-lg relative">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-dark text-white text-xs font-bold px-2 py-1 rounded">Now</div>
                </div>
              </div>
              {/* Progress Bar Section */}
              <div className="absolute bottom-6 left-8 right-8">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="font-bold text-dark">Leadership</span>
                  <span className="font-bold text-primary">92%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-primary h-full rounded-full w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              성장의 길목에서 마주하는<br />
              <span className="text-primary">깊은 고민들</span>
            </h2>
            <p className="text-secondary text-lg">당신만 겪는 문제가 아닙니다. 다음 단계로 도약하기 위한 성장통입니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Junior */}
            <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 hover:border-primary/30 transition-colors">
              <div className="text-primary font-bold text-sm tracking-widest uppercase mb-4">Junior Level</div>
              <h3 className="text-2xl font-bold text-dark mb-6">의욕과 현실의 괴리</h3>
              <p className="text-secondary leading-relaxed text-lg">
                "잘하고 싶은 마음은 굴뚝같은데, 마음처럼 성과가 나지 않아 위축됩니다. 쏟아지는 피드백 속에서 나만의 강점이 무엇인지, 어떻게 '일머리'를 키워야 할지 막막하기만 합니다."
              </p>
            </div>

            {/* Middle */}
            <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 hover:border-primary/30 transition-colors">
              <div className="text-primary font-bold text-sm tracking-widest uppercase mb-4">Middle Level</div>
              <h3 className="text-2xl font-bold text-dark mb-6">성장 정체의 늪</h3>
              <p className="text-secondary leading-relaxed text-lg">
                "연차는 쌓이는데 실력은 제자리걸음입니다. 매일 야근하며 뼈를 갈아 넣고 있지만, 이직 시장에 내놓을 나만의 확실한 '무기'가 없어 도태되는 듯한 불안감이 듭니다."
              </p>
            </div>

            {/* Leader */}
            <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 hover:border-primary/30 transition-colors">
              <div className="text-primary font-bold text-sm tracking-widest uppercase mb-4">Leader Level</div>
              <h3 className="text-2xl font-bold text-dark mb-6">과거 성공 방식의 한계</h3>
              <p className="text-secondary leading-relaxed text-lg">
                "실무자일 땐 에이스였지만, 매니저가 된 이후 예전의 방식이 통하지 않습니다. 실무까지 쳐내며 위아래로 치이다 보니 매일이 번아웃 직전입니다."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Why Me-mentum?</h2>
            <h3 className="text-4xl font-bold text-dark">정체된 성장에 <span className="text-primary">Kick</span>을 날리세요</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl border border-gray-100 bg-white hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-primary mb-6">
                <Activity className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">Hard Skill의 한계</h4>
              <p className="text-secondary leading-relaxed">
                직무 스킬만으로는 리더십과 협업의 복잡한 문제를 해결할 수 없습니다. 상위 레벨로 갈수록 Soft Skill이 성과의 80%를 결정합니다.
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-gray-100 bg-white hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-primary mb-6">
                <Brain className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">자신만의 OS 부재</h4>
              <p className="text-secondary leading-relaxed">
                남들이 좋다는 방식을 무작정 따라하지 마세요. 내 기질과 강점에 맞는 나만의 '일하는 운영체제(OS)'를 구축해야 지치지 않습니다.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-dark text-white shadow-xl relative overflow-hidden">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-white mb-6">
                <BarChart2 className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white">Data Driven Solution</h4>
              <p className="text-gray-300 leading-relaxed">
                Me-mentum은 막연한 위로가 아닌, 객관적인 진단 데이터와 회고를 통해 당신의 현재 좌표를 찍고 최적의 경로를 제시합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diagnosis Section */}
      <section className="py-24 bg-light-gray border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-dark mb-6 leading-tight">
                나에게 맞는 진단을 선택하여<br />
                <span className="text-primary">전문가와 함께하는 Deep Dive</span>
              </h2>
              <p className="text-secondary text-lg mb-10 leading-relaxed">
                기본 제공되는 LCP 무료 진단부터, 심층 강점 진단까지.<br />
                내 상황에 맞는 데이터로 코칭을 시작합니다. 결과지를 읽어주는 것을 넘어, 실제 업무 상황에 어떻게 적용할지 구체적인 액션 아이템을 도출합니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {DIAGNOSIS_TOOLS.map((tool, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="mt-1 p-2 bg-blue-50 rounded-lg text-primary">
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-dark text-lg">{tool.name}</h5>
                      <p className="text-sm text-gray-500 mt-1">{tool.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                {/* Abstract Report UI */}
                <div className="bg-gray-50 rounded-xl p-6 mb-4 border border-gray-100">
                  <div className="flex justify-between mb-6">
                    <div className="h-5 w-32 bg-gray-200 rounded"></div>
                    <div className="h-5 w-12 bg-primary/10 text-primary text-xs font-bold flex items-center justify-center rounded">HIGH</div>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-gray-400">
                        <span>Strategy</span>
                        <span>85%</span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-primary rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-gray-400">
                        <span>Execution</span>
                        <span>62%</span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-[62%] bg-blue-300 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-gray-400">
                        <span>Influence</span>
                        <span>94%</span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-[94%] bg-primary rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Quote */}
                <div className="absolute -bottom-8 -right-8 bg-dark text-white p-6 rounded-xl shadow-xl max-w-xs border border-gray-700">
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary"></div>)}
                  </div>
                  <p className="font-medium text-sm leading-relaxed">"내 강점이 전략 테마라는 걸 알고, 기획서 쓰는 방식부터 바꿨습니다."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-dark mb-4">Coaching Process</h2>
            <p className="text-secondary text-lg">인지부터 체화까지, 체계적인 4단계 로드맵</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { step: "01", title: "Audit", desc: "진단을 통한 현재 상태 객관화" },
                { step: "02", title: "Goal Setting", desc: "OKRs 기반 성장 목표 수립" },
                { step: "03", title: "Action Sprint", desc: "실제 업무 적용 및 주간 회고" },
                { step: "04", title: "Retrospective", desc: "변화 측정 및 Next Step 설계" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center group hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-14 h-14 bg-white border-2 border-primary text-primary rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews & CTA */}
      <section className="py-24 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-dark mb-12 text-center">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {REVIEWS.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="mb-6">
                  {review.tags.map((tag) => (
                    <span key={tag} className="inline-block bg-blue-50 text-primary text-xs font-bold px-2.5 py-1 rounded-md mr-2 mb-2">
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-dark font-medium mb-6 flex-grow leading-relaxed">"{review.content}"</p>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-dark text-sm">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.role} @ {review.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary rounded-3xl p-8 md:p-20 text-center text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">지금, 변화를 시작하세요</h2>
              <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                혼자 고민하는 시간은 이제 끝내세요. <br className="hidden md:block" />
                데이터와 전문가가 함께하는 Me-mentum이 당신의 성장을 가속화합니다.
              </p>
              <Link href="/apply">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-primary hover:bg-blue-50 border-none px-10 py-4 text-lg font-bold shadow-lg"
                >
                  지금 바로 신청하기
                </Button>
              </Link>
            </div>
            {/* Decorative Elements - Minimalist */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
