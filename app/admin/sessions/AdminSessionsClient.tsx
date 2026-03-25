'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Loader2, ExternalLink, ChevronLeft, Search } from 'lucide-react';

interface SessionRecord {
  id: string;
  scheduled_at: string;
  status: string;
  summary_status: string;
  google_doc_url: string | null;
  transcript: string | null;
  user_id: string | null;
  users: { email: string; full_name: string | null } | null;
  pre_survey_data: { attendee_name?: string; attendee_email?: string } | null;
}

export default function AdminSessionsClient() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadSessions() {
      const res = await fetch('/api/admin/sessions');
      const json = await res.json();
      if (json.sessions) {
        setSessions(json.sessions as SessionRecord[]);
      }
      setLoading(false);
    }

    loadSessions();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const summaryBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: '요약 완료', color: 'bg-green-50 text-green-700' };
      case 'processing':
      case 'transcribing':
      case 'summarizing':
        return { text: '분석 중', color: 'bg-blue-50 text-blue-700' };
      case 'failed':
        return { text: '분석 실패', color: 'bg-red-50 text-red-700' };
      default:
        return { text: '대기', color: 'bg-gray-100 text-gray-500' };
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return { text: '확정', color: 'bg-green-50 text-green-700' };
      case 'pending': return { text: '대기', color: 'bg-yellow-50 text-yellow-700' };
      case 'cancelled': return { text: '취소', color: 'bg-red-50 text-red-700' };
      default: return { text: status, color: 'bg-gray-100 text-gray-500' };
    }
  };

  const getClientName = (session: SessionRecord) => {
    return session.users?.full_name
      || session.pre_survey_data?.attendee_name
      || session.users?.email
      || session.pre_survey_data?.attendee_email
      || '알 수 없음';
  };

  const getClientEmail = (session: SessionRecord) => {
    return session.users?.email || session.pre_survey_data?.attendee_email || '';
  };

  const filtered = sessions.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      getClientName(s).toLowerCase().includes(q) ||
      getClientEmail(s).toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-secondary hover:text-dark transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-serif italic text-lg">M</span>
            <span className="font-bold text-dark">세션 관리</span>
            <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">ADMIN</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-dark">전체 세션 기록</h1>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="이름 또는 이메일 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-secondary">
            {searchQuery ? '검색 결과가 없습니다.' : '아직 세션 기록이 없습니다.'}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">날짜/시간</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">고객</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">예약 상태</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">요약</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">문서</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((session) => {
                  const sb = summaryBadge(session.summary_status);
                  const stb = statusBadge(session.status);
                  return (
                    <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-dark">{formatDate(session.scheduled_at)}</p>
                        <p className="text-xs text-secondary">{formatTime(session.scheduled_at)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-dark">{getClientName(session)}</p>
                        <p className="text-xs text-secondary">{getClientEmail(session)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${stb.color}`}>
                          {stb.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${sb.color}`}>
                          {session.summary_status === 'processing' || session.summary_status === 'transcribing' || session.summary_status === 'summarizing' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : session.summary_status === 'completed' ? (
                            <FileText className="w-3 h-3" />
                          ) : null}
                          {sb.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {session.google_doc_url ? (
                          <a
                            href={session.google_doc_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            열기
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
