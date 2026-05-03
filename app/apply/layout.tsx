import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '신청',
  robots: { index: false, follow: false },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
