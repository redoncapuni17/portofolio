-- =============================================================================
-- Storage buckets + policies
-- Public read for everyone; write access restricted to admins.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('profile',      'profile',      true, 5242880,  array['image/png','image/jpeg','image/webp','image/avif','image/gif']),
  ('projects',     'projects',     true, 10485760, array['image/png','image/jpeg','image/webp','image/avif','image/gif']),
  ('blog',         'blog',         true, 10485760, array['image/png','image/jpeg','image/webp','image/avif','image/gif']),
  ('testimonials', 'testimonials', true, 5242880,  array['image/png','image/jpeg','image/webp','image/avif','image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- storage.objects already has RLS enabled by Supabase.

drop policy if exists "portfolio buckets: public read" on storage.objects;
create policy "portfolio buckets: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('profile', 'projects', 'blog', 'testimonials'));

drop policy if exists "portfolio buckets: admin insert" on storage.objects;
create policy "portfolio buckets: admin insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('profile', 'projects', 'blog', 'testimonials')
    and public.is_admin()
  );

drop policy if exists "portfolio buckets: admin update" on storage.objects;
create policy "portfolio buckets: admin update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('profile', 'projects', 'blog', 'testimonials')
    and public.is_admin()
  )
  with check (
    bucket_id in ('profile', 'projects', 'blog', 'testimonials')
    and public.is_admin()
  );

drop policy if exists "portfolio buckets: admin delete" on storage.objects;
create policy "portfolio buckets: admin delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('profile', 'projects', 'blog', 'testimonials')
    and public.is_admin()
  );
