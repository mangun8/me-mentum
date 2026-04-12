-- ============================================================
-- 1. coaches (코치) — bookings가 참조하므로 먼저 생성
-- ============================================================
create table public.coaches (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text,
  bio         text,
  image_url   text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 2. programs (코칭 프로그램)
-- ============================================================
create table public.programs (
  id                   uuid primary key default gen_random_uuid(),
  track                text not null,  -- 'Junior' | 'Senior' | 'Executive' | 'Founder'
  title                text not null,
  description          text,
  price_per_ticket     int not null,         -- 1회당 단가 (원)
  sessions_per_package int not null default 4, -- 패키지 회차 수 (기본 4회권)
  is_active            boolean not null default true,
  created_at           timestamptz not null default now()
);

-- ============================================================
-- 3. users (회원)
-- ============================================================
create table public.users (
  id                uuid primary key references auth.users(id) on delete cascade,
  email             text unique not null,
  full_name         text,
  phone_number      text not null,            -- 카카오 알림톡 발송용 (필수)
  remaining_tickets int not null default 0,   -- 잔여 회차 (4회권 구매 시 +4)
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- 4. payments (결제)
-- ============================================================
create table public.payments (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.users(id) on delete restrict,
  program_id        uuid not null references public.programs(id) on delete restrict,
  amount            int not null,             -- 실 결제 금액 (원)
  tickets_granted   int not null,             -- 이번 결제로 부여된 회차 수 (보통 4)
  status            text not null default 'pending', -- 'pending' | 'completed' | 'refunded'
  pg_transaction_id text,                     -- PG사 거래 ID
  paid_at           timestamptz,
  created_at        timestamptz not null default now()
);

-- ============================================================
-- 5. bookings (예약 / 세션)
-- ============================================================
create table public.bookings (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete restrict,
  program_id       uuid not null references public.programs(id) on delete restrict,
  coach_id         uuid references public.coaches(id) on delete set null,
  scheduled_at     timestamptz not null,      -- 코칭 예약 일시
  status           text not null default 'pending',
  pre_survey_data  jsonb,                     -- 사전 설문 응답 (JSONB로 유연하게 저장)
  session_notes    text,                      -- 코치 메모 (선택)
  cancelled_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ============================================================
-- 트리거: 결제 완료 시 remaining_tickets 자동 증가
-- ============================================================
create or replace function handle_payment_completed()
returns trigger language plpgsql security definer as $$
begin
  if new.status = 'completed' and old.status != 'completed' then
    update public.users
    set remaining_tickets = remaining_tickets + new.tickets_granted,
        updated_at = now()
    where id = new.user_id;
  end if;
  return new;
end;
$$;

create trigger on_payment_completed
  after update on public.payments
  for each row execute function handle_payment_completed();

-- ============================================================
-- 트리거: 예약 확정/취소 시 remaining_tickets 자동 차감/환원
-- ============================================================
create or replace function handle_booking_status_changed()
returns trigger language plpgsql security definer as $$
begin
  if new.status = 'confirmed' and old.status != 'confirmed' then
    update public.users
    set remaining_tickets = remaining_tickets - 1,
        updated_at = now()
    where id = new.user_id;
  elsif new.status = 'cancelled' and old.status = 'confirmed' then
    update public.users
    set remaining_tickets = remaining_tickets + 1,
        updated_at = now()
    where id = new.user_id;
  end if;
  return new;
end;
$$;

create trigger on_booking_status_changed
  after update on public.bookings
  for each row execute function handle_booking_status_changed();

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table public.users    enable row level security;
alter table public.payments enable row level security;
alter table public.bookings enable row level security;
alter table public.coaches  enable row level security;
alter table public.programs enable row level security;

-- users: 본인 데이터만 조회/수정
create policy "users: own row" on public.users
  for all using (id = auth.uid());

-- payments: 본인 결제 내역만 조회
create policy "payments: own rows" on public.payments
  for all using (user_id = auth.uid());

-- bookings: 본인 예약만 조회/수정
create policy "bookings: own rows" on public.bookings
  for all using (user_id = auth.uid());

-- coaches: 누구나 조회 가능 (공개 정보)
create policy "coaches: public read" on public.coaches
  for select using (true);

-- programs: 누구나 조회 가능 (공개 정보)
create policy "programs: public read" on public.programs
  for select using (true);
