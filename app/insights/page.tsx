import React from 'react';
import Link from 'next/link';
import { INSIGHTS_ARTICLES } from '../../constants';
import { ArrowRight } from 'lucide-react';

export default function Insights() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-light-gray py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-dark mb-4">Insights</h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            일잘러를 위한 성장의 단서들을 모았습니다.<br />
            리더십, 조직문화, 그리고 커리어 성장에 대한 깊이 있는 아티클을 만나보세요.
          </p>
        </div>
      </div>

      {/* Article Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INSIGHTS_ARTICLES.map((article) => (
            <Link
              key={article.id}
              href={`/insights/${article.id}`}
              className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gray-100 overflow-hidden relative">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wide">
                  {article.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-xs text-gray-400 mb-3">{article.date}</div>
                <h3 className="text-xl font-bold text-dark mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-secondary text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                  {article.summary}
                </p>

                <div className="flex items-center text-primary font-medium text-sm mt-auto group-hover:translate-x-1 transition-transform">
                  Read Article <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
