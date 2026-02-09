-- ============================================================================
-- Eval Agent: Source Registry, Eval Runs, Eval Issues, Content Snapshots
-- ============================================================================

-- 1) source_registry: 검증 기준 소스 목록
CREATE TABLE IF NOT EXISTS public.source_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT, -- 'official' | 'intl_org' | 'regulator' | 'reputable_media'
  base_url TEXT NOT NULL,
  trust_level INT NOT NULL DEFAULT 3, -- 1(low)~5(high)
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS source_registry_active_idx ON public.source_registry(is_active);

-- 2) eval_runs: 평가 실행 기록
CREATE TABLE IF NOT EXISTS public.eval_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_type TEXT NOT NULL, -- 'daily_rules' | 'weekly_factcheck' | 'on_demand'
  scope JSONB NOT NULL DEFAULT '{}'::jsonb, -- pages/docs 범위, since 등
  model TEXT, -- LLM 모델명(anthropic)
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running', -- running|done|failed
  summary JSONB NOT NULL DEFAULT '{}'::jsonb, -- counts by label/severity
  logs TEXT
);

CREATE INDEX IF NOT EXISTS eval_runs_started_at_idx ON public.eval_runs(started_at);

-- 3) eval_issues: 주장 단위 이슈
CREATE TABLE IF NOT EXISTS public.eval_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES public.eval_runs(id) ON DELETE SET NULL,
  object_type TEXT NOT NULL, -- 'page'|'document'|'insight'|'news'
  object_id TEXT, -- 페이지는 route string, DB는 uuid string
  object_locator TEXT, -- 예: 'comparison.table.rows.gdp'
  claim TEXT NOT NULL, -- 검증 대상 주장
  claim_type TEXT, -- 'numeric'|'definition'|'policy'|'timeline'|'comparison'
  status TEXT NOT NULL DEFAULT 'open', -- open|triaged|fixed|dismissed
  verdict TEXT NOT NULL, -- supported|needs_update|contradicted|unverifiable
  severity TEXT NOT NULL DEFAULT 'med', -- high|med|low
  confidence NUMERIC NOT NULL DEFAULT 0.6, -- 0~1
  current_text TEXT, -- 현재 사이트/DB에 적힌 문장/수치
  suggested_fix TEXT, -- 사람이 읽는 수정 제안
  suggested_patch JSONB, -- 머신 적용 가능한 패치
  "references" JSONB NOT NULL DEFAULT '[]'::jsonb, -- 근거 URL/snippet
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS eval_issues_run_id_idx ON public.eval_issues(run_id);
CREATE INDEX IF NOT EXISTS eval_issues_status_idx ON public.eval_issues(status);
CREATE INDEX IF NOT EXISTS eval_issues_severity_idx ON public.eval_issues(severity);

-- 4) content_snapshots: 사이트 스냅샷 저장
CREATE TABLE IF NOT EXISTS public.content_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL, -- 'site'|'rag'
  scope TEXT NOT NULL, -- 'pages'|'documents'|'insights'
  payload JSONB NOT NULL,
  content_hash TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Initial Source Registry data (trusted sources)
INSERT INTO public.source_registry (name, category, base_url, trust_level, notes) VALUES
  ('UAE Government Portal', 'official', 'https://u.ae', 5, 'Official UAE government website'),
  ('Abu Dhabi Government', 'official', 'https://www.abudhabi.gov.ae', 5, 'Abu Dhabi emirate government'),
  ('Dubai Government', 'official', 'https://www.dubai.ae', 5, 'Dubai emirate government'),
  ('UAE Central Bank', 'regulator', 'https://www.centralbank.ae', 5, 'Central Bank of UAE'),
  ('ADGM', 'regulator', 'https://www.adgm.com', 5, 'Abu Dhabi Global Market'),
  ('DIFC', 'regulator', 'https://www.difc.ae', 5, 'Dubai International Financial Centre'),
  ('VARA', 'regulator', 'https://www.vara.ae', 5, 'Virtual Assets Regulatory Authority'),
  ('IMF', 'intl_org', 'https://www.imf.org', 4, 'International Monetary Fund'),
  ('World Bank', 'intl_org', 'https://www.worldbank.org', 4, 'World Bank Group'),
  ('Reuters', 'reputable_media', 'https://www.reuters.com', 3, 'Reuters news agency'),
  ('Bloomberg', 'reputable_media', 'https://www.bloomberg.com', 3, 'Bloomberg'),
  ('Financial Times', 'reputable_media', 'https://www.ft.com', 3, 'Financial Times'),
  ('The National', 'reputable_media', 'https://www.thenationalnews.com', 3, 'UAE English newspaper'),
  ('WAM', 'official', 'https://www.wam.ae', 5, 'Emirates News Agency'),
  ('MOHRE', 'official', 'https://www.mohre.gov.ae', 5, 'Ministry of Human Resources'),
  ('MOFAIC', 'official', 'https://www.mofaic.gov.ae', 5, 'Ministry of Foreign Affairs')
ON CONFLICT DO NOTHING;

COMMENT ON TABLE source_registry IS 'Trusted sources for fact-checking and verification';
COMMENT ON TABLE eval_runs IS 'Evaluation run history and status';
COMMENT ON TABLE eval_issues IS 'Individual claims and their verification status';
COMMENT ON TABLE content_snapshots IS 'Snapshots of site/RAG content for tracking changes';
