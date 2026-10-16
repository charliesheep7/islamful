-- Durable anonymous AI quotas survive edge worker restarts.
create table if not exists public.ai_request_limits (
  bucket text primary key,
  starts_at timestamptz not null,
  hits integer not null
);
alter table public.ai_request_limits enable row level security;
revoke all on public.ai_request_limits from anon, authenticated;
grant all on public.ai_request_limits to service_role;
create or replace function public.allow_ai_request(p_bucket text, p_limit integer, p_seconds integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare count_now integer;
begin
  if p_seconds not between 1 and 86400 or p_limit not between 1 and 1000 then return false; end if;
  delete from public.ai_request_limits where starts_at < now() - interval '2 days';
  insert into public.ai_request_limits(bucket, starts_at, hits) values (p_bucket, now(), 1)
  on conflict (bucket) do update set
    hits = case when ai_request_limits.starts_at < now() - make_interval(secs => p_seconds) then 1 else ai_request_limits.hits + 1 end,
    starts_at = case when ai_request_limits.starts_at < now() - make_interval(secs => p_seconds) then now() else ai_request_limits.starts_at end
  returning hits into count_now;
  return count_now <= p_limit;
end;
$$;
revoke all on function public.allow_ai_request(text, integer, integer) from public, anon, authenticated;
grant execute on function public.allow_ai_request(text, integer, integer) to service_role;
