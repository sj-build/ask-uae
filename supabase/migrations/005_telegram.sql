-- ============================================================================
-- Telegram Bot: Session Management
-- ============================================================================

-- telegram_sessions: 대화 세션 저장
CREATE TABLE IF NOT EXISTS public.telegram_sessions (
  chat_id TEXT PRIMARY KEY,
  user_name TEXT,
  language TEXT DEFAULT 'auto', -- 'ko'|'en'|'auto'
  message_history JSONB NOT NULL DEFAULT '[]'::jsonb, -- 최근 N개 대화
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rate limiting tracking
CREATE TABLE IF NOT EXISTS public.telegram_rate_limits (
  chat_id TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  request_count INT NOT NULL DEFAULT 1,
  PRIMARY KEY (chat_id, window_start)
);

CREATE INDEX IF NOT EXISTS telegram_rate_limits_window_idx
  ON public.telegram_rate_limits(window_start);

-- Auto-cleanup old rate limit entries (older than 1 hour)
-- This can be done via a cron job or Supabase scheduled function

COMMENT ON TABLE telegram_sessions IS 'Telegram chat sessions with conversation history';
COMMENT ON TABLE telegram_rate_limits IS 'Rate limiting for Telegram bot requests';
