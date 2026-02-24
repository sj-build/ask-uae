-- =============================================================================
-- Migration: Telegram Persistence Layer
-- Purpose: Add telegram_messages, telegram_saved_clips tables
--          + insights.source_type column for telegram insights
-- =============================================================================

-- 1) telegram_messages: permanent conversation log
CREATE TABLE IF NOT EXISTS public.telegram_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id TEXT NOT NULL,
  message_id INTEGER,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  has_url BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tg_msgs_chat
  ON public.telegram_messages(chat_id, created_at DESC);

-- RLS
ALTER TABLE public.telegram_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='telegram_messages' AND policyname='tg_msgs_service_full'
  ) THEN
    CREATE POLICY tg_msgs_service_full ON public.telegram_messages
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- 2) telegram_saved_clips: URL clips with AI classification
CREATE TABLE IF NOT EXISTS public.telegram_saved_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  original_text TEXT,
  thumbnail_url TEXT,
  source_type TEXT NOT NULL DEFAULT 'web',
  author_handle TEXT,
  ai_summary TEXT,
  sectors TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  importance INTEGER DEFAULT 2 CHECK (importance BETWEEN 1 AND 5),
  investment_implication TEXT,
  user_note TEXT,
  saved_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tg_clips_saved
  ON public.telegram_saved_clips(saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_tg_clips_sectors
  ON public.telegram_saved_clips USING GIN(sectors);

-- RLS
ALTER TABLE public.telegram_saved_clips ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='telegram_saved_clips' AND policyname='tg_clips_service_full'
  ) THEN
    CREATE POLICY tg_clips_service_full ON public.telegram_saved_clips
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- 3) Add source_type to insights table (existing: synthesis from cron, new: telegram)
ALTER TABLE public.insights ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'synthesis';
