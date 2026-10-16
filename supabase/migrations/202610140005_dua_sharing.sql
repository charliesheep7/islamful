alter table public.share_events drop constraint share_events_content_id_check;
alter table public.share_events add constraint share_events_content_id_check check (
  content_id is null or (
    path ~ '^(/(en|ar|fr|de))?/names-of-allah$' and content_id ~ '^name-([1-9]|[1-9][0-9])$'
  ) or (
    path ~ '^(/(en|ar|fr|de))?/dua$' and content_id ~ '^dua-([1-9]|[1-6][0-9]|7[0-7])$'
  )
);
