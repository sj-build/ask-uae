-- ============================================================================
-- Vector RAG Migration: pgvector + document_chunks + match RPC
-- ============================================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create document_chunks table
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  token_count INTEGER NOT NULL DEFAULT 0,
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Ensure unique chunk per document
  UNIQUE(document_id, chunk_index)
);

-- 3. Create indexes
-- HNSW index for fast approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx
  ON document_chunks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Index for document lookups
CREATE INDEX IF NOT EXISTS document_chunks_document_id_idx
  ON document_chunks(document_id);

-- 4. Create match_document_chunks RPC function
CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  chunk_index INTEGER,
  content TEXT,
  similarity float,
  doc_title TEXT,
  doc_url TEXT,
  doc_source TEXT,
  doc_source_type TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.chunk_index,
    dc.content,
    1 - (dc.embedding <=> query_embedding) as similarity,
    d.title as doc_title,
    d.url as doc_url,
    d.source as doc_source,
    d.source_type as doc_source_type
  FROM document_chunks dc
  JOIN documents d ON dc.document_id = d.id
  WHERE 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 5. Grant permissions (for Supabase anon/authenticated access if needed)
-- Note: Adjust based on your RLS policies
GRANT EXECUTE ON FUNCTION match_document_chunks TO anon, authenticated;

-- 6. Add embedding_status to documents table for tracking
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS embedding_status TEXT DEFAULT 'pending'
CHECK (embedding_status IN ('pending', 'processing', 'completed', 'failed'));

-- 7. Create index for embedding status queries
CREATE INDEX IF NOT EXISTS documents_embedding_status_idx
  ON documents(embedding_status)
  WHERE embedding_status != 'completed';

COMMENT ON TABLE document_chunks IS 'Chunked document content with vector embeddings for RAG retrieval';
COMMENT ON FUNCTION match_document_chunks IS 'Semantic search via cosine similarity on document chunks';
