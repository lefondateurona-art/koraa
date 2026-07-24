-- Storage buckets used by Koraa/Orbit/Backoffice (shared Supabase project).
-- Buckets are public-read (thumbnails/avatars shown to all visitors), write
-- restricted to the owning authenticated user via RLS on storage.objects.

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('shop-thumbnails', 'shop-thumbnails', true),
  ('post-thumbnails', 'post-thumbnails', true)
on conflict (id) do nothing;

-- Public read on all three buckets.
create policy "Public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Public read shop-thumbnails"
  on storage.objects for select
  using (bucket_id = 'shop-thumbnails');

create policy "Public read post-thumbnails"
  on storage.objects for select
  using (bucket_id = 'post-thumbnails');

-- Authenticated users can upload/update/delete only inside their own folder,
-- i.e. object path must start with "<uid>/..." (convention to enforce
-- client-side when building the upload path).
create policy "Owner write avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Owner update avatars"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Owner delete avatars"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Owner write shop-thumbnails"
  on storage.objects for insert
  with check (bucket_id = 'shop-thumbnails' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Owner update shop-thumbnails"
  on storage.objects for update
  using (bucket_id = 'shop-thumbnails' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Owner delete shop-thumbnails"
  on storage.objects for delete
  using (bucket_id = 'shop-thumbnails' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Owner write post-thumbnails"
  on storage.objects for insert
  with check (bucket_id = 'post-thumbnails' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Owner update post-thumbnails"
  on storage.objects for update
  using (bucket_id = 'post-thumbnails' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Owner delete post-thumbnails"
  on storage.objects for delete
  using (bucket_id = 'post-thumbnails' and (storage.foldername(name))[1] = auth.uid()::text);
