-- Bảng sao lưu tiến độ game; mỗi user 1 dòng, RLS chỉ cho phép truy cập dòng của chính mình
create table if not exists public.saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.saves enable row level security;
create policy "saves_select_own" on public.saves for select to authenticated using ((select auth.uid()) = user_id);
create policy "saves_insert_own" on public.saves for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "saves_update_own" on public.saves for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "saves_delete_own" on public.saves for delete to authenticated using ((select auth.uid()) = user_id);
revoke all on public.saves from anon;
