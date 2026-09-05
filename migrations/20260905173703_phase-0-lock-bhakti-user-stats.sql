-- Phase 0 — lock bhakti_user_stats, add identity/quota/daily-reward columns,
-- and move every rule the phone must not control into server-owned RPCs.
-- Runs as project_admin inside one transaction (no BEGIN/COMMIT here).

-- ── 0.2  columns ─────────────────────────────────────────────────────────────
alter table public.bhakti_user_stats
  add column if not exists user_id          uuid references auth.users(id) on delete set null,
  add column if not exists is_guest         boolean not null default true,
  add column if not exists upgraded_at      timestamptz,
  add column if not exists last_daily_claim date,
  add column if not exists tts_total        integer not null default 0,
  add column if not exists tts_today        integer not null default 0,
  add column if not exists tts_day          date,
  add column if not exists astro_total      integer not null default 0,
  add column if not exists astro_today      integer not null default 0,
  add column if not exists astro_day        date;

-- One row per user; also what on conflict (user_id) relies on below.
create unique index if not exists bhakti_user_stats_user_id_key
  on public.bhakti_user_stats (user_id);

-- ── 0.3  drop BOTH wide-open policies, narrow the privilege surface ───────────
drop policy if exists allow_anon_all on public.bhakti_user_stats;
drop policy if exists allow_auth_all on public.bhakti_user_stats;

alter table public.bhakti_user_stats enable row level security;

-- InsForge grants every runtime role full DML by default (incl. DELETE, TRUNCATE).
-- Revoke everything, then grant back exactly what a phone may do.
revoke all on public.bhakti_user_stats from anon;
revoke all on public.bhakti_user_stats from authenticated;

grant select on public.bhakti_user_stats to authenticated;
-- Clients may edit only their own gamification fields. Identity, the guest flag,
-- streak, the daily claim and the quota counters are server-owned (RPCs below).
grant update (user_name, punya_points, jaap_total, favorites, language, ads_removed, updated_at)
  on public.bhakti_user_stats to authenticated;
-- No client INSERT: rows are created by ensure_my_stats_row() so is_guest can
-- never be chosen from the phone. No DELETE / TRUNCATE for anyone but admin.

create policy "own row: select" on public.bhakti_user_stats
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "own row: update" on public.bhakti_user_stats
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- ── 0.6  server-owned RPCs ───────────────────────────────────────────────────

-- Creates the caller's row (guest by default). Idempotent. Phase 1B calls this
-- right after guest sign-up; the other RPCs call it defensively.
create or replace function public.ensure_my_stats_row()
returns table (is_guest boolean, streak integer, punya_points integer)
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  insert into public.bhakti_user_stats (user_id, user_name)
  values (uid, 'Bhakt')
  on conflict (user_id) do nothing;
  return query
    select s.is_guest, s.streak, s.punya_points
    from public.bhakti_user_stats s
    where s.user_id = uid;
end;
$$;

-- Aaj ka Prasad. India-time day; idempotent per day; streak = consecutive claim
-- days. Guest +5. Signed-in +15, +30 from day 7. The phone's own streak logic
-- retires — this column is now the truth.
create or replace function public.claim_daily_reward()
returns table (
  granted            integer,
  streak             integer,
  tier               text,
  tomorrow_would_get integer,
  signed_in_would_get integer
)
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  uid        uuid := (select auth.uid());
  today      date := (now() at time zone 'Asia/Kolkata')::date;
  r          public.bhakti_user_stats%rowtype;
  new_streak integer;
  base       integer;
  amount     integer;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  insert into public.bhakti_user_stats (user_id, user_name)
  values (uid, 'Bhakt') on conflict (user_id) do nothing;

  select * into r from public.bhakti_user_stats where user_id = uid for update;

  -- Already claimed today: nothing granted, but tell the card what tomorrow holds.
  if r.last_daily_claim = today then
    return query select
      0,
      coalesce(r.streak, 0),
      case when r.is_guest then 'guest' else 'member' end,
      case when r.is_guest then 5 when coalesce(r.streak, 0) + 1 >= 7 then 30 else 15 end,
      case when coalesce(r.streak, 0) >= 7 then 30 else 15 end;
    return;
  end if;

  new_streak := case when r.last_daily_claim = today - 1 then coalesce(r.streak, 0) + 1 else 1 end;
  base       := case when r.is_guest then 5 else 15 end;
  amount     := case when (not r.is_guest) and new_streak >= 7 then base * 2 else base end;

  update public.bhakti_user_stats
     set punya_points     = coalesce(punya_points, 0) + amount,
         streak           = new_streak,
         last_daily_claim = today,
         updated_at       = now()
   where user_id = uid;

  return query select
    amount,
    new_streak,
    case when r.is_guest then 'guest' else 'member' end,
    case when r.is_guest then 5 when new_streak + 1 >= 7 then 30 else 15 end,
    case when new_streak >= 7 then 30 else 15 end;
end;
$$;

-- Quota guard for the paid edge functions. kind ∈ ('tts','astro').
-- Guest: lifetime cap (3). Member: daily cap in India time (tts 20, astro 10).
-- Atomic (row lock), server-owned, and the counters are not client-updatable.
create or replace function public.consume_quota(p_kind text)
returns table (allowed boolean, remaining integer, is_guest boolean)
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  uid        uuid := (select auth.uid());
  today      date := (now() at time zone 'Asia/Kolkata')::date;
  r          public.bhakti_user_stats%rowtype;
  guest_cap  integer := 3;
  member_cap integer;
  used_today integer;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  if p_kind not in ('tts', 'astro') then
    raise exception 'unknown quota kind %', p_kind;
  end if;

  insert into public.bhakti_user_stats (user_id, user_name)
  values (uid, 'Bhakt') on conflict (user_id) do nothing;

  select * into r from public.bhakti_user_stats where user_id = uid for update;

  member_cap := case p_kind when 'tts' then 20 else 10 end;

  if r.is_guest then
    if (case p_kind when 'tts' then r.tts_total else r.astro_total end) >= guest_cap then
      return query select false, 0, true;
      return;
    end if;
    if p_kind = 'tts' then
      update public.bhakti_user_stats set tts_total = tts_total + 1 where user_id = uid;
      return query select true, guest_cap - (r.tts_total + 1), true;
    else
      update public.bhakti_user_stats set astro_total = astro_total + 1 where user_id = uid;
      return query select true, guest_cap - (r.astro_total + 1), true;
    end if;
    return;
  end if;

  if p_kind = 'tts' then
    used_today := case when r.tts_day = today then r.tts_today else 0 end;
    if used_today >= member_cap then return query select false, 0, false; return; end if;
    update public.bhakti_user_stats
       set tts_today = used_today + 1, tts_day = today, tts_total = tts_total + 1
     where user_id = uid;
  else
    used_today := case when r.astro_day = today then r.astro_today else 0 end;
    if used_today >= member_cap then return query select false, 0, false; return; end if;
    update public.bhakti_user_stats
       set astro_today = used_today + 1, astro_day = today, astro_total = astro_total + 1
     where user_id = uid;
  end if;
  return query select true, member_cap - (used_today + 1), false;
end;
$$;

-- Give the unit back when the downstream call failed. Never charge for silence.
create or replace function public.release_quota(p_kind text)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null then return; end if;
  if p_kind = 'tts' then
    update public.bhakti_user_stats
       set tts_total = greatest(tts_total - 1, 0),
           tts_today = greatest(tts_today - 1, 0)
     where user_id = uid;
  elsif p_kind = 'astro' then
    update public.bhakti_user_stats
       set astro_total = greatest(astro_total - 1, 0),
           astro_today = greatest(astro_today - 1, 0)
     where user_id = uid;
  end if;
end;
$$;

-- Signed-in callers only. Postgres grants EXECUTE to PUBLIC by default — take it back.
revoke execute on function public.ensure_my_stats_row()  from public, anon;
revoke execute on function public.claim_daily_reward()   from public, anon;
revoke execute on function public.consume_quota(text)    from public, anon;
revoke execute on function public.release_quota(text)    from public, anon;
grant  execute on function public.ensure_my_stats_row()  to authenticated;
grant  execute on function public.claim_daily_reward()   to authenticated;
grant  execute on function public.consume_quota(text)    to authenticated;
grant  execute on function public.release_quota(text)    to authenticated;

-- Pulled forward from Phase 2.1 (finding B10): these SECURITY DEFINER RPCs take
-- an arbitrary p_user_id and were EXECUTE-able by every client — free self-credit.
-- Server-only from here; Phase 2's verify-payment is the only legitimate caller.
revoke execute on function public.credit_purchased_tokens(uuid, integer, numeric, text, text, text, text, text)
  from public, anon, authenticated;
revoke execute on function public.spend_chat_token(uuid, integer)
  from public, anon, authenticated;
