import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET() {
  // 현재 유저 확인
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // 관리자용: service role로 전체 bookings 조회 (RLS 우회)
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('bookings')
    .select('id, scheduled_at, status, summary_status, google_doc_url, transcript, user_id, users(email, full_name), pre_survey_data')
    .order('scheduled_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sessions: data });
}
