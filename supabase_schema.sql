-- ==========================================================
-- SUPABASE DATABASE SETUP FOR CORE CUTTING WEBSITE
-- Run this in your Supabase SQL Editor (SQL Editor -> New Query -> Run)
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.enquiries (
  id VARCHAR(80) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  whatsapp_preference BOOLEAN DEFAULT true,
  service_id VARCHAR(120),
  service_name VARCHAR(160),
  location VARCHAR(160) NOT NULL,
  message TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'new',
  source VARCHAR(60) DEFAULT 'web_form',
  source_page VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous/form submissions to insert enquiries
CREATE POLICY "Allow public insert to enquiries"
  ON public.enquiries
  FOR INSERT
  TO anon, authenticated, service_role
  WITH CHECK (true);

-- Allow reading enquiries for authenticated / service_role
CREATE POLICY "Allow full access to service_role and authenticated"
  ON public.enquiries
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow reading enquiries with anon key for server routes
CREATE POLICY "Allow select for anon server routes"
  ON public.enquiries
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow update for anon server routes"
  ON public.enquiries
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete for anon server routes"
  ON public.enquiries
  FOR DELETE
  TO anon
  USING (true);

-- Create index for high-speed sorting by date
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries (created_at DESC);
