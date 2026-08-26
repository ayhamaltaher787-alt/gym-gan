-- ============================================================================
-- GYM GAN – Supabase Schema
-- ----------------------------------------------------------------------------
-- Legt die Programme-Tabelle + zwei Storage-Buckets an und öffnet öffentlichen
-- Lese-/Schreibzugriff für die Präsentation. Für Produktivbetrieb bitte RLS
-- anpassen (siehe README.md → „Sicherheit & RLS“).
-- ============================================================================

-- 1) Tabelle -----------------------------------------------------------------
create table if not exists public.programs (
  id              uuid          primary key,
  title           text          not null,
  description     text          not null default '',
  author          text          not null,
  category        text          not null check (category in ('spiel','lernen','ki','sonstiges')),
  type            text          not null check (type in ('scratch','web','game','other')),
  file_name       text,
  file_size       bigint,
  file_mime       text,
  file_path       text,
  thumbnail_path  text,
  created_at      timestamptz   not null default now()
);

create index if not exists programs_created_at_idx
  on public.programs (created_at desc);

-- 2) Storage-Buckets ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('program-files', 'program-files', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('program-thumbnails', 'program-thumbnails', true)
on conflict (id) do nothing;

-- 3) Row-Level-Security ------------------------------------------------------
--    Für die Projektwoche: öffentlich lesen und schreiben (kein Login).
alter table public.programs enable row level security;

drop policy if exists "public read"      on public.programs;
drop policy if exists "public insert"    on public.programs;
drop policy if exists "public delete"    on public.programs;

create policy "public read"   on public.programs for select              using (true);
create policy "public insert" on public.programs for insert with check   (true);
create policy "public delete" on public.programs for delete              using (true);

-- 4) Storage-Policies --------------------------------------------------------
--    Ebenfalls öffentlich lesen und schreiben.
drop policy if exists "gymgan read files"    on storage.objects;
drop policy if exists "gymgan write files"   on storage.objects;
drop policy if exists "gymgan delete files"  on storage.objects;

create policy "gymgan read files"
  on storage.objects for select
  using (bucket_id in ('program-files','program-thumbnails'));

create policy "gymgan write files"
  on storage.objects for insert
  with check (bucket_id in ('program-files','program-thumbnails'));

create policy "gymgan delete files"
  on storage.objects for delete
  using (bucket_id in ('program-files','program-thumbnails'));
