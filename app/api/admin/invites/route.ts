import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { requireCoach } from '@/lib/auth';
import { createAdminClient } from '@/utils/supabase/admin';

// I, O, 0, 1 제외 — 사람이 받아 적을 때 혼동 방지
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateInviteCode(length = 8): string {
  const bytes = randomBytes(length);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS[bytes[i] % CODE_CHARS.length];
  }
  return code;
}

export async function GET() {
  try {
    await requireCoach();
  } catch {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('invite_codes')
    .select('code, target_role, note, used_by, used_at, expires_at, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ invites: data ?? [] });
}

export async function POST(request: NextRequest) {
  let coach;
  try {
    coach = await requireCoach();
  } catch {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    note?: string;
    expiresInDays?: number;
  };

  const admin = createAdminClient();

  // 최대 5회 충돌 재시도
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateInviteCode(8);
    const expiresAt = body.expiresInDays
      ? new Date(Date.now() + body.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const { data, error } = await admin
      .from('invite_codes')
      .insert({
        code,
        target_role: 'friend',
        created_by: coach.id,
        note: body.note ?? null,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (!error) {
      return NextResponse.json({ invite: data });
    }
    // unique violation이면 다시 시도, 다른 에러면 break
    if (error.code !== '23505') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json(
    { error: 'CODE_GENERATION_FAILED' },
    { status: 500 }
  );
}
