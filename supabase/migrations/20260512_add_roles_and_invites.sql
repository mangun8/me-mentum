-- ============================================================
-- users.role 추가 — 'user' | 'friend' | 'coach'
-- ============================================================
alter table public.users
  add column if not exists role text not null default 'user'
  check (role in ('user', 'friend', 'coach'));

create index if not exists users_role_idx on public.users(role);

-- ============================================================
-- invite_codes — 코치(운영자)가 발급, 사용자가 redeem
-- ============================================================
create table if not exists public.invite_codes (
  code         text primary key,
  target_role  text not null default 'friend'
                 check (target_role in ('friend', 'coach')),
  created_by   uuid not null references public.users(id) on delete restrict,
  note         text,
  used_by      uuid references public.users(id) on delete set null,
  used_at      timestamptz,
  expires_at   timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists invite_codes_created_by_idx on public.invite_codes(created_by);
create index if not exists invite_codes_used_by_idx    on public.invite_codes(used_by);

alter table public.invite_codes enable row level security;

-- 발급자 또는 사용자만 본인 행 조회 가능 (admin은 service role로 우회)
create policy "invite_codes: own creator or used_by"
  on public.invite_codes
  for select using (
    created_by = auth.uid() or used_by = auth.uid()
  );

-- ============================================================
-- friend-coaching 트랙을 programs 테이블에 추가 (멱등)
-- ============================================================
insert into public.programs (track, title, description, price_per_ticket, sessions_per_package, is_active)
select 'friend-coaching',
       '1:1 정용훈 코칭',
       '지인·추천 대상 1:1 단발 코칭 세션 (60분)',
       50000, 1, true
where not exists (
  select 1 from public.programs where track = 'friend-coaching'
);
