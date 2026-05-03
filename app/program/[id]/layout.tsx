import type { Metadata } from 'next';
import { PROGRAMS } from '../../../constants';

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
  return {
    title,
    description: program.description,
    openGraph: {
      title: `${program.title} | Me-mentum`,
      description: program.description,
    },
  };
}

export default function ProgramLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
