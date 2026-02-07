-- =============================================================================
-- UAE-PUBLIC-MEMORY Database Schema
-- =============================================================================
-- Project: uae-public-memory (Supabase)
-- Purpose: 공개 시장 정보 저장 (뉴스, 대시보드 콘텐츠, 공개 Q&A)
--
-- ⚠️ NEVER store Hashed internal data here
-- ⚠️ This DB is READ-accessible by public website
--
-- Run this in Supabase SQL Editor to create the tables

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================================================
-- 1. Documents Table - Core storage for all UAE-related content
-- =============================================================================
create table if not exists documents (
  id uuid primary key default uuid_generate_v4(),

  -- Content
  content text not null,
  title text,
  summary text,

  -- Classification
  source text not null check (source in ('news', 'dashboard', 'askme', 'research', 'manual')),
  category text, -- 'politics', 'economy', 'society', 'industry', 'legal', 'korea'
  tags text[] default '{}',

  -- Metadata
  metadata jsonb default '{}',
  -- For news: { publisher, url, publishedAt, imageUrl }
  -- For askme: { question, sessionId }
  -- For dashboard: { page, section }

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- For deduplication
  content_hash text unique
);

-- Index for faster queries
create index if not exists idx_documents_source on documents(source);
create index if not exists idx_documents_category on documents(category);
create index if not exists idx_documents_created_at on documents(created_at desc);
create index if not exists idx_documents_tags on documents using gin(tags);

-- =============================================================================
-- 2. News Articles Table - Dedicated table for news with more structure
-- =============================================================================
create table if not exists news_articles (
  id uuid primary key default uuid_generate_v4(),

  -- Core fields
  title text not null,
  summary text,
  content text,
  url text unique not null,

  -- Source info
  publisher text not null,
  source text not null check (source in ('google', 'naver')),
  language text default 'en' check (language in ('en', 'ko')),

  -- Media
  image_url text,

  -- Classification
  category text, -- 'uae-korea', 'politics', 'economy', 'industry', etc.
  tags text[] default '{}',

  -- Timestamps
  published_at timestamptz,
  crawled_at timestamptz default now(),

  -- For tracking
  view_count int default 0,
  is_featured boolean default false
);

-- Indexes
create index if not exists idx_news_published_at on news_articles(published_at desc);
create index if not exists idx_news_category on news_articles(category);
create index if not exists idx_news_source on news_articles(source);

-- =============================================================================
-- 3. Ask Me Sessions - Track Q&A for learning
-- =============================================================================
create table if not exists askme_sessions (
  id uuid primary key default uuid_generate_v4(),

  -- Q&A
  question text not null,
  answer text not null,

  -- Context
  sources_used jsonb default '[]', -- Which documents were referenced
  model text default 'claude',

  -- Feedback
  rating int check (rating >= 1 and rating <= 5),
  feedback text,

  -- Metadata
  locale text default 'ko' check (locale in ('ko', 'en')),
  session_id text, -- For grouping multi-turn conversations

  -- Timestamps
  created_at timestamptz default now()
);

create index if not exists idx_askme_created_at on askme_sessions(created_at desc);

-- =============================================================================
-- 4. Trends & Analytics (for future use)
-- =============================================================================
create table if not exists daily_stats (
  id uuid primary key default uuid_generate_v4(),
  date date unique not null default current_date,

  -- Counts
  news_crawled int default 0,
  askme_queries int default 0,
  page_views jsonb default '{}', -- { home: 100, politics: 50, ... }

  -- Top items
  top_questions jsonb default '[]',
  top_news jsonb default '[]',

  created_at timestamptz default now()
);

-- =============================================================================
-- Row Level Security (RLS) - For production
-- =============================================================================
-- Enable RLS
alter table documents enable row level security;
alter table news_articles enable row level security;
alter table askme_sessions enable row level security;
alter table daily_stats enable row level security;

-- Allow anonymous read for public data
create policy "Public read access" on documents for select using (true);
create policy "Public read access" on news_articles for select using (true);

-- Service role can do everything (for API)
create policy "Service role full access" on documents for all using (auth.role() = 'service_role');
create policy "Service role full access" on news_articles for all using (auth.role() = 'service_role');
create policy "Service role full access" on askme_sessions for all using (auth.role() = 'service_role');
create policy "Service role full access" on daily_stats for all using (auth.role() = 'service_role');

-- =============================================================================
-- Helper Functions
-- =============================================================================

-- Function to generate content hash for deduplication
create or replace function generate_content_hash()
returns trigger as $$
begin
  new.content_hash := md5(new.content);
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-generate hash
create trigger set_content_hash
  before insert or update on documents
  for each row
  execute function generate_content_hash();

-- Function to update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on documents
  for each row
  execute function update_updated_at();
