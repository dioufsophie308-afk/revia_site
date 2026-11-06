-- Revia – schéma Supabase : liste d'attente
-- À exécuter une fois dans Supabase → SQL Editor.

create table if not exists public.waitlist (
  id             uuid primary key default gen_random_uuid(),
  email          text not null,
  role           text not null default 'client' check (role in ('client', 'vendeur')),
  origin_country text check (origin_country is null or char_length(origin_country) <= 80),
  consent        boolean not null default false,
  source         text not null default 'home' check (char_length(source) <= 40),
  created_at     timestamptz not null default now(),
  constraint waitlist_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'),
  constraint waitlist_email_len check (char_length(email) <= 254),
  constraint waitlist_consent_required check (consent = true)
);

-- Un e-mail ne peut s'inscrire qu'une fois (insensible à la casse).
create unique index if not exists waitlist_email_unique on public.waitlist (lower(email));

-- Sécurité au niveau des lignes (RLS) : obligatoire, la clé « anon » est publique.
alter table public.waitlist enable row level security;

-- Les visiteurs (rôle anon) peuvent UNIQUEMENT ajouter une inscription.
drop policy if exists "anon peut s'inscrire" on public.waitlist;
create policy "anon peut s'inscrire"
  on public.waitlist for insert
  to anon
  with check (consent = true);

-- Aucune politique select/update/delete pour anon : personne ne peut lire la liste
-- depuis le site. Consultez-la depuis le tableau de bord Supabase (Table Editor).
revoke all on public.waitlist from anon, authenticated;
grant insert on public.waitlist to anon;
