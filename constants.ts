import { ProgramInfo, Review, TrackType } from './types';
import { Target, TrendingUp, Users, Zap } from 'lucide-react';

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Program', path: '/program', isDropdown: true },
  { label: 'About', path: '/about' },
  { label: 'Reviews', path: '/reviews' },
  { label: 'Insights', path: '/insights' },
];

export const PROGRAMS: Record<string, ProgramInfo> = {
  [TrackType.JUNIOR]: {
    id: 'junior',
    title: 'Junior Track',
    target: '1-3년차 실무자',
    description: '막연한 열심히 함을 넘어, 성과를 증명하는 핵심 인재로 성장합니다.',
    longDescription: 'Junior Track은 이제 막 커리어를 시작한 주니어들이 겪는 성장통을 해결합니다. 자신의 강점을 발견하고, 이를 업무 성과로 연결하는 구체적인 방법론을 4주간 집중적으로 훈련합니다.',
    duration: '4주 (주 1회 세션)',
    price: '₩400,000',
    priceValue: 400000,
    features: ['강점 진단 (CliftonStrengths)', '업무 회고 프레임워크', '커뮤니케이션 스킬', '커리어 로드맵 설계'],
    recommendedFor: [
      '열심히 일하지만 성과가 나지 않아 고민인 분',
      '상사와의 커뮤니케이션이 어려운 분',
      '나만의 업무 스타일(OS)을 찾고 싶은 분'
    ],
    curriculum: [
      { week: 1, title: 'Opener & Diagnosis', description: '업무 성향 및 강점 진단을 통해 나를 움직이는 동기부여 요인을 파악하고, 코칭 목표를 수립합니다.' },
      { week: 2, title: 'Goal Setting', description: '단순 반복 업무에서 벗어나, 문제 해결 중심의 사고방식과 회고(TIL/KPT) 습관을 형성합니다.' },
      { week: 3, title: 'Sprint & Action', description: '상사의 언어로 보고하는 법, 동료와 협업하는 법 등 조직 내 영향력을 높이는 대화법을 배웁니다.' },
      { week: 4, title: 'Retrospective', description: '향후 3년의 커리어 목표를 설정하고, 현재 업무와 연결되는 구체적인 액션 플랜을 수립합니다.' }
    ]
  },
  [TrackType.SENIOR]: {
    id: 'senior',
    title: 'Senior/Lead Track',
    target: '팀장 및 파트리더',
    description: '실무자에서 관리자로, 팀의 성과를 이끄는 리더십 OS를 장착합니다.',
    longDescription: '실무 능력만으로는 좋은 리더가 될 수 없습니다. Senior Track은 관리자로서 겪는 딜레마를 해결하고, 팀의 심리적 안전감을 구축하며 성과를 내는 리더십 스킬을 전수합니다.',
    duration: '8주 (주 1회 세션)',
    price: '₩1,200,000',
    priceValue: 1200000,
    features: ['리더십 스타일 진단', '피드백 & 1on1 스킬', '팀 빌딩 및 동기부여', '위임의 기술'],
    recommendedFor: [
      '팀장 승진 후 역할 혼란을 겪는 분',
      '팀원 관리와 피드백이 두려운 분',
      '마이크로 매니징을 멈추고 위임하고 싶은 분'
    ],
    curriculum: [
      { week: 1, title: 'Opener & Diagnosis', description: 'Player에서 Coach로의 정체성 전환. 리더십 진단을 통해 나의 리더십 유형을 파악합니다.' },
      { week: 2, title: 'Goal Setting', description: '팀 내 심리적 안전감(Psychological Safety)을 구축하는 방법과 신뢰 자본 쌓기.' },
      { week: 3, title: 'Sprint: Feedback', description: '솔직하지만 상처주지 않는 피드백 기술(SBI)과 효과적인 1on1 미팅 구조화.' },
      { week: 4, title: 'Sprint: Delegation', description: '업무 위임의 5단계를 이해하고, 권한과 책임을 적절히 분배하는 시스템 만들기.' },
      { week: 5, title: 'Sprint: Conflict', description: '팀 내 갈등을 건강한 토론으로 전환하는 갈등 조정 및 중재 스킬.' },
      { week: 6, title: 'Sprint: Motivation', description: '구성원별 욕구(Needs) 파악에 따른 맞춤형 동기부여 전략 수립.' },
      { week: 7, title: 'Sprint: Performance', description: '공정한 평가와 보상, OKR/KPI 수립 및 관리 노하우.' },
      { week: 8, title: 'Retrospective', description: '리더의 번아웃 예방과 지속 가능한 리더십을 위한 멘탈 관리 및 로드맵.' }
    ]
  },
  [TrackType.EXECUTIVE]: {
    id: 'executive',
    title: 'Executive Track',
    target: 'C-Level 및 임원',
    description: '조직의 비전과 정렬된 의사결정 체계와 경영 철학을 정립합니다.',
    longDescription: 'Executive Track은 고독한 의사결정의 순간에 명확한 기준이 되어줄 경영 철학과 조직 문화를 다룹니다. 격주 세션을 통해 현업의 문제를 깊이 있게 다룹니다.',
    duration: '12주 (격주 세션)',
    price: '₩3,000,000',
    priceValue: 3000000,
    features: ['조직문화 진단', '전략적 의사결정', '채용 및 평가 시스템', '경영자 코칭'],
    recommendedFor: [
      '조직의 비전과 미션을 재정립하고 싶은 경영진',
      '건강한 조직문화를 만들고 싶은 C-Level',
      '전략적 의사결정 파트너가 필요한 임원'
    ],
    curriculum: [
      { week: 1, title: 'Opener & Diagnosis', description: '조직의 핵심 가치와 비전을 재정의하고 전사적으로 전파하는 전략.' },
      { week: 2, title: 'Goal Setting', description: '우리 조직에 맞는 문화 진단 및 바람직한 조직문화 설계.' },
      { week: 3, title: 'Sprint: Decision', description: '데이터와 직관의 균형, 복잡한 상황에서의 전략적 의사결정 프레임워크.' },
      { week: 4, title: 'Sprint: Talent', description: '조직의 Fit에 맞는 인재상 정의 및 Bar-Raiser 채용 시스템 구축.' },
      { week: 5, title: 'Sprint: Structure', description: '성장 단계에 맞는 조직 구조 개편 및 R&R 재정립.' },
      { week: 6, title: 'Retrospective', description: '지속 가능한 경영을 위한 리더십 파이프라인 구축 및 승계 계획.' }
    ]
  },
  [TrackType.FOUNDER]: {
    id: 'founder',
    title: 'Founder Track',
    target: '초기 창업가',
    description: '창업가의 멘탈 관리부터 조직의 0 to 1을 만드는 핵심 원칙을 코칭합니다.',
    longDescription: 'Founder Track은 스타트업의 생존과 성장을 위한 전방위적 코칭입니다. 투자 유치, 공동창업자 관계, 초기 멤버 빌딩 등 창업가가 마주하는 난제들을 함께 풉니다.',
    duration: '상시 (구독형)',
    price: '문의',
    priceValue: 0,
    features: ['창업가 성향 분석 (LCP)', 'IR 및 투자자 커뮤니케이션', '공동창업자 갈등 관리', '비전 수립'],
    recommendedFor: [
      'Seed ~ Series A 단계의 창업가',
      '공동창업자 간의 알력 다툼으로 고민인 대표',
      '투자 유치를 앞두고 멘탈 관리가 필요한 분'
    ],
    curriculum: [
      { week: 1, title: 'Opener & Diagnosis', description: '창업가의 메타인지 향상 및 회복탄력성(Resilience) 강화.' },
      { week: 2, title: 'Goal Setting', description: '공동창업자 간의 R&R 명확화 및 신뢰 관계 회복 코칭.' },
      { week: 3, title: 'Sprint: Team Building', description: '초기 멤버 채용 원칙 수립 및 핵심 가치 내재화.' },
      { week: 4, title: 'Retrospective', description: '투자자를 설득하는 스토리텔링 및 IR 덱 코칭.' }
    ]
  }
};

export const COACHING_PROCESS_STEPS = [
  {
    step: "01",
    title: "오프너 & 데이터 진단",
    subtitle: "Opener & Diagnosis",
    description: "고객의 성향을 파악하고 목표를 탐색합니다. 기본 제공되는 LCP 무료 진단부터, 니즈에 따른 심층 강점 진단까지 선택할 수 있습니다.",
    details: ["직무/고민/환경 심층 파악", "업무 방식 진단", "성향 분석"]
  },
  {
    step: "02",
    title: "구체적인 목표 설정",
    subtitle: "Goal Setting",
    description: "측정 가능한 코칭 목표를 수립합니다. 막연한 고민을 구체적인 해결 과제로 정의합니다.",
    details: ["보고/회의 커뮤니케이션", "팀 매니징 시너지", "직무 성과 달성"]
  },
  {
    step: "03",
    title: "스프린트",
    subtitle: "Sprint",
    description: "설정한 목표를 실제 업무에 적용하고, 주간 회고를 통해 액션 플랜을 고도화합니다.",
    details: ["실전 업무 적용", "주간 회고", "액션 플랜 최적화"]
  },
  {
    step: "04",
    title: "결과 회고 및 넥스트 스텝",
    subtitle: "Retrospective",
    description: "코칭 성과를 데이터로 돌아보고, 향후 스스로 성장할 수 있는 로드맵을 설계합니다.",
    details: ["성과 데이터 분석", "성장 로드맵 설계", "Self-Coaching 가이드"]
  }
];

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: "김민지",
    role: "Product Designer",
    company: "Series A 스타트업",
    content: "열심히는 하는데 성과가 안 난다는 피드백에 지쳐있었습니다. Me-mentum 진단을 통해 제 강점이 '전략' 테마에 있다는 걸 알게 되었고, 업무 방식을 180도 바꾼 후 팀장님께 인정받기 시작했어요.",
    tags: ["Junior", "강점진단", "커리어전환"]
  },
  {
    id: 2,
    name: "이준호",
    role: "CTO",
    company: "Series B 핀테크",
    content: "개발만 알던 제가 20명 조직을 이끌게 되니 매일이 지옥 같았습니다. 코칭을 통해 '관리'가 아닌 '위임'을 배웠고, 이제는 제가 없어도 팀이 돌아가는 시스템을 만들었습니다.",
    tags: ["Executive", "리더십", "조직관리"]
  },
  {
    id: 3,
    name: "박서연",
    role: "Marketing Team Lead",
    company: "Pre-IPO 커머스",
    content: "팀원들과의 1on1이 가장 두려웠는데, 이제는 가장 기다려지는 시간이 되었습니다. 데이터 기반으로 피드백하는 방법을 배우니 감정 소모가 확 줄었습니다.",
    tags: ["Senior", "피드백", "1on1"]
  }
];

export const DIAGNOSIS_TOOLS = [
  {
    name: "Gallup CliftonStrengths",
    desc: "재능을 성과로 연결하는 강점 진단",
    icon: Zap
  },
  {
    name: "LCP (Leadership Circle Profile)",
    desc: "창조적 리더십과 반응적 경향성 분석",
    icon: Target
  },
  {
    name: "Birkman Method",
    desc: "대인관계 스타일과 숨겨진 욕구 파악",
    icon: Users
  },
  {
    name: "Organizational Health Check",
    desc: "조직의 몰입도와 건강성 측정",
    icon: TrendingUp
  }
];

export const PAIN_POINTS = [
  {
    level: "주니어",
    title: "의욕과 현실의 괴리",
    description: "잘하고 싶은 마음은 굴뚝같은데, 마음처럼 성과가 나지 않아 위축됩니다. 쏟아지는 피드백 속에서 나만의 강점이 무엇인지, 어떻게 '일머리'를 키워야 할지 막막하기만 합니다."
  },
  {
    level: "미들급",
    title: "성장 정체의 늪",
    description: "연차는 쌓이는데 실력은 제자리걸음입니다. 매일 야근하며 뼈를 갈아 넣고 있지만, 이직 시장에 내놓을 나만의 확실한 '무기'가 없어 도태되는 듯한 불안감이 듭니다."
  },
  {
    level: "리더급",
    title: "과거 성공 방식의 한계",
    description: "실무자일 땐 에이스였지만, 매니저가 된 이후 예전의 방식이 통하지 않습니다. 실무까지 쳐내며 위아래로 치이다 보니 매일이 번아웃 직전입니다."
  }
];

export const COACH_CERTIFICATIONS = [
  {
    id: 'gallup',
    name: "Gallup CliftonStrengths",
    title: "Gallup 강점 코칭",
    summary: "재능을 성과로 연결하는 과학적 도구",
    description: "Gallup CliftonStrengths는 40년 이상의 연구를 통해 개발된 진단 도구입니다. 개인의 고유한 재능 테마 34가지를 분석하여, 약점을 보완하기보다 강점에 집중함으로써 탁월한 성과를 내도록 돕습니다. Me-mentum은 공식 인증 코치가 직접 디브리핑을 진행합니다."
  },
  {
    id: 'lcp',
    name: "LCP (Leadership Circle Profile)",
    title: "LCP 리더십 프로파일",
    summary: "리더십의 내면과 외면을 통합 진단",
    description: "LCP는 리더의 행동 패턴(외면)과 그 행동을 유발하는 사고방식(내면)을 동시에 분석하는 유일한 360도 진단 도구입니다. '창조적 리더십'과 '반응적 경향성'의 비율을 분석하여, 리더십의 효율성을 저해하는 근본적인 원인을 파악하고 성숙한 리더로의 전환을 가이드합니다."
  },
  {
    id: 'coactive',
    name: "Co-Active Coaching",
    title: "Co-Active 코칭 모델",
    summary: "전인적 성장을 위한 코칭의 정석",
    description: "CTI(The Coaches Training Institute)의 Co-Active 모델은 코치와 피코치가 대등한 파트너로서 협력하는 관계를 지향합니다. 단순히 문제를 해결하는 것을 넘어, 피코치가 스스로의 잠재력을 발견하고 삶의 모든 영역에서 주도적인 선택을 할 수 있도록 돕는 강력한 프로세스입니다."
  }
];

export const INSIGHTS_ARTICLES = [
  {
    id: 1,
    category: "Leadership",
    title: "팀장이 되고 나서야 알게 된 것들: 실무와 매니징의 차이",
    summary: "실무 잘하는 사람이 꼭 좋은 팀장이 되는 것은 아닙니다. 플레이어에서 코치로 정체성을 전환하는 과정에서 겪는 시행착오와 해결책을 공유합니다.",
    date: "2024.03.15",
    thumbnail: "https://picsum.photos/seed/leadership/800/600"
  },
  {
    id: 2,
    category: "Self-Growth",
    title: "나만의 '일하는 운영체제(OS)' 만드는 법",
    summary: "남들의 방식을 무작정 따라하기보다, 내 기질과 강점에 맞는 업무 스타일을 구축해야 합니다. 지속 가능한 성장을 위한 나만의 OS 설계 가이드.",
    date: "2024.03.10",
    thumbnail: "https://picsum.photos/seed/growth/800/600"
  },
  {
    id: 3,
    category: "Communication",
    title: "상사를 내 편으로 만드는 보고의 기술",
    summary: "보고는 단순히 정보를 전달하는 것이 아닙니다. 상사의 의도를 파악하고, 원하는 결과를 얻어내는 설득의 과정입니다. 프로 일잘러의 보고 스킬.",
    date: "2024.03.05",
    thumbnail: "https://picsum.photos/seed/comm/800/600"
  },
  {
    id: 4,
    category: "Culture",
    title: "심리적 안전감: 고성과 조직의 비밀",
    summary: "구글이 밝혀낸 고성과 팀의 유일한 공통점, '심리적 안전감'. 실패를 두려워하지 않고 솔직하게 의견을 낼 수 있는 문화를 만드는 방법.",
    date: "2024.02.28",
    thumbnail: "https://picsum.photos/seed/culture/800/600"
  }
];
