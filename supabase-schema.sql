-- Supabase schema for ApplyCraft

create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  resume_text text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.job_descriptions (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  job_text text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.cover_letters (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  resume_id bigint references public.resumes (id) on delete set null,
  job_id bigint references public.job_descriptions (id) on delete set null,
  generated_text text not null,
  created_at timestamptz not null default now()
);

alter table public.resumes enable row level security;
alter table public.job_descriptions enable row level security;
alter table public.cover_letters enable row level security;

create policy "Users can manage their own resumes"
  on public.resumes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own job descriptions"
  on public.job_descriptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own cover letters"
  on public.cover_letters
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

