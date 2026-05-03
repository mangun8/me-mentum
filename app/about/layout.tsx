import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '미멘텀 소개',
  description: '미멘텀의 코칭 철학과 헤드코치 정용훈을 소개합니다.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
