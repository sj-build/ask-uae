-- Place image candidate/selection pipeline
-- Candidates: multiple options per place for admin review
-- Selected: one confirmed image per place for display

create table if not exists place_image_candidates (
  id bigserial primary key,
  place_slug text not null,
  provider text not null,          -- unsplash | wikimedia | manual
  provider_ref text,               -- unsplash photo id, wikimedia file title, etc
  image_url text not null,
  thumb_url text,
  photographer text,
  photographer_url text,
  license text,                    -- Unsplash License / CC BY etc
  source_url text,                 -- original link (required for attribution)
  score numeric default 0,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_place_image_candidates_slug
  on place_image_candidates(place_slug);

create table if not exists place_image_selected (
  place_slug text primary key,
  image_url text not null,         -- Supabase Storage public URL (mirrored)
  source jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- RLS: public read for both tables
alter table place_image_candidates enable row level security;
alter table place_image_selected enable row level security;

drop policy if exists "public read place_image_candidates" on place_image_candidates;
create policy "public read place_image_candidates"
  on place_image_candidates for select using (true);

drop policy if exists "public read place_image_selected" on place_image_selected;
create policy "public read place_image_selected"
  on place_image_selected for select using (true);
