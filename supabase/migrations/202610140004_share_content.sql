-- Public catalog references only; private form values and arbitrary hashes are forbidden.
alter table public.share_events add column if not exists content_id text;
alter table public.share_events add constraint share_events_content_id_check check (
  content_id is null or (
    path ~ '^(/(en|ar|fr|de))?/names-of-allah$'
    and content_id ~ '^name-([1-9]|[1-9][0-9])$'
  )
);
