
-- Enable UUID extensions if desired
-- create extension if not exists "uuid-ossp";

-- Users are handled by Supabase Auth. We'll reference auth.uid() in RLS.

-- NOTES
create table if not exists public.notes (
  id bigserial primary key,
  user_id uuid not null,
  title text default 'Main Notes',
  html text default '',
  updated_at timestamp with time zone default now()
);

alter table public.notes enable row level security;
create policy "notes_select_own" on public.notes for select using (auth.uid() = user_id);
create policy "notes_insert_own" on public.notes for insert with check (auth.uid() = user_id);
create policy "notes_update_own" on public.notes for update using (auth.uid() = user_id);
create policy "notes_delete_own" on public.notes for delete using (auth.uid() = user_id);

-- WEB LINKS
create table if not exists public.weblinks (
  id bigserial primary key,
  user_id uuid not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default now()
);

alter table public.weblinks enable row level security;
create policy "weblinks_select_own" on public.weblinks for select using (auth.uid() = user_id);
create policy "weblinks_write_own" on public.weblinks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- AGENT RUNS (Controls log)
create table if not exists public.agent_runs (
  id bigserial primary key,
  user_id uuid not null,
  action text not null,
  status text default 'queued',
  result text,
  created_at timestamp with time zone default now()
);

alter table public.agent_runs enable row level security;
create policy "agent_runs_select_own" on public.agent_runs for select using (auth.uid() = user_id);
create policy "agent_runs_insert_own" on public.agent_runs for insert with check (auth.uid() = user_id);
create policy "agent_runs_update_own" on public.agent_runs for update using (auth.uid() = user_id);

-- FORM SUBMISSIONS
create table if not exists public.form_submissions (
  id bigserial primary key,
  user_id uuid not null,
  form_name text not null,
  payload jsonb not null,
  created_at timestamp with time zone default now()
);

alter table public.form_submissions enable row level security;
create policy "form_submissions_select_own" on public.form_submissions for select using (auth.uid() = user_id);
create policy "form_submissions_insert_own" on public.form_submissions for insert with check (auth.uid() = user_id);

-- Optional: contacts placeholder table (for dashboard counts)
create table if not exists public.contacts (
  id bigserial primary key,
  user_id uuid not null,
  email text,
  name text,
  created_at timestamp with time zone default now()
);
alter table public.contacts enable row level security;
create policy "contacts_select_own" on public.contacts for select using (auth.uid() = user_id);
create policy "contacts_insert_own" on public.contacts for insert with check (auth.uid() = user_id);

