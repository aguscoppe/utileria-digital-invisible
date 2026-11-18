-- Run once in the Supabase SQL Editor for this project.
create table if not exists public.project_state (
  id text primary key,
  data jsonb not null default '{"settings":{},"assets":{}}'::jsonb
);

insert into public.project_state (id, data)
values ('main', '{"settings":{},"assets":{}}'::jsonb)
on conflict (id) do nothing;

alter table public.project_state enable row level security;
grant select on public.project_state to anon, authenticated;
grant update on public.project_state to anon, authenticated;

drop policy if exists "Project state is readable" on public.project_state;
create policy "Project state is readable"
  on public.project_state for select to anon, authenticated using (true);

drop policy if exists "Signed in users can update project state" on public.project_state;
drop policy if exists "Anyone can update project state" on public.project_state;
create policy "Anyone can update project state"
  on public.project_state for update to anon, authenticated using (true) with check (true);

create table if not exists public.project_assets (
  id text primary key,
  object_path text not null unique,
  extension text not null,
  size bigint not null check (size >= 0 and size <= 104857600),
  updated_at timestamptz not null default now(),
  check (
    (id = 'mail-video' and extension = 'mp4' and object_path = 'mail-video.mp4') or
    (id in (
      'julian-profile-instagram', 'julian-profile-whatsapp', 'julian-post-profile',
      'julian-post-dog', 'julian-post-eiffel', 'party-halloween', 'agustina-julian-party',
      'martina-wallpaper-desktop', 'martina-wallpaper-mobile', 'martina-mirror-selfie',
      'crown-photo', 'emily-costume'
    ) and extension in ('jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'heic', 'heif')
      and object_path = id || '.' || extension)
  )
);

alter table public.project_assets enable row level security;
grant select, insert, update, delete on public.project_assets to anon, authenticated;

drop policy if exists "Project assets are readable" on public.project_assets;
create policy "Project assets are readable"
  on public.project_assets for select to anon, authenticated using (true);

drop policy if exists "Anyone can register allowed project assets" on public.project_assets;
create policy "Anyone can register allowed project assets"
  on public.project_assets for insert to anon, authenticated
  with check (
    (id = 'mail-video' and extension = 'mp4' and object_path = 'mail-video.mp4') or
    (id in (
      'julian-profile-instagram', 'julian-profile-whatsapp', 'julian-post-profile',
      'julian-post-dog', 'julian-post-eiffel', 'party-halloween', 'agustina-julian-party',
      'martina-wallpaper-desktop', 'martina-wallpaper-mobile', 'martina-mirror-selfie',
      'crown-photo', 'emily-costume'
    ) and extension in ('jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'heic', 'heif')
      and object_path = id || '.' || extension)
  );

drop policy if exists "Anyone can update allowed project assets" on public.project_assets;
create policy "Anyone can update allowed project assets"
  on public.project_assets for update to anon, authenticated
  using (true)
  with check (
    (id = 'mail-video' and extension = 'mp4' and object_path = 'mail-video.mp4') or
    (id in (
      'julian-profile-instagram', 'julian-profile-whatsapp', 'julian-post-profile',
      'julian-post-dog', 'julian-post-eiffel', 'party-halloween', 'agustina-julian-party',
      'martina-wallpaper-desktop', 'martina-wallpaper-mobile', 'martina-mirror-selfie',
      'crown-photo', 'emily-costume'
    ) and extension in ('jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'heic', 'heif')
      and object_path = id || '.' || extension)
  );

drop policy if exists "Anyone can remove allowed project assets" on public.project_assets;
create policy "Anyone can remove allowed project assets"
  on public.project_assets for delete to anon, authenticated using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-assets',
  'project-assets',
  true,
  104857600,
  array['image/jpeg','image/png','image/webp','image/avif','image/gif','image/bmp','image/svg+xml','image/heic','image/heif','video/mp4']
)
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Signed in users can upload project assets" on storage.objects;
drop policy if exists "Anyone can upload managed project assets" on storage.objects;
create policy "Anyone can upload managed project assets"
  on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'project-assets' and
    (
      name = 'mail-video.mp4' or
      name ~ '^(julian-profile-instagram|julian-profile-whatsapp|julian-post-profile|julian-post-dog|julian-post-eiffel|party-halloween|agustina-julian-party|martina-wallpaper-desktop|martina-wallpaper-mobile|martina-mirror-selfie|crown-photo|emily-costume)[.](jpg|jpeg|png|webp|avif|gif|bmp|heic|heif)$'
    )
  );

drop policy if exists "Signed in users can read project asset metadata" on storage.objects;
drop policy if exists "Anyone can read managed project asset metadata" on storage.objects;
create policy "Anyone can read managed project asset metadata"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'project-assets' and
    (
      name = 'mail-video.mp4' or
      name ~ '^(julian-profile-instagram|julian-profile-whatsapp|julian-post-profile|julian-post-dog|julian-post-eiffel|party-halloween|agustina-julian-party|martina-wallpaper-desktop|martina-wallpaper-mobile|martina-mirror-selfie|crown-photo|emily-costume)[.](jpg|jpeg|png|webp|avif|gif|bmp|heic|heif)$'
    )
  );

drop policy if exists "Signed in users can update project assets" on storage.objects;
drop policy if exists "Anyone can update managed project assets" on storage.objects;
create policy "Anyone can update managed project assets"
  on storage.objects for update to anon, authenticated
  using (
    bucket_id = 'project-assets' and
    (
      name = 'mail-video.mp4' or
      name ~ '^(julian-profile-instagram|julian-profile-whatsapp|julian-post-profile|julian-post-dog|julian-post-eiffel|party-halloween|agustina-julian-party|martina-wallpaper-desktop|martina-wallpaper-mobile|martina-mirror-selfie|crown-photo|emily-costume)[.](jpg|jpeg|png|webp|avif|gif|bmp|heic|heif)$'
    )
  )
  with check (
    bucket_id = 'project-assets' and
    (
      name = 'mail-video.mp4' or
      name ~ '^(julian-profile-instagram|julian-profile-whatsapp|julian-post-profile|julian-post-dog|julian-post-eiffel|party-halloween|agustina-julian-party|martina-wallpaper-desktop|martina-wallpaper-mobile|martina-mirror-selfie|crown-photo|emily-costume)[.](jpg|jpeg|png|webp|avif|gif|bmp|heic|heif)$'
    )
  );

drop policy if exists "Signed in users can delete project assets" on storage.objects;
drop policy if exists "Anyone can delete managed project assets" on storage.objects;
create policy "Anyone can delete managed project assets"
  on storage.objects for delete to anon, authenticated
  using (
    bucket_id = 'project-assets' and
    (
      name = 'mail-video.mp4' or
      name ~ '^(julian-profile-instagram|julian-profile-whatsapp|julian-post-profile|julian-post-dog|julian-post-eiffel|party-halloween|agustina-julian-party|martina-wallpaper-desktop|martina-wallpaper-mobile|martina-mirror-selfie|crown-photo|emily-costume)[.](jpg|jpeg|png|webp|avif|gif|bmp|heic|heif)$'
    )
  );
