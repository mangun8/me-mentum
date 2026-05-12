import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PROGRAMS } from '../../../constants';
import { getCurrentProfile } from '@/lib/auth';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const program = Object.values(PROGRAMS).find((p) => p.id === params.id);
  if (!program) {
    return { title: 'Program' };
  }
  const title = `${program.title} — ${program.target} 코칭`;
  const baseMeta: Metadata = {
    title,
    description: program.description,
    openGraph: {
      title: `${program.title} | Me-mentum`,
      description: program.description,
    },
  };
  if (program.audience === 'friend') {
    baseMeta.robots = { index: false, follow: false };
  }
  return baseMeta;
}

export default async function ProgramLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const program = Object.values(PROGRAMS).find((p) => p.id === params.id);
  if (program?.audience === 'friend') {
    const profile = await getCurrentProfile();
    if (!profile || (profile.role !== 'friend' && profile.role !== 'coach')) {
      redirect('/');
    }
  }
  return <>{children}</>;
}
