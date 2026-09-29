-- =============================================================================
-- Portfolio schema
-- Run in the Supabase SQL editor (or with `supabase db push`).
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------- Enums ----------------------------------------------------------
do $$ begin
  create type public.skill_category as enum ('frontend', 'backend', 'tools');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.experience_type as enum ('work', 'education');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.project_image_type as enum ('screenshot', 'cover', 'other');
exception when duplicate_object then null; end $$;

-- ---------- Helpers --------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- profiles -------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'admin' check (role in ('admin')),
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Automatically create a profile row when a user is created in auth.users.
-- Public sign-up is disabled in the dashboard, so only users you invite exist.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Used by RLS policies. SECURITY DEFINER so it can read profiles regardless
-- of the caller's own row-level permissions.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- projects -------------------------------------------------------
create table if not exists public.projects (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  short_description text not null,
  description       text,
  problem           text,
  solution          text,
  results           text,
  role              text,
  timeline          text,
  project_type      text,
  live_url          text,
  github_url        text,
  cover_image       text,
  key_features      text[] not null default '{}',
  featured          boolean not null default false,
  published         boolean not null default false,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists projects_published_sort_idx
  on public.projects (published, sort_order, created_at desc);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------- project_images -------------------------------------------------
create table if not exists public.project_images (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  image_url   text not null,
  image_type  public.project_image_type not null default 'screenshot',
  caption     text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists project_images_project_idx
  on public.project_images (project_id, sort_order);

-- ---------- technologies ---------------------------------------------------
create table if not exists public.technologies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  icon        text,
  created_at  timestamptz not null default now()
);

-- ---------- project_technologies -------------------------------------------
create table if not exists public.project_technologies (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid not null references public.projects (id) on delete cascade,
  technology_id  uuid not null references public.technologies (id) on delete cascade,
  unique (project_id, technology_id)
);

create index if not exists project_technologies_project_idx
  on public.project_technologies (project_id);

-- ---------- skills ---------------------------------------------------------
create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    public.skill_category not null,
  icon        text,
  description text,
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists skills_set_updated_at on public.skills;
create trigger skills_set_updated_at
  before update on public.skills
  for each row execute function public.set_updated_at();

-- ---------- experience -----------------------------------------------------
create table if not exists public.experience (
  id                uuid primary key default gen_random_uuid(),
  position          text not null,
  company           text not null,
  location          text,
  start_date        date not null,
  end_date          date,
  currently_working boolean not null default false,
  description       text,
  type              public.experience_type not null default 'work',
  sort_order        integer not null default 0,
  published         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  check (end_date is null or end_date >= start_date)
);

drop trigger if exists experience_set_updated_at on public.experience;
create trigger experience_set_updated_at
  before update on public.experience
  for each row execute function public.set_updated_at();

-- ---------- services -------------------------------------------------------
create table if not exists public.services (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text not null,
  icon         text,
  technologies text[] not null default '{}',
  sort_order   integer not null default 0,
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- ---------- testimonials ---------------------------------------------------
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  position    text,
  company     text,
  quote       text not null,
  image_url   text,
  rating      smallint not null default 5 check (rating between 1 and 5),
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------- blog_posts -----------------------------------------------------
create table if not exists public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text not null,
  content      text not null,
  cover_image  text,
  category     text,
  author       text,
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (published, published_at desc);

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ---------- contact_messages -----------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists contact_messages_created_idx
  on public.contact_messages (created_at desc);

-- ---------- site_settings --------------------------------------------------
create table if not exists public.site_settings (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,
  value       text,
  updated_at  timestamptz not null default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();
