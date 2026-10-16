alter table public.share_events drop constraint if exists share_events_event_check;
alter table public.share_events add constraint share_events_event_check check (event in ('share_open','share_click','share_copy','share_native_complete','share_native_cancel','share_error','share_arrival'));
