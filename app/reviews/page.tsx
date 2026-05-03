import React from 'react';
import type { Metadata } from 'next';
import { REVIEWS } from '../../constants';

export const metadata: Metadata = {
  title: '코칭 리뷰',
  description: '미멘텀 코칭을 받은 주니어·리더·임원들의 변화 이야기.',
};

export default function Reviews() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-dark mb-4">Me-mentum Stories</h1>
          <p className="text-xl text-secondary">
            먼저 성장한 동료들의 이야기를 들어보세요.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-dark text-lg">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.role} @ {review.company}</p>
                </div>
              </div>

              <div className="mb-4">
                {review.tags.map((tag) => (
                  <span key={tag} className="inline-block bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-md border border-gray-200 mr-2 mb-2">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="relative">
                <span className="absolute -top-2 -left-2 text-4xl text-gray-200 font-serif">&quot;</span>
                <p className="text-gray-700 leading-relaxed relative z-10 pl-4">{review.content}</p>
              </div>
            </div>
          ))}
          {/* Mock More Reviews */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex items-center justify-center text-center">
            <div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">More Stories Coming Soon</h3>
              <p className="text-gray-400 text-sm">더 많은 성공 사례가 업데이트 될 예정입니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
