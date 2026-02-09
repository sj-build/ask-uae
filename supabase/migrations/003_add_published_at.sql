-- Add missing published_at column to documents table
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
