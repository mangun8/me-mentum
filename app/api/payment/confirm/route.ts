import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  const { paymentKey, orderId, amount } = await request.json();

  // 1. 로그인 확인
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  // 2. 토스페이먼츠 결제 승인 API 호출
  const secretKey = process.env.TOSS_SECRET_KEY!;
  const encodedKey = Buffer.from(`${secretKey}:`).toString('base64');

  const tossRes = await fetch('https://api.tosspayments.com/v2/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodedKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const tossData = await tossRes.json();

  if (!tossRes.ok) {
    return NextResponse.json(
      { error: tossData.message ?? '결제 승인에 실패했습니다.' },
      { status: 400 }
    );
  }

  // 3. orderId에서 프로그램 정보 추출 (orderId 형식: mementum_{programId}_{timestamp})
  const parts = orderId.split('_');
  const programTrack = parts[1]; // 'junior', 'senior', etc.

  // 4. Supabase에 결제 기록 저장
  const adminClient = createAdminClient();

  // public.users에 유저가 없으면 생성
  const { data: existingUser } = await adminClient
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!existingUser) {
    await adminClient.from('users').insert({
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name ?? null,
      phone_number: tossData.card?.ownerType === '개인' ? '' : '',
    });
  }

  // programs 테이블에서 프로그램 조회
  const { data: program } = await adminClient
    .from('programs')
    .select('id, sessions_per_package')
    .eq('track', programTrack)
    .eq('is_active', true)
    .single();

  // 결제 기록 생성 (status: completed → 트리거로 remaining_tickets 증가)
  const { error: paymentError } = await adminClient.from('payments').insert({
    user_id: user.id,
    program_id: program?.id ?? null,
    amount: tossData.totalAmount,
    tickets_granted: program?.sessions_per_package ?? 4,
    status: 'completed',
    pg_transaction_id: tossData.paymentKey,
    paid_at: new Date().toISOString(),
  });

  if (paymentError) {
    console.error('Payment record error:', paymentError);
    return NextResponse.json(
      { error: '결제는 완료되었으나 기록 저장에 실패했습니다. 고객센터에 문의해주세요.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, orderId });
}
