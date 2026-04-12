'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { INSIGHTS_ARTICLES } from '../../../constants';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import Button from '../../../components/Button';

/* ── Article Content ── */
function Article1() {
  return (
    <>
      <p>사람들을 일을 잘하고 싶어합니다.</p>
      <p>
        그런데, 일을 잘하고 싶을 때, 우리는 정말 많은 것들을 고민하게 됩니다.
      </p>
      <p>
        Soft skill로 대표되는 커뮤니케이션이라던가, hard skill로 이야기 되는 데이터 분석능력, Figma, 개발 지식 등등.
        하지만, 우리에게 시간은 한정적이고, 그 모든 것들을 배울 수는 없어요.
        (물론, 요즘에는 AI의 힘으로 예전보다는 더 많은 것을 배울 수는 있긴 하지만요)
      </p>
      <p>일을 잘한다는 것의 본질이 무엇인지 한 번 살펴보려고 합니다.</p>
      <p>총 3단계의 레벨이 있습니다.</p>
      <p className="text-secondary">
        주변에서는 일에 대해 아래처럼 생각을 시작하는 것 같습니다.
      </p>

      {/* Level 1 */}
      <h2 className="text-2xl font-bold text-dark mt-12 mb-6">Level 1의 일의 개념</h2>
      <div className="bg-blue-50 px-8 py-6 rounded-xl border border-blue-100 my-6">
        <p className="text-dark font-bold text-lg m-0">일 = 시간 &times; 시간 당 하는 일</p>
      </div>
      <p>
        일을 잘하는 것을 일하는 시간과 시간당 효율성의 측면으로 보는 생각이죠.
      </p>
      <p>그러다가 일을 하다보면, 그 다음 레벨로 넘어 갑니다.</p>

      {/* Level 2 */}
      <h2 className="text-2xl font-bold text-dark mt-12 mb-6">Level 2의 일의 개념</h2>
      <div className="bg-blue-50 px-8 py-6 rounded-xl border border-blue-100 my-6">
        <p className="text-dark font-bold text-lg m-0">일 = 시간 &times; 시간 당 하는 일 &times; 방향성</p>
      </div>
      <p>
        즉, 단순히 오래, 효율적으로 일하는 것을 넘어서서 하는 일의 방향과 목적까지 고민하게 되는 레벨입니다.
      </p>
      <p>이 때는</p>
      <ul className="list-disc pl-6 space-y-2 my-6 text-dark">
        <li>얼마나 오래?</li>
        <li>얼마나 효율적으로?</li>
        <li>어떤 방향성으로?</li>
      </ul>
      <p>
        라는 고민들을 하더라고요. 이 레벨에서는 드디어 일의 임팩트까지 고민하는 모습들을 많이 봤습니다.
      </p>
      <p>
        위 세 가지 측면은 일이라는 것을 볼 때, 가장 기본적으로 숙지하면 좋은 요소라고 보고 있어요.
      </p>

      {/* Level 3 */}
      <h2 className="text-2xl font-bold text-dark mt-12 mb-6">Level 3의 일의 개념</h2>
      <p>
        자, 이제는 그 다음 레벨에 대해서 살펴볼까요?
      </p>
      <p>
        위의 레벨이 &lsquo;일 그자체&rsquo;에 대해서 본다면, 이제는 사람에 대해서 고려해보기 시작합니다.
        우리는 누군가와 함께 일을 합니다. 다른 사람과 함께 일을 할 때, 우리는 언제 그 사람을 일을 잘 한다고 생각할까요?
      </p>
      <p>
        그 때 &lsquo;사람&rsquo;이라는 측면으로 보면, 재미있는 기준이 나옵니다. 그건 바로 &lsquo;나&rsquo;라는 기준입니다.
      </p>
      <ul className="list-disc pl-6 space-y-3 my-6 text-dark leading-relaxed">
        <li>다른 사람들이 내가 하는 것(내가 생각하는 것)보다 못 한다면? &rarr; 그 사람은 일을 못 한다고 생각합니다.</li>
        <li>다른 사람들이 내가 하는 것(내가 생각하는 것)만큼 한다면? &rarr; 그 사람은 일을 괜찮게 한다고 생각합니다.</li>
        <li>다른 사람들이 내가 할 수 없는 것(내가 생각하지 못한 것)을 한다면? &rarr; 그 사람은 일을 잘한다고 생각합니다.</li>
      </ul>
      <p>
        우리는 &lsquo;역지사지&rsquo;해야 한다고 생각하지만, 사실 그만큼 스스로를 중심에 두고 사고 하는 것이죠.
      </p>
      <div className="bg-blue-50 px-8 py-6 rounded-xl border border-blue-100 my-8">
        <p className="text-dark font-bold text-lg m-0">일 = 시간 &times; 시간 당 하는 일 &times; 방향성 &times; 함께 일하는 사람의 기준/기대치</p>
      </div>

      {/* Closing */}
      <div className="bg-light-gray p-8 rounded-xl my-10 border border-gray-100">
        <p className="text-dark font-medium leading-relaxed m-0">
          일을 잘한다는 것은 사실 정말로 다양하게 정의할 수 있겠지만,
          Level 3의 개념에 나와 있는 네 가지 개념만을 숙지한다면
          어딜가든 &lsquo;기본&rsquo;은 할 수 있는 사람이 아닐까 싶네요.
        </p>
      </div>
    </>
  );
}

const ARTICLE_CONTENT: Record<number, React.FC> = {
  1: Article1,
};

/* ── Page ── */
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

  const ContentComponent = ARTICLE_CONTENT[article.id];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="w-full bg-gradient-to-br from-blue-50 to-white py-20 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/insights" className="inline-flex items-center text-secondary hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Insights
          </Link>
          <div className="flex items-center gap-4 mb-4 text-sm font-medium">
            <span className="bg-primary text-white px-3 py-1 rounded-full">{article.category}</span>
            <span className="flex items-center gap-1 text-secondary">
              <Calendar className="w-4 h-4" /> {article.date}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-dark leading-tight">{article.title}</h1>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg prose-slate max-w-none text-dark leading-relaxed space-y-4">
          <p className="text-xl text-secondary font-medium mb-10 border-l-4 border-primary pl-6 italic">
            {article.summary}
          </p>
          {ContentComponent && <ContentComponent />}
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
