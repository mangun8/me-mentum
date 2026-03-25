-- 세션 후처리 결과 저장용 컬럼 추가
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS zoom_meeting_id text,
  ADD COLUMN IF NOT EXISTS transcript text,
  ADD COLUMN IF NOT EXISTS google_doc_url text,
  ADD COLUMN IF NOT EXISTS summary_status text NOT NULL DEFAULT 'none';
-- summary_status: 'none' | 'processing' | 'transcribing' | 'summarizing' | 'completed' | 'failed'
