import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/utils/supabase/admin';

// Cal.com 웹훅 시크릿으로 검증
const WEBHOOK_SECRET = process.env.CAL_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    // 서명 검증을 위해 raw body를 먼저 읽음 (request.json()은 스트림을 소비함)
    const rawBody = await request.text();

    // Cal.com 웹훅 HMAC-SHA256 서명 검증 (x-cal-signature-256)
    if (WEBHOOK_SECRET) {
      const signature = request.headers.get('x-cal-signature-256');
      if (!signature) {
        console.warn('[Cal Webhook] 서명 헤더 누락 — 요청 거부');
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }
      const expected = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');
      const sigBuf = Buffer.from(signature);
      const expBuf = Buffer.from(expected);
      if (
        sigBuf.length !== expBuf.length ||
        !crypto.timingSafeEqual(sigBuf, expBuf)
      ) {
        console.warn('[Cal Webhook] 서명 불일치 — 요청 거부');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
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
  const zoomMeetingId = extractZoomMeetingId(data);

  console.log(
    `[Cal Webhook] 예약 생성: ${bookingUid}, ${attendeeEmail}, ${startTime}, zoom=${zoomMeetingId ?? '없음'}`
  );

  // 이메일로 유저 찾기
  const userId = await findUserByEmail(supabase, attendeeEmail);

  const { error } = await supabase.from('bookings').upsert(
    {
      cal_booking_uid: bookingUid,
      user_id: userId,
      scheduled_at: startTime,
      status: 'confirmed',
      // null이면 키 자체를 넣지 않아 기존 값을 덮어쓰지 않음
      ...(zoomMeetingId ? { zoom_meeting_id: zoomMeetingId } : {}),
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

  const zoomMeetingId = extractZoomMeetingId(data);

  const { error } = await supabase.from('bookings').upsert(
    {
      cal_booking_uid: bookingUid,
      user_id: userId,
      scheduled_at: startTime,
      status: 'confirmed',
      ...(zoomMeetingId ? { zoom_meeting_id: zoomMeetingId } : {}),
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

// Zoom 미팅 URL에서 숫자 ID 추출 (https://zoom.us/j/12345678901?pwd=... → 12345678901)
function parseZoomIdFromUrl(url: string): string | null {
  const match = url.match(/zoom\.us\/[a-z]*\/(\d{8,})/i);
  return match ? match[1] : null;
}

// Cal.com 페이로드의 여러 위치에서 Zoom 미팅 ID를 방어적으로 추출.
// Cal.com 버전·연동 설정에 따라 위치가 달라 후보 경로를 순차 시도한다.
function extractZoomMeetingId(data: Record<string, unknown>): string | null {
  // 1. videoCallData.id 또는 videoCallData.url
  const videoCallData = data.videoCallData as
    | { id?: string | number; url?: string }
    | undefined;
  if (videoCallData?.id) return String(videoCallData.id);
  if (videoCallData?.url) {
    const fromUrl = parseZoomIdFromUrl(videoCallData.url);
    if (fromUrl) return fromUrl;
  }

  // 2. location 필드가 Zoom URL인 경우
  const location = data.location as string | undefined;
  if (typeof location === 'string') {
    const fromLoc = parseZoomIdFromUrl(location);
    if (fromLoc) return fromLoc;
  }

  // 3. metadata.videoCallUrl
  const metadata = data.metadata as { videoCallUrl?: string } | undefined;
  if (metadata?.videoCallUrl) {
    const fromMeta = parseZoomIdFromUrl(metadata.videoCallUrl);
    if (fromMeta) return fromMeta;
  }

  // 4. references 배열에서 Zoom 항목
  const references = data.references as
    | Array<{ type?: string; meetingId?: string | number; meetingUrl?: string }>
    | undefined;
  if (Array.isArray(references)) {
    const zoomRef = references.find((r) =>
      r.type?.toLowerCase().includes('zoom')
    );
    if (zoomRef?.meetingId) return String(zoomRef.meetingId);
    if (zoomRef?.meetingUrl) {
      const fromRef = parseZoomIdFromUrl(zoomRef.meetingUrl);
      if (fromRef) return fromRef;
    }
  }

  return null;
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
