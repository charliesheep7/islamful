-- Email updates are opt-in contacts, not authenticated accounts.
create table if not exists public.update_subscribers (
  email text primary key check (length(email) <= 254),
  locale text not null check (locale in ('en','ar','fr','de')),
  source_path text not null,
  consent_version text not null default 'updates-v1',
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create table if not exists public.share_events (
  id uuid primary key,
  created_at timestamptz not null default now(),
  event text not null check (event in ('share_open','share_click','share_copy','share_native_complete','share_native_cancel','share_error')),
  channel text not null check (channel in ('menu','copy','native','WhatsApp','Facebook','X','Telegram','Reddit')),
  locale text not null check (locale in ('en','ar','fr','de')),
  path text not null check (length(path) <= 500)
);
create index if not exists share_events_created_at on public.share_events(created_at);
create table if not exists public.engagement_limits (
  bucket text primary key,
  starts_at timestamptz not null,
  hits integer not null
);
alter table public.update_subscribers enable row level security;
alter table public.share_events enable row level security;
alter table public.engagement_limits enable row level security;
revoke all on public.update_subscribers, public.share_events, public.engagement_limits from anon, authenticated;
grant all on public.update_subscribers, public.share_events, public.engagement_limits to service_role;
-- Only the server can use this atomic, bounded one-minute limiter.
create or replace function public.allow_engagement(p_bucket text, p_limit integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare count_now integer;
begin
  delete from public.engagement_limits where starts_at < now() - interval '1 day';
  insert into public.engagement_limits(bucket, starts_at, hits) values (p_bucket, now(), 1)
  on conflict (bucket) do update set
    hits = case when engagement_limits.starts_at < now() - interval '1 minute' then 1 else engagement_limits.hits + 1 end,
    starts_at = case when engagement_limits.starts_at < now() - interval '1 minute' then now() else engagement_limits.starts_at end
  returning hits into count_now;
  return count_now <= p_limit;
end;
$$;
revoke all on function public.allow_engagement(text, integer) from public, anon, authenticated;
grant execute on function public.allow_engagement(text, integer) to service_role;
