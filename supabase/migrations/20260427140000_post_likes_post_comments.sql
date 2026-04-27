-- Per-device likes (unique post + user_key) + comments for REST API using service role on server.

create table if not exists public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id text not null,
  user_key text not null,
  created_at timestamptz not null default now(),
  unique (post_id, user_key)
);

create index if not exists post_likes_post_id_idx on public.post_likes (post_id);

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id text not null,
  user_key text,
  author_name text,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists post_comments_post_id_idx on public.post_comments (post_id);
