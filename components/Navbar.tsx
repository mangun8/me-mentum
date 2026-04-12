'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, LogIn, LogOut, UserCircle } from 'lucide-react';
import { NAV_LINKS, PROGRAMS } from '../constants';
import Button from './Button';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // 초기 세션 확인
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // 로그인/로그아웃 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <Link href="/" className="text-xl font-bold tracking-tight text-dark flex items-center gap-2">
              <Image src="/logo.svg" alt="Me-mentum" width={32} height={32} className="rounded-lg" />
              Me-mentum
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative group h-16 flex items-center"
                onMouseEnter={() => link.isDropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => link.isDropdown && setActiveDropdown(null)}
              >
                {link.isDropdown ? (
                  <button className="flex items-center text-secondary hover:text-primary font-medium transition-colors">
                    {link.label}
                    <ChevronDown className="ml-1 w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href={link.path}
                    className={`font-medium transition-colors ${
                      pathname === link.path ? 'text-primary' : 'text-secondary hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {link.isDropdown && activeDropdown === link.label && (
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      href="/program#process"
                      className="block px-4 py-2 text-sm font-bold text-primary bg-blue-50/50 hover:bg-blue-50"
                      onClick={() => setActiveDropdown(null)}
                    >
                      코칭 프로세스 안내
                    </Link>
                    <div className="h-px bg-gray-100 my-1"></div>
                    {Object.values(PROGRAMS).map((program) => (
                      <Link
                        key={program.id}
                        href={`/program/${program.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {program.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Right Area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              // 로그인 상태
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-primary transition-colors"
                >
                  <UserCircle className="w-4 h-4" />
                  My Page
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-dark transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </>
            ) : (
              // 비로그인 상태
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-primary transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  로그인
                </Link>
                <Link href="/apply">
                  <Button size="sm">코칭 신청하기</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                {link.isDropdown ? (
                  <div className="space-y-2">
                    <div className="font-medium text-gray-900 px-3 py-2">{link.label}</div>
                    <div className="pl-6 space-y-2 border-l-2 border-gray-100 ml-3">
                      <Link
                        href="/program#process"
                        onClick={() => setIsOpen(false)}
                        className="block text-sm font-bold text-primary"
                      >
                        코칭 프로세스 안내
                      </Link>
                      {Object.values(PROGRAMS).map((program) => (
                        <Link
                          key={program.id}
                          href={`/program/${program.id}`}
                          onClick={() => setIsOpen(false)}
                          className="block text-sm text-gray-600 hover:text-primary"
                        >
                          {program.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-base font-medium text-secondary hover:text-primary hover:bg-gray-50 rounded-md">
                      <UserCircle className="w-4 h-4" />
                      My Page
                    </button>
                  </Link>
                  <button
                    onClick={() => { setIsOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-base font-medium text-secondary hover:text-dark hover:bg-gray-50 rounded-md"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-base font-medium text-secondary hover:text-primary hover:bg-gray-50 rounded-md">
                      <LogIn className="w-4 h-4" />
                      로그인
                    </button>
                  </Link>
                  <Link href="/apply" onClick={() => setIsOpen(false)}>
                    <Button fullWidth>코칭 신청하기</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
