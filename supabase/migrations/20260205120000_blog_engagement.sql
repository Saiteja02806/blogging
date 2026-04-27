-- Blog likes + comments for `PostActions` (src/components/PostActions.tsx)
-- Apply: Supabase Dashboard → SQL Editor → paste → Run
-- Or: `supabase link` then `supabase db push` (with Supabase CLI)

create table if not exists public.likes (
  post_slug text primary key,
  count integer not null default 0 check (count >= 0),
  updated_at timestamptz not null default now()
);

create index if not exists likes_updated_at_idx on public.likes (updated_at desc);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null,
  name text not null,
  text text not null,
  created_at timestamptz not null default now(),
  constraint comments_name_nonempty check (char_length(trim(name)) > 0),
  constraint comments_text_nonempty check (char_length(trim(text)) > 0)
);

create index if not exists comments_post_slug_idx on public.comments (post_slug);
create index if not exists comments_created_at_idx on public.comments (created_at desc);

alter table public.likes enable row level security;
alter table public.comments enable row level security;

drop policy if exists "likes_select_public" on public.likes;
create policy "likes_select_public"
  on public.likes for select
  using (true);

drop policy if exists "likes_insert_public" on public.likes;
create policy "likes_insert_public"
  on public.likes for insert
  with check (true);

drop policy if exists "likes_update_public" on public.likes;
create policy "likes_update_public"
  on public.likes for update
  using (true)
  with check (true);

drop policy if exists "comments_select_public" on public.comments;
create policy "comments_select_public"
  on public.comments for select
  using (true);

drop policy if exists "comments_insert_public" on public.comments;
create policy "comments_insert_public"
  on public.comments for insert
  with check (true);

grant select, insert, update on table public.likes to anon, authenticated;
grant select, insert on table public.comments to anon, authenticated;
