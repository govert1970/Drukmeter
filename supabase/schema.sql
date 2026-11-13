-- Drukmeter — databaseschema. Uitvoeren in de Supabase SQL-editor (project in regio EU).
-- Kan in hetzelfde project als Nextpedition: alle tabellen hebben het prefix dm_.
-- Alle toegang loopt via de server van de app (service role). RLS staat aan zonder policies,
-- zodat de publieke sleutel niets kan lezen of schrijven.

create extension if not exists pgcrypto;

create table if not exists dm_teams (
  id uuid primary key default gen_random_uuid(),
  naam text not null,
  sessiedatum text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists dm_deelnemers (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references dm_teams(id) on delete cascade,
  naam text not null,
  token text unique not null,
  antwoorden text,          -- 31 cijfers 1–5, in de volgorde van ITEMS
  open_antwoord text not null default '',
  notitie text not null default '',  -- persoonlijke toelichting van de facilitator in het uitgebreide rapport
  ingevuld_op timestamptz,
  created_at timestamptz not null default now()
);

alter table dm_teams enable row level security;
alter table dm_deelnemers enable row level security;

-- Bestaande installatie bijwerken (veilig om opnieuw te draaien):
alter table dm_deelnemers add column if not exists notitie text not null default '';

-- Referentiegroep: antwoorden zonder naam, team of open tekst, alleen met toestemming van de deelnemer.
-- Bewust geen tijdstempel en geen verwijzing naar dm_deelnemers: een rij is niet naar een persoon te herleiden
-- en blijft bestaan als een team wordt verwijderd.
create table if not exists dm_referentie (
  id uuid primary key default gen_random_uuid(),
  versie text not null,     -- versie van de itempool
  maand text not null,      -- jjjj-mm
  antwoorden text not null
);
alter table dm_referentie enable row level security;
alter table dm_deelnemers add column if not exists referentie_gedeeld boolean not null default false;

-- Individueel gebruik: een map met losse personen, zonder teambeeld.
alter table dm_teams add column if not exists individueel boolean not null default false;
