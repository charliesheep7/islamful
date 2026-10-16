alter table public.update_subscribers add column if not exists unsubscribe_token uuid not null default gen_random_uuid();
create unique index if not exists update_subscribers_unsubscribe_token on public.update_subscribers(unsubscribe_token);
