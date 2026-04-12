import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, TrendingUp, Lightbulb, Target, BarChart3, Compass, MessageCircle } from 'lucide-react';
import Button from '../components/Button';
import { REVIEWS } from '../constants';

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
              Me-mentum이 당신을 성과를 내는 &lsquo;진짜 일잘러&rsquo;로 성장시켜 드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/program">
                <Button size="lg" className="gap-2 font-bold">
                  코칭 프로세스 알아보기
                </Button>
              </Link>
              <Link href="/apply">
                <Button size="lg" variant="outline" className="gap-2 font-bold border-gray-200 text-dark hover:border-primary hover:text-primary">
                  코칭 신청하기
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Graphic */}
        <div className="hidden lg:block absolute top-12 right-10 xl:right-20 w-[480px] h-[560px] z-0">
          <div className="relative w-full h-full">
            {/* Main Chart Card */}
            <div className="absolute bottom-0 left-0 w-full h-[450px] bg-white rounded-2xl shadow-xl border border-gray-100 p-8 overflow-visible">
              <div className="flex justify-between items-end h-full pb-14 px-4 gap-4">
                {/* Pre-coaching — 옅고 낮음 */}
                <div className="w-1/6 h-[20%] bg-gray-100 rounded-t-lg origin-bottom hero-grow hero-grow-1"></div>
                <div className="w-1/6 h-[25%] bg-gray-100 rounded-t-lg origin-bottom hero-grow hero-grow-2"></div>
                {/* Coaching W1~W4 — 점점 진하고 높아짐 */}
                <div className="w-1/6 h-[40%] bg-blue-100 rounded-t-lg origin-bottom hero-grow hero-grow-3"></div>
                <div className="w-1/6 h-[55%] bg-blue-200 rounded-t-lg origin-bottom hero-grow hero-grow-4"></div>
                <div className="w-1/6 h-[72%] bg-blue-300 rounded-t-lg origin-bottom hero-grow hero-grow-5"></div>
                <div className="w-1/6 h-[92%] bg-primary rounded-t-lg origin-bottom hero-grow hero-grow-6 relative">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-dark text-white text-xs font-bold px-2 py-1 rounded">Now</div>
                </div>
              </div>

              {/* Self-Awareness Data — 카드 + 점선을 하나로 묶어 수직 정렬 */}
              <div className="absolute left-[36%] -translate-x-1/2 top-12 bottom-[88px] z-30 flex flex-col items-center hero-insight-line">
                {/* 카드 */}
                <div className="px-4 py-2 bg-white rounded-lg shadow-lg border border-primary/20 whitespace-nowrap hero-insight-card">
                  <span className="text-xs font-bold text-primary tracking-wide">Self-Awareness Data</span>
                </div>
                {/* 점선: 카드 바로 아래 ~ 막대 바닥까지 */}
                <div className="flex-1 border-l-2 border-dashed border-primary/30"></div>
              </div>

              {/* 하단 축 */}
              <div className="absolute bottom-4 left-8 right-8 flex items-start gap-0">
                <div className="w-[33%] pt-1.5 border-t border-gray-100 text-center">
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">Before</span>
                </div>
                <div className="w-[67%] pt-1.5 border-t border-primary/20 text-center">
                  <span className="text-[10px] font-bold text-primary/50 uppercase tracking-wider">Coaching Weeks</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl opacity-50 -translate-y-1/4 translate-x-1/4 -z-10"></div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 hover:border-primary/30 transition-colors">
              <div className="text-primary font-bold text-sm tracking-widest uppercase mb-4">Junior Level</div>
              <h3 className="text-2xl font-bold text-dark mb-6">의욕과 현실의 괴리</h3>
              <p className="text-secondary leading-relaxed text-lg">
                잘하고 싶은 마음은 굴뚝같은데, 마음처럼 성과가 나지 않아 위축됩니다.
                쏟아지는 피드백 속에서 나만의 강점이 무엇인지, 어떻게 &lsquo;일머리&rsquo;를 키워야 할지 막막하기만 합니다.
              </p>
            </div>

            <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 hover:border-primary/30 transition-colors">
              <div className="text-primary font-bold text-sm tracking-widest uppercase mb-4">Middle Level</div>
              <h3 className="text-2xl font-bold text-dark mb-6">성장 정체의 불안</h3>
              <p className="text-secondary leading-relaxed text-lg">
                연차는 쌓이는데 실력은 제자리걸음인 것 같습니다. 매일 야근하며 뼈를 갈아 넣고 있지만, 조직 안에서도 이직 시장에서도 내세울 나만의 확실한 &lsquo;무기&rsquo;가 없어 불안감이 커져만 갑니다.
              </p>
            </div>

            <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 hover:border-primary/30 transition-colors">
              <div className="text-primary font-bold text-sm tracking-widest uppercase mb-4">Leader Level</div>
              <h3 className="text-2xl font-bold text-dark mb-6">과거 성공 방식의 한계</h3>
              <p className="text-secondary leading-relaxed text-lg">
                실무자일 땐 에이스였지만, 매니저가 된 이후 예전의 방식이 통하지 않습니다.
                실무까지 쳐내며 위아래로 치이다 보니 매일이 번아웃 직전입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Me-mentum — Before → After */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Why Me-mentum?</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-dark">코칭 전후, 이렇게 달라집니다</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-5">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-dark mb-2">나만의 강점 인식</h4>
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-2">
                  <span className="text-gray-300 text-sm font-bold mt-0.5">Before</span>
                  <p className="text-secondary text-sm">남들이 좋다는 방식을 따라하며 소모되는 매일</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary text-sm font-bold mt-0.5">After</span>
                  <p className="text-dark text-sm font-medium">내 기질에 맞는 업무 방식으로 지치지 않고 성과를 냄</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-dark mb-2">목표 설정</h4>
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-2">
                  <span className="text-gray-300 text-sm font-bold mt-0.5">Before</span>
                  <p className="text-secondary text-sm">&ldquo;잘하고 싶다&rdquo;는 막연한 의지만 있는 상태</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary text-sm font-bold mt-0.5">After</span>
                  <p className="text-dark text-sm font-medium">측정 가능한 성장 목표와 구체적 액션 플랜 보유</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-dark mb-2">Soft Skill 성장</h4>
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-2">
                  <span className="text-gray-300 text-sm font-bold mt-0.5">Before</span>
                  <p className="text-secondary text-sm">하드 스킬만으로 성과를 내려다 벽에 부딪히는 상태</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary text-sm font-bold mt-0.5">After</span>
                  <p className="text-dark text-sm font-medium">커뮤니케이션·리더십 등 소프트 스킬로 일이 저절로 굴러가게 만듦</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diagnosis Section */}
      <section className="py-24 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 leading-tight">
                검증된 진단 도구로<br />
                <span className="text-primary">나의 현재 좌표</span>를 찍습니다
              </h2>
              <p className="text-secondary text-lg mb-10 leading-relaxed">
                기본 제공되는 LCP 무료 진단부터 심층 강점 진단까지,
                내 상황에 맞는 데이터로 코칭을 시작합니다.
                결과지를 읽어주는 것을 넘어, 실제 업무에 어떻게 적용할지
                구체적인 액션 아이템을 함께 도출합니다.
              </p>

              <div className="space-y-5">
                {[
                  { name: "Gallup CliftonStrengths", desc: "재능을 성과로 연결하는 강점 진단", icon: BarChart3 },
                  { name: "LCP (Leadership Circle Profile)", desc: "창조적 리더십과 반응적 경향성 분석", icon: Compass },
                  { name: "Co-Active Coaching", desc: "자기 인식과 주도적 변화를 이끄는 코칭 방법론", icon: MessageCircle },
                ].map((tool, idx) => {
                  const Icon = tool.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-bold text-dark">{tool.name}</span>
                        <span className="text-secondary"> — {tool.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="bg-white rounded-xl p-6 border border-gray-100 mb-4">
                  <div className="flex justify-between mb-6">
                    <span className="text-sm font-bold text-dark">강점 분석 리포트</span>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">TOP 5</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: "전략적 사고", value: 94 },
                      { name: "실행력", value: 85 },
                      { name: "영향력", value: 78 },
                      { name: "관계 구축", value: 62 },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-gray-600">{item.name}</span>
                          <span className="text-primary font-bold">{item.value}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${item.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <p className="text-sm text-dark font-medium leading-relaxed">
                    &ldquo;전략적 사고가 강점인 당신은, 타인과의 소통 전에 스스로 찾은 패턴과 대안을 보고에 녹여내는 방식으로 업무 흐름을 바꿔보세요.&rdquo;
                  </p>
                  <p className="text-xs text-gray-400 mt-2">코칭 분석 리포트</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">코칭 프로세스</h2>
            <p className="text-secondary text-lg">인지부터 체화까지, 체계적인 4단계 로드맵</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { step: "01", title: "진단", subtitle: "Audit", desc: "검증된 진단 도구로 현재 상태를 객관적으로 파악합니다" },
                { step: "02", title: "목표 설정", subtitle: "Goal Setting", desc: "측정 가능한 성장 목표와 구체적 액션 플랜을 수립합니다" },
                { step: "03", title: "실전 적용", subtitle: "Action Sprint", desc: "실제 업무에 적용하고, 주간 회고로 고도화합니다" },
                { step: "04", title: "회고", subtitle: "Retrospective", desc: "변화를 데이터로 확인하고, 자기주도 성장 로드맵을 설계합니다" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center group hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-14 h-14 bg-primary/10 border-2 border-primary text-primary rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-bold text-dark mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-400 mb-3">{item.subtitle}</p>
                  <p className="text-sm text-secondary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">코칭을 경험한 분들의 이야기</h2>
            <p className="text-secondary text-lg">실제 코칭을 통해 변화를 만들어낸 사례입니다</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {REVIEWS.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-gray-50 p-8 rounded-2xl hover:bg-blue-50/30 transition-colors flex flex-col">
                <div className="mb-5">
                  {review.tags.map((tag) => (
                    <span key={tag} className="inline-block bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full mr-2 mb-2">
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-dark leading-relaxed mb-6 flex-grow">&ldquo;{review.content}&rdquo;</p>
                <div className="flex items-center gap-3 border-t border-gray-200 pt-5">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-dark text-sm">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.role} · {review.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/reviews" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
              더 많은 후기 보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-10 md:p-20 text-center text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">지금, 변화를 시작하세요</h2>
              <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                혼자 고민하는 시간은 이제 끝내세요.
                데이터와 전문 코치가 함께하는 Me-mentum이 당신의 다음 단계를 열어드립니다.
              </p>
              <Link href="/apply">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-primary hover:bg-blue-50 border-none px-10 py-4 text-lg font-bold shadow-lg"
                >
                  코칭 신청하기
                </Button>
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
