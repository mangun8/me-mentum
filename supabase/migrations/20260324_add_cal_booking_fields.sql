-- Cal.com 연동을 위한 bookings 테이블 확장
-- cal_booking_uid: Cal.com 예약 고유 ID (중복 방지)
-- program_id, coach_id를 nullable로 변경 (Cal.com 웹훅에서는 아직 매핑 불가)

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS cal_booking_uid text UNIQUE,
  ALTER COLUMN program_id DROP NOT NULL,
  ALTER COLUMN user_id DROP NOT NULL;
