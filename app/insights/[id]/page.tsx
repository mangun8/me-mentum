'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { INSIGHTS_ARTICLES } from '../../../constants';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import Button from '../../../components/Button';

export default function ArticleDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const article = INSIGHTS_ARTICLES.find(a => a.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-dark mb-4">Article not found</h2>
        <Link href="/insights">
          <Button>Back to Insights</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header Image */}
      <div className="w-full h-[400px] bg-gray-100 relative">
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-5xl mx-auto">
          <Link href="/insights" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Insights
          </Link>
          <div className="flex items-center gap-4 mb-4 text-sm font-medium">
            <span className="bg-primary px-3 py-1 rounded-full">{article.category}</span>
            <span className="flex items-center gap-1 text-white/80">
              <Calendar className="w-4 h-4" /> {article.date}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">{article.title}</h1>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg prose-slate max-w-none">
          <p className="lead text-xl text-secondary font-medium mb-10 border-l-4 border-primary pl-6 italic">
            {article.summary}
          </p>

          {/* Mock Content */}
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <h2 className="text-2xl font-bold text-dark mt-10 mb-6">1. 문제의 본질을 파악하세요</h2>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>

          <h2 className="text-2xl font-bold text-dark mt-10 mb-6">2. 데이터로 증명하세요</h2>
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
          </p>

          <div className="bg-blue-50 p-8 rounded-xl my-10 border border-blue-100">
            <h3 className="text-lg font-bold text-primary mb-2">Key Takeaway</h3>
            <p className="text-secondary m-0">
              변화는 작은 행동에서 시작됩니다. 오늘 당장 실천할 수 있는 한 가지 액션 아이템을 정해보세요.
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex gap-2">
          <Tag className="w-5 h-5 text-gray-400" />
          <span className="text-gray-500 text-sm">#{article.category}</span>
          <span className="text-gray-500 text-sm">#Growth</span>
          <span className="text-gray-500 text-sm">#Coaching</span>
        </div>
      </div>
    </div>
  );
}
