-- Migration 001: Initial Schema Baseline
-- Approved PostgreSQL Relational Database Schema v1.0

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. business_profile
CREATE TABLE IF NOT EXISTS business_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(160) NOT NULL,
  logo_url TEXT,
  phone VARCHAR(32) NOT NULL,
  whatsapp VARCHAR(32),
  address TEXT,
  city VARCHAR(100) NOT NULL,
  hours JSONB,
  description TEXT,
  google_business_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  summary VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  benefits JSONB,
  process JSONB,
  image_url TEXT,
  seo_title VARCHAR(180),
  seo_description VARCHAR(320),
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. service_areas
CREATE TABLE IF NOT EXISTS service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  map_reference TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. gallery_items
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt_text VARCHAR(300) NOT NULL,
  title VARCHAR(180),
  category VARCHAR(80) NOT NULL,
  location VARCHAR(120),
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  project_date DATE,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(120) NOT NULL,
  review_text TEXT NOT NULL,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  source VARCHAR(60) NOT NULL DEFAULT 'manual',
  source_url TEXT,
  review_date DATE,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. faqs
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question VARCHAR(300) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(80),
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  whatsapp_preference BOOLEAN DEFAULT false,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  location VARCHAR(160) NOT NULL,
  message TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'closed', 'spam')),
  source_page VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. analytics_events
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name VARCHAR(60) NOT NULL,
  page_path VARCHAR(255),
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  metadata JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. site_settings (Optional)
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(80) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance & quick queries
CREATE INDEX IF NOT EXISTS idx_services_published_order ON services (is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_service_areas_published_order ON service_areas (is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_published_order ON gallery_items (is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_service ON gallery_items (service_id);
CREATE INDEX IF NOT EXISTS idx_faqs_published_order ON faqs (is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_service ON faqs (service_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status_created_at ON enquiries (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_service_created_at ON enquiries (service_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_time ON analytics_events (event_name, occurred_at DESC);
