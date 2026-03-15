import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white font-serif italic text-sm">M</span>
              <span className="font-bold text-lg">Me-mentum</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              스타트업 성장의 핵심은<br />사람과 조직의 건강한 모멘텀입니다.<br />
              데이터 기반 코칭으로 당신의 잠재력을 깨우세요.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Program</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/program/junior" className="hover:text-white transition-colors">Junior Track</Link></li>
              <li><Link href="/program/senior" className="hover:text-white transition-colors">Senior Track</Link></li>
              <li><Link href="/program/executive" className="hover:text-white transition-colors">Executive Track</Link></li>
              <li><Link href="/program/founder" className="hover:text-white transition-colors">Founder Track</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>support@mementum.lab</li>
              <li>02-123-4567</li>
              <li>서울시 강남구 테헤란로 427, 10F</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2024 Me-mentum Coaching Lab. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
