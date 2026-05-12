import { createAdminClient } from '@/utils/supabase/admin';
import InviteForm from './InviteForm';

export const dynamic = 'force-dynamic';

interface InviteRow {
  code: string;
  target_role: string;
  note: string | null;
  used_by: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

async function getInvites(): Promise<InviteRow[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('invite_codes')
    .select('code, target_role, note, used_by, used_at, expires_at, created_at')
    .order('created_at', { ascending: false })
    .limit(100);
  return (data as InviteRow[]) ?? [];
}

function formatDate(iso: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function statusOf(row: InviteRow): { label: string; color: string } {
  if (row.used_at) return { label: '사용됨', color: 'text-gray-400' };
  if (row.expires_at && new Date(row.expires_at) < new Date()) {
    return { label: '만료됨', color: 'text-red-500' };
  }
  return { label: '미사용', color: 'text-green-600' };
}

export default async function AdminInvitesPage() {
  const invites = await getInvites();

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-dark mb-2">초대 코드 관리</h1>
          <p className="text-secondary text-sm">
            지인용 1:1 정용훈 코칭 트랙 접근 코드를 발급합니다. 코드를 받은 분이{' '}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/redeem</code>{' '}
            페이지에 입력하면 친구 회원으로 등록됩니다.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
          <h2 className="text-lg font-semibold text-dark mb-4">새 코드 발급</h2>
          <InviteForm />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-dark">발급된 코드 ({invites.length})</h2>
          </div>
          {invites.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm text-gray-400">
              아직 발급된 코드가 없습니다.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left">코드</th>
                  <th className="px-6 py-3 text-left">메모</th>
                  <th className="px-6 py-3 text-left">상태</th>
                  <th className="px-6 py-3 text-left">발급일</th>
                  <th className="px-6 py-3 text-left">사용일</th>
                  <th className="px-6 py-3 text-left">만료일</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((row) => {
                  const status = statusOf(row);
                  return (
                    <tr key={row.code} className="border-t border-gray-100">
                      <td className="px-6 py-3 font-mono font-semibold text-dark">{row.code}</td>
                      <td className="px-6 py-3 text-secondary">{row.note || '-'}</td>
                      <td className={`px-6 py-3 font-medium ${status.color}`}>{status.label}</td>
                      <td className="px-6 py-3 text-secondary">{formatDate(row.created_at)}</td>
                      <td className="px-6 py-3 text-secondary">{formatDate(row.used_at)}</td>
                      <td className="px-6 py-3 text-secondary">{formatDate(row.expires_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
