-- =============================================================================
-- Row Level Security
-- Public (anon + authenticated non-admin): SELECT published content only.
-- Admin (profiles.role = 'admin'): full CRUD.
-- contact_messages: public INSERT only; admin SELECT/UPDATE/DELETE.
-- =============================================================================

-- ---------- profiles -------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "profiles: users read own profile" on public.profiles;
create policy "profiles: users read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "profiles: users update own profile" on public.profiles;
create policy "profiles: users update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = 'admin');

-- ---------- projects -------------------------------------------------------
alter table public.projects enable row level security;

drop policy if exists "projects: public read published" on public.projects;
create policy "projects: public read published"
  on public.projects for select
  to anon, authenticated
  using (published = true or public.is_admin());

drop policy if exists "projects: admin insert" on public.projects;
create policy "projects: admin insert"
  on public.projects for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "projects: admin update" on public.projects;
create policy "projects: admin update"
  on public.projects for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "projects: admin delete" on public.projects;
create policy "projects: admin delete"
  on public.projects for delete
  to authenticated
  using (public.is_admin());

-- ---------- project_images -------------------------------------------------
alter table public.project_images enable row level security;

drop policy if exists "project_images: public read for published projects" on public.project_images;
create policy "project_images: public read for published projects"
  on public.project_images for select
  to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.projects p
      where p.id = project_images.project_id and p.published = true
    )
  );

drop policy if exists "project_images: admin write" on public.project_images;
create policy "project_images: admin write"
  on public.project_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- technologies ---------------------------------------------------
alter table public.technologies enable row level security;

drop policy if exists "technologies: public read" on public.technologies;
create policy "technologies: public read"
  on public.technologies for select
  to anon, authenticated
  using (true);

drop policy if exists "technologies: admin write" on public.technologies;
create policy "technologies: admin write"
  on public.technologies for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- project_technologies -------------------------------------------
alter table public.project_technologies enable row level security;

drop policy if exists "project_technologies: public read for published projects" on public.project_technologies;
create policy "project_technologies: public read for published projects"
  on public.project_technologies for select
  to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.projects p
      where p.id = project_technologies.project_id and p.published = true
    )
  );

drop policy if exists "project_technologies: admin write" on public.project_technologies;
create policy "project_technologies: admin write"
  on public.project_technologies for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- skills ---------------------------------------------------------
alter table public.skills enable row level security;

drop policy if exists "skills: public read published" on public.skills;
create policy "skills: public read published"
  on public.skills for select
  to anon, authenticated
  using (published = true or public.is_admin());

drop policy if exists "skills: admin write" on public.skills;
create policy "skills: admin write"
  on public.skills for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- experience -----------------------------------------------------
alter table public.experience enable row level security;

drop policy if exists "experience: public read published" on public.experience;
create policy "experience: public read published"
  on public.experience for select
  to anon, authenticated
  using (published = true or public.is_admin());

drop policy if exists "experience: admin write" on public.experience;
create policy "experience: admin write"
  on public.experience for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- services -------------------------------------------------------
alter table public.services enable row level security;

drop policy if exists "services: public read published" on public.services;
create policy "services: public read published"
  on public.services for select
  to anon, authenticated
  using (published = true or public.is_admin());

drop policy if exists "services: admin write" on public.services;
create policy "services: admin write"
  on public.services for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- testimonials ---------------------------------------------------
alter table public.testimonials enable row level security;

drop policy if exists "testimonials: public read published" on public.testimonials;
create policy "testimonials: public read published"
  on public.testimonials for select
  to anon, authenticated
  using (published = true or public.is_admin());

drop policy if exists "testimonials: admin write" on public.testimonials;
create policy "testimonials: admin write"
  on public.testimonials for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- blog_posts -----------------------------------------------------
alter table public.blog_posts enable row level security;

drop policy if exists "blog_posts: public read published" on public.blog_posts;
create policy "blog_posts: public read published"
  on public.blog_posts for select
  to anon, authenticated
  using (published = true or public.is_admin());

drop policy if exists "blog_posts: admin write" on public.blog_posts;
create policy "blog_posts: admin write"
  on public.blog_posts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- contact_messages -----------------------------------------------
alter table public.contact_messages enable row level security;

-- Anyone may submit a message. `read` must start as false.
drop policy if exists "contact_messages: public insert" on public.contact_messages;
create policy "contact_messages: public insert"
  on public.contact_messages for insert
  to anon, authenticated
  with check (read = false);

drop policy if exists "contact_messages: admin select" on public.contact_messages;
create policy "contact_messages: admin select"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

drop policy if exists "contact_messages: admin update" on public.contact_messages;
create policy "contact_messages: admin update"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "contact_messages: admin delete" on public.contact_messages;
create policy "contact_messages: admin delete"
  on public.contact_messages for delete
  to authenticated
  using (public.is_admin());

-- ---------- site_settings --------------------------------------------------
alter table public.site_settings enable row level security;

drop policy if exists "site_settings: public read" on public.site_settings;
create policy "site_settings: public read"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "site_settings: admin write" on public.site_settings;
create policy "site_settings: admin write"
  on public.site_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
