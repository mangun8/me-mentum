import type { Metadata } from 'next';
import { INSIGHTS_ARTICLES } from '../../../constants';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const article = INSIGHTS_ARTICLES.find((a) => String(a.id) === params.id);
  if (!article) {
    return { title: '인사이트' };
  }
  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: `${article.title} | Me-mentum`,
      description: article.summary,
    },
  };
}

export default function InsightLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
