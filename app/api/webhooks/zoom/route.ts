import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/utils/supabase/admin';
import { processSessionRecording } from '@/lib/session-processor';

const ZOOM_WEBHOOK_SECRET_TOKEN = process.env.ZOOM_WEBHOOK_SECRET_TOKEN!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Zoom URL validation (웹훅 등록 시 검증 요청)
    if (body.event === 'endpoint.url_validation') {
      const hashForValidation = crypto
        .createHmac('sha256', ZOOM_WEBHOOK_SECRET_TOKEN)
        .update(body.payload.plainToken)
        .digest('hex');

      return NextResponse.json({
        plainToken: body.payload.plainToken,
        encryptedToken: hashForValidation,
      });
    }

    // 녹화 완료 이벤트
    if (body.event === 'recording.completed') {
      const { payload } = body;
      const meetingId = String(payload.object.id);
      const recordingFiles = payload.object.recording_files as Array<{
        recording_type: string;
        download_url: string;
        file_type: string;
        file_extension: string;
      }>;

      // 오디오 파일만 추출
      const audioFile = recordingFiles.find(
        (f) => f.recording_type === 'audio_only' || f.file_type === 'M4A'
      );

      if (!audioFile) {
        console.log('[Zoom Webhook] 오디오 파일 없음, 스킵');
        return NextResponse.json({ success: true });
      }

      console.log(`[Zoom Webhook] 녹화 완료: meetingId=${meetingId}`);

      const supabase = createAdminClient();

      // 1순위: zoom_meeting_id 정확 매칭
      const { data: byMeetingId } = await supabase
        .from('bookings')
        .select('id, user_id, summary_status')
        .eq('zoom_meeting_id', meetingId)
        .maybeSingle();

      let matched = byMeetingId;

      // 2순위: zoom_meeting_id 매칭 실패 시에만 시간 기반 fallback.
      // 단, 아직 미처리(summary_status='none')이고 zoom_meeting_id가
      // 비어있는 booking만 대상 → 이미 처리된 세션을 재매칭하지 않음
      // (연속 코칭 시 이전 세션 booking을 덮어쓰는 문제 방지)
      if (!matched) {
        const meetingStartTime = payload.object.start_time;
        const { data: nearestBooking } = await supabase
          .from('bookings')
          .select('id, user_id, summary_status')
          .eq('status', 'confirmed')
          .is('zoom_meeting_id', null)
          .eq('summary_status', 'none')
          .gte('scheduled_at', new Date(new Date(meetingStartTime).getTime() - 60 * 60 * 1000).toISOString())
          .lte('scheduled_at', new Date(new Date(meetingStartTime).getTime() + 60 * 60 * 1000).toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(1)
          .maybeSingle();

        matched = nearestBooking;
      }

      if (!matched) {
        console.warn(`[Zoom Webhook] 매칭되는 booking 없음: meetingId=${meetingId}`);
        return NextResponse.json({ success: true });
      }

      // 멱등성: 이미 처리 중이거나 완료된 booking이면 스킵
      // (Zoom은 응답 지연·실패 시 동일 웹훅을 재발송함)
      const inFlightStatuses = ['processing', 'transcribing', 'summarizing', 'completed'];
      if (inFlightStatuses.includes(matched.summary_status)) {
        console.log(
          `[Zoom Webhook] 이미 처리됨(${matched.summary_status}), 스킵: bookingId=${matched.id}`
        );
        return NextResponse.json({ success: true });
      }

      const bookingId = matched.id;
      const userId = matched.user_id;

      // summary_status 업데이트
      await supabase
        .from('bookings')
        .update({ zoom_meeting_id: meetingId, summary_status: 'processing', updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      // 백그라운드에서 후처리 시작 (응답은 즉시 반환)
      const downloadUrl = `${audioFile.download_url}?access_token=${payload.download_token}`;

      processSessionRecording({
        bookingId,
        userId,
        downloadUrl,
        meetingId,
      }).catch((err) => {
        console.error('[Zoom Webhook] 후처리 실패:', err);
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Zoom Webhook] 처리 실패:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
