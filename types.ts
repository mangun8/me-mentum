export enum TrackType {
  JUNIOR = 'Junior',
  SENIOR = 'Senior',
  EXECUTIVE = 'Executive',
  FOUNDER = 'Founder'
}

export interface CurriculumItem {
  week: number;
  title: string;
  description: string;
}

export interface CoachProfile {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface ProgramInfo {
  id: string;
  title: string;
  target: string;
  description: string;
  longDescription: string;
  duration: string;
  price: string;
  priceValue: number; // 패키지 가격 (정규 4회 / 친구 트랙 1회)
  pricePerSession: number; // 회당 단가 (Founder는 0)
  features: string[];
  curriculum: CurriculumItem[];
  recommendedFor: string[];
  audience?: 'public' | 'friend'; // 기본 'public', 'friend'는 코치 지인 한정 노출
  sessionsPerPackage?: number; // 기본 4, 친구 트랙은 1
  diagnosisAllowed?: boolean; // 기본 true, 친구 트랙은 false
}

export interface DiagnosisOption {
  id: string;
  name: string;
  addPrice: number;
  description: string;
}

export interface Review {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  tags: string[];
}

export enum ApplyStep {
  TRACK_SELECTION = 1,
  PAYMENT = 2,
  COMPLETE = 3
}
