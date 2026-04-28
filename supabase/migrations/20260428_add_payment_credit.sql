-- 1회 체험권 → 정규 4회 패키지 차감 정책 지원
-- package_mode: 결제 형태 ('full' | 'trial')
-- credit_consumed_at / credit_consumed_by: 체험권이 정규 패키지로 차감되어 소진된 시점/원천 결제

ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS package_mode text NOT NULL DEFAULT 'full',
  ADD COLUMN IF NOT EXISTS credit_consumed_at timestamptz,
  ADD COLUMN IF NOT EXISTS credit_consumed_by uuid REFERENCES public.payments(id) ON DELETE SET NULL;

-- 정합성 제약: package_mode는 두 값만 허용
ALTER TABLE public.payments
  DROP CONSTRAINT IF EXISTS payments_package_mode_check;
ALTER TABLE public.payments
  ADD CONSTRAINT payments_package_mode_check CHECK (package_mode IN ('full', 'trial'));

-- 미소진 trial 결제 빠른 조회
CREATE INDEX IF NOT EXISTS idx_payments_trial_unconsumed
  ON public.payments (user_id, program_id)
  WHERE package_mode = 'trial' AND credit_consumed_at IS NULL AND status = 'completed';
