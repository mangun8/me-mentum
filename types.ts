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
  priceValue: number; // For calculation
  features: string[];
  curriculum: CurriculumItem[];
  recommendedFor: string[];
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
  SCHEDULE = 2,
  PAYMENT = 3,
  COMPLETE = 4
}
