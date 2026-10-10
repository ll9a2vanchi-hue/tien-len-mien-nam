-- Bảng sao lưu tiến độ game; mỗi user 1 dòng, RLS chỉ cho phép truy cập dòng của chính mình
create table if not exists public.tlmn_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.tlmn_saves enable row level security;
create policy "tlmn_saves_select_own" on public.tlmn_saves for select to authenticated using ((select auth.uid()) = user_id);
create policy "tlmn_saves_insert_own" on public.tlmn_saves for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "tlmn_saves_update_own" on public.tlmn_saves for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on public.tlmn_saves from anon;
revoke all on public.tlmn_saves from authenticated;
grant select, insert, update on public.tlmn_saves to authenticated;
