import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { DIAGNOSIS_OPTIONS, PROGRAMS, TRIAL_SURCHARGE } from '@/constants';

type PackageMode = 'full' | 'trial';

function parseOrderId(orderId: string) {
  const parts = orderId.split('_');
  if (parts[0] !== 'mementum') return null;

  const track = parts[1];
  const mode: PackageMode = parts[2] === 'trial' ? 'trial' : 'full';

  // 신형: mementum_{track}_{mode}_{option}_{ts}
  // 구형: mementum_{track}_{mode}_{ts} → option 'basic'으로 가정
  // 더 구버전: mementum_{track}_{ts} → mode 'full', option 'basic'
  const hasMode = parts[2] === 'trial' || parts[2] === 'full';
  let optionId = 'basic';
  if (hasMode && parts.length >= 5) {
    optionId = parts[3];
  }

  return { track, mode, optionId };
}

export async function POST(request: Request) {
  const { paymentKey, orderId, amount } = await request.json();

  // 1. 로그인 확인
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  // 2. orderId 파싱 및 1차 검증
  const parsed = parseOrderId(orderId);
  if (!parsed) {
    return NextResponse.json({ error: '유효하지 않은 주문번호입니다.' }, { status: 400 });
  }
  const { track, mode, optionId } = parsed;

  const programInfo = Object.values(PROGRAMS).find(p => p.id === track);
  const option = DIAGNOSIS_OPTIONS.find(o => o.id === optionId);
  if (!programInfo || !option) {
    return NextResponse.json({ error: '주문 정보를 확인할 수 없습니다.' }, { status: 400 });
  }

  // 친구 트랙은 friend/coach role만 결제 가능
  if (programInfo.audience === 'friend') {
    const adminCheck = createAdminClient();
    const { data: userProfile } = await adminCheck
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    const role = userProfile?.role;
    if (role !== 'friend' && role !== 'coach') {
      return NextResponse.json(
        { error: '친구 코칭 트랙에 접근할 권한이 없습니다. 초대 코드를 먼저 등록해 주세요.' },
        { status: 403 }
      );
    }
    // 친구 트랙은 항상 full 모드 + basic 옵션 + 체험권 차감 없음
    if (mode !== 'full' || optionId !== 'basic') {
      return NextResponse.json(
        { error: '친구 코칭 트랙은 단일 옵션으로만 결제 가능합니다.' },
        { status: 400 }
      );
    }
  }

  // 3. 서버측 기대 금액 계산 + 체험권 잔액 확인
  const adminClient = createAdminClient();

  const { data: program } = await adminClient
    .from('programs')
    .select('id, sessions_per_package')
    .eq('track', track)
    .eq('is_active', true)
    .single();

  if (!program) {
    return NextResponse.json({ error: '프로그램을 찾을 수 없습니다.' }, { status: 400 });
  }

  const baseAmount = mode === 'trial'
    ? programInfo.pricePerSession + TRIAL_SURCHARGE
    : programInfo.priceValue;

  // 정규 패키지(full)인 경우, 미소진 체험권 합계를 차감 적용
  let creditDiscount = 0;
  let creditPaymentIds: string[] = [];
  if (mode === 'full') {
    const { data: trials } = await adminClient
      .from('payments')
      .select('id, amount')
      .eq('user_id', user.id)
      .eq('program_id', program.id)
      .eq('package_mode', 'trial')
      .eq('status', 'completed')
      .is('credit_consumed_at', null);

    const rows = trials ?? [];
    creditDiscount = Math.min(
      rows.reduce((s, p) => s + (p.amount ?? 0), 0),
      baseAmount + option.addPrice
    );
    creditPaymentIds = rows.map(p => p.id);
  }

  const expectedAmount = baseAmount + option.addPrice - creditDiscount;

  if (amount !== expectedAmount) {
    return NextResponse.json(
      { error: `결제 금액이 일치하지 않습니다. (요청 ${amount}, 기대 ${expectedAmount})` },
      { status: 400 }
    );
  }

  // 4. 토스페이먼츠 결제 승인 API 호출
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

  // 5. public.users에 유저가 없으면 생성
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
      phone_number: '',
    });
  }

  // 6. 결제 기록 생성
  const ticketsGranted = mode === 'trial' ? 1 : (program.sessions_per_package ?? 4);

  const { data: insertedPayment, error: paymentError } = await adminClient
    .from('payments')
    .insert({
      user_id: user.id,
      program_id: program.id,
      amount: tossData.totalAmount,
      tickets_granted: ticketsGranted,
      package_mode: mode,
      status: 'completed',
      pg_transaction_id: tossData.paymentKey,
      paid_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (paymentError || !insertedPayment) {
    console.error('Payment record error:', paymentError);
    return NextResponse.json(
      { error: '결제는 완료되었으나 기록 저장에 실패했습니다. 고객센터에 문의해주세요.' },
      { status: 500 }
    );
  }

  // 7. 정규 패키지 결제 시 체험권 원자적 소진
  if (mode === 'full' && creditPaymentIds.length > 0) {
    const { data: consumed, error: consumeError } = await adminClient
      .from('payments')
      .update({
        credit_consumed_at: new Date().toISOString(),
        credit_consumed_by: insertedPayment.id,
      })
      .in('id', creditPaymentIds)
      .is('credit_consumed_at', null) // 동시성 방어
      .select('id');

    if (consumeError) {
      console.error('Credit consume error:', consumeError);
      // 결제는 이미 들어갔으므로 실패해도 사용자 화면은 성공으로 처리하되 운영 알림 필요
    } else if ((consumed?.length ?? 0) !== creditPaymentIds.length) {
      console.warn('Credit consume race detected', {
        expected: creditPaymentIds.length,
        actual: consumed?.length,
        userId: user.id,
        paymentId: insertedPayment.id,
      });
    }
  }

  return NextResponse.json({ success: true, orderId });
}
