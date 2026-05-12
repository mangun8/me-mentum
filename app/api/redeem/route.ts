import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { code?: string };
  const code = (body.code ?? '').trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ error: 'CODE_REQUIRED' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: invite, error: fetchError } = await admin
    .from('invite_codes')
    .select('code, target_role, used_by, used_at, expires_at')
    .eq('code', code)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }
  if (!invite) {
    return NextResponse.json({ error: 'CODE_NOT_FOUND' }, { status: 404 });
  }
  if (invite.used_by) {
    return NextResponse.json({ error: 'CODE_ALREADY_USED' }, { status: 409 });
  }
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: 'CODE_EXPIRED' }, { status: 410 });
  }

  // 1) invite_codes에 사용 기록 (used_by가 null인 경우만 — race condition 방지)
  const { data: claimed, error: claimError } = await admin
    .from('invite_codes')
    .update({ used_by: user.id, used_at: new Date().toISOString() })
    .eq('code', code)
    .is('used_by', null)
    .select()
    .single();

  if (claimError || !claimed) {
    return NextResponse.json({ error: 'CODE_ALREADY_USED' }, { status: 409 });
  }

  // 2) users.role 업그레이드 (coach는 downgrade하지 않음)
  const { data: currentUser } = await admin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (currentUser?.role !== 'coach') {
    await admin
      .from('users')
      .update({ role: invite.target_role })
      .eq('id', user.id);
  }

  return NextResponse.json({ ok: true, role: invite.target_role });
}
