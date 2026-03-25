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

      // meetingId로 booking 찾기 (zoom_meeting_id 매칭)
      // 또는 시간 기반 매칭
      const { data: booking } = await supabase
        .from('bookings')
        .select('id, user_id')
        .eq('zoom_meeting_id', meetingId)
        .single();

      // zoom_meeting_id가 없으면 시간 기반으로 가장 가까운 booking 매칭
      let bookingId = booking?.id;
      let userId = booking?.user_id;

      if (!bookingId) {
        const meetingStartTime = payload.object.start_time;
        const { data: nearestBooking } = await supabase
          .from('bookings')
          .select('id, user_id')
          .eq('status', 'confirmed')
          .gte('scheduled_at', new Date(new Date(meetingStartTime).getTime() - 60 * 60 * 1000).toISOString())
          .lte('scheduled_at', new Date(new Date(meetingStartTime).getTime() + 60 * 60 * 1000).toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(1)
          .single();

        if (nearestBooking) {
          bookingId = nearestBooking.id;
          userId = nearestBooking.user_id;
        }
      }

      if (!bookingId) {
        console.warn('[Zoom Webhook] 매칭되는 booking 없음');
        return NextResponse.json({ success: true });
      }

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
