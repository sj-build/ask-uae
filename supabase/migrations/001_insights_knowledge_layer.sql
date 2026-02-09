-- =============================================================================
-- Migration: Knowledge Accumulation Layer
-- Purpose: Add insights table and enhance documents for structured knowledge
-- =============================================================================

-- 1) Extend documents table: add source='insight', as_of, last_updated
-- Update source constraint to include 'insight'
ALTER TABLE public.documents
DROP CONSTRAINT IF EXISTS documents_source_check;

ALTER TABLE public.documents
ADD CONSTRAINT documents_source_check
CHECK (source IN ('news', 'dashboard', 'askme', 'research', 'manual', 'insight'));

-- Add missing columns if they don't exist
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS url text;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS as_of date;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS last_updated timestamptz DEFAULT now();

-- Full-text search index (Postgres)
CREATE INDEX IF NOT EXISTS documents_fts_idx
ON public.documents USING gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,'')));

-- 2) Create insights table: structured insight units
CREATE TABLE IF NOT EXISTS public.insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,                  -- e.g., "UAE AI & Data Center"
  sector text,                          -- optional: "AI", "Energy", "Finance"
  claim text NOT NULL,                  -- one sentence assertion
  rationale text NOT NULL,              -- 2-4 sentences explanation
  evidence_ids jsonb NOT NULL DEFAULT '[]'::jsonb,  -- documents/news/askme IDs
  tags text[] DEFAULT '{}',
  confidence numeric NOT NULL DEFAULT 0.6,          -- 0~1
  as_of date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  content_hash text UNIQUE
);

CREATE INDEX IF NOT EXISTS insights_created_at_idx ON public.insights(created_at DESC);
CREATE INDEX IF NOT EXISTS insights_topic_idx ON public.insights(topic);
CREATE INDEX IF NOT EXISTS insights_sector_idx ON public.insights(sector);
CREATE INDEX IF NOT EXISTS insights_tags_idx ON public.insights USING gin (tags);
CREATE INDEX IF NOT EXISTS insights_confidence_idx ON public.insights(confidence DESC);

-- 3) Ensure askme_sessions has sources_used column
ALTER TABLE public.askme_sessions
ADD COLUMN IF NOT EXISTS sources_used jsonb DEFAULT '[]'::jsonb;

-- 4) Enhance news_articles (if not already done)
ALTER TABLE public.news_articles ADD COLUMN IF NOT EXISTS summary_ko text;
ALTER TABLE public.news_articles ADD COLUMN IF NOT EXISTS impact text;
ALTER TABLE public.news_articles ADD COLUMN IF NOT EXISTS as_of date;

-- 5) Enable RLS on insights
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

-- Allow public read for insights (they're derived from public data)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='insights' AND policyname='insights_read_public'
  ) THEN
    CREATE POLICY insights_read_public ON public.insights
      FOR SELECT USING (true);
  END IF;
END $$;

-- Service role full access for insights
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='insights' AND policyname='insights_service_full'
  ) THEN
    CREATE POLICY insights_service_full ON public.insights
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- 6) Function to auto-update updated_at on insights
CREATE OR REPLACE FUNCTION update_insights_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_insights_updated_at ON public.insights;
CREATE TRIGGER set_insights_updated_at
  BEFORE UPDATE ON public.insights
  FOR EACH ROW
  EXECUTE FUNCTION update_insights_updated_at();

-- =============================================================================
-- Verification queries (run manually to confirm):
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'insights';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'documents';
-- =============================================================================
