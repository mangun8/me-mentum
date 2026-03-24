import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

// Cal.com 웹훅 시크릿으로 검증
const WEBHOOK_SECRET = process.env.CAL_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    // 웹훅 시크릿 검증
    if (WEBHOOK_SECRET) {
      const authHeader = request.headers.get('x-cal-signature-256');
      // Cal.com은 HMAC-SHA256 서명을 보냄 — 시크릿 설정 시 검증
      if (!authHeader) {
        console.warn('[Cal Webhook] 서명 없음, 시크릿이 설정되어 있지만 서명 헤더 누락');
      }
    }

    const payload = await request.json();
    const { triggerEvent, payload: data } = payload;

    console.log(`[Cal Webhook] 이벤트: ${triggerEvent}`);

    const supabase = createAdminClient();

    if (triggerEvent === 'BOOKING_CREATED') {
      await handleBookingCreated(supabase, data);
    } else if (triggerEvent === 'BOOKING_RESCHEDULED') {
      await handleBookingRescheduled(supabase, data);
    } else if (triggerEvent === 'BOOKING_CANCELLED') {
      await handleBookingCancelled(supabase, data);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Cal Webhook] 처리 실패:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleBookingCreated(
  supabase: ReturnType<typeof createAdminClient>,
  data: Record<string, unknown>
) {
  const bookingUid = data.uid as string;
  const startTime = data.startTime as string;
  const attendeeEmail = getAttendeeEmail(data);
  const attendeeName = getAttendeeName(data);

  console.log(`[Cal Webhook] 예약 생성: ${bookingUid}, ${attendeeEmail}, ${startTime}`);

  // 이메일로 유저 찾기
  const userId = await findUserByEmail(supabase, attendeeEmail);

  const { error } = await supabase.from('bookings').upsert(
    {
      cal_booking_uid: bookingUid,
      user_id: userId,
      scheduled_at: startTime,
      status: 'confirmed',
      pre_survey_data: {
        attendee_name: attendeeName,
        attendee_email: attendeeEmail,
        cal_event_title: data.title,
        cal_event_description: data.description,
      },
    },
    { onConflict: 'cal_booking_uid' }
  );

  if (error) {
    console.error('[Cal Webhook] 예약 저장 실패:', error);
    throw error;
  }
}

async function handleBookingRescheduled(
  supabase: ReturnType<typeof createAdminClient>,
  data: Record<string, unknown>
) {
  const bookingUid = data.uid as string;
  const startTime = data.startTime as string;
  const rescheduleUid = data.rescheduleUid as string;

  console.log(`[Cal Webhook] 예약 변경: ${rescheduleUid} → ${bookingUid}`);

  // 기존 예약 취소 처리
  if (rescheduleUid) {
    await supabase
      .from('bookings')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('cal_booking_uid', rescheduleUid);
  }

  // 새 예약 생성
  const attendeeEmail = getAttendeeEmail(data);
  const attendeeName = getAttendeeName(data);
  const userId = await findUserByEmail(supabase, attendeeEmail);

  const { error } = await supabase.from('bookings').upsert(
    {
      cal_booking_uid: bookingUid,
      user_id: userId,
      scheduled_at: startTime,
      status: 'confirmed',
      pre_survey_data: {
        attendee_name: attendeeName,
        attendee_email: attendeeEmail,
        cal_event_title: data.title,
      },
    },
    { onConflict: 'cal_booking_uid' }
  );

  if (error) {
    console.error('[Cal Webhook] 재예약 저장 실패:', error);
    throw error;
  }
}

async function handleBookingCancelled(
  supabase: ReturnType<typeof createAdminClient>,
  data: Record<string, unknown>
) {
  const bookingUid = data.uid as string;

  console.log(`[Cal Webhook] 예약 취소: ${bookingUid}`);

  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('cal_booking_uid', bookingUid);

  if (error) {
    console.error('[Cal Webhook] 취소 처리 실패:', error);
    throw error;
  }
}

// Cal.com 페이로드에서 참석자 이메일 추출
function getAttendeeEmail(data: Record<string, unknown>): string {
  const attendees = data.attendees as Array<{ email: string }> | undefined;
  if (attendees && attendees.length > 0) {
    return attendees[0].email;
  }
  const responses = data.responses as Record<string, { value: string }> | undefined;
  if (responses?.email?.value) {
    return responses.email.value;
  }
  return '';
}

function getAttendeeName(data: Record<string, unknown>): string {
  const attendees = data.attendees as Array<{ name: string }> | undefined;
  if (attendees && attendees.length > 0) {
    return attendees[0].name;
  }
  const responses = data.responses as Record<string, { value: string }> | undefined;
  if (responses?.name?.value) {
    return responses.name.value;
  }
  return '';
}

// 이메일로 Supabase users 테이블에서 유저 찾기
async function findUserByEmail(
  supabase: ReturnType<typeof createAdminClient>,
  email: string
): Promise<string | null> {
  if (!email) return null;

  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  return data?.id ?? null;
}
