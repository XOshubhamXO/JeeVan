-- ============================================================
-- JeeVan Platform — PostgreSQL Database Schema
-- Supabase-Compatible — Paste into SQL Editor & Run All
-- ============================================================

-- ⚠️ Supabase auto-enables uuid-ossp and pgcrypto. Do NOT CREATE EXTENSION.

-- ─── User Sessions & Telemetry ───
CREATE TABLE IF NOT EXISTS user_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    user_name TEXT,
    user_age INT,
    country_code TEXT,
    country_name TEXT,
    detected_location JSONB,
    selected_language TEXT,
    selected_theme TEXT,
    interest_category TEXT,
    ip_address TEXT,
    user_agent TEXT,
    entry_timestamp TIMESTAMPTZ DEFAULT NOW(),
    exit_timestamp TIMESTAMPTZ,
    dwell_time_seconds INT,
    clickstream_path JSONB,
    mouse_trail_snapshots JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Global Plant Directory ───
CREATE TABLE IF NOT EXISTS plant_directory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    botanical_name TEXT NOT NULL,
    common_name TEXT NOT NULL,
    local_names JSONB,
    category TEXT NOT NULL,
    sub_category TEXT,
    exotic_variety BOOLEAN DEFAULT FALSE,
    heirloom BOOLEAN DEFAULT FALSE,
    origin_regions JSONB,
    optimal_climate JSONB,
    soil_requirements JSONB,
    growth_cycle_days INT,
    water_needs TEXT,
    companion_plants JSONB,
    antagonistic_plants JSONB,
    description TEXT,
    images_4k JSONB,
    seed_sources JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Admin Users (must come before ventures) ───
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    passkey_hash TEXT NOT NULL,
    admin_tier TEXT NOT NULL,
    assigned_ventures JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Ventures ───
CREATE TABLE IF NOT EXISTS ventures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    venture_name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    hero_image_url TEXT,
    gallery JSONB,
    pricing_info JSONB,
    contact_details JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    managed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Admin Audit Logs ───
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    admin_tier TEXT NOT NULL,
    action_performed TEXT NOT NULL,
    target_module TEXT,
    target_record_id UUID,
    previous_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Testimonials & Feedback ───
CREATE TABLE IF NOT EXISTS testimonials_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT,
    user_name TEXT,
    location TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    category TEXT,
    is_approved_by_alpha BOOLEAN DEFAULT FALSE,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Market Rates (Mandi) ───
CREATE TABLE IF NOT EXISTS market_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commodity_name TEXT NOT NULL,
    market_name TEXT,
    state TEXT,
    district TEXT,
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    modal_price DECIMAL(10,2),
    unit TEXT,
    recorded_date DATE NOT NULL,
    source_api TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Newsletter Subscribers ───
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    unsubscribed_at TIMESTAMPTZ
);

-- ─── AI Advisory Sessions ───
CREATE TABLE IF NOT EXISTS ai_advisory_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    query TEXT NOT NULL,
    response TEXT,
    context JSONB,
    model_used TEXT,
    tokens_used INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ───
CREATE INDEX IF NOT EXISTS idx_telemetry_session ON user_telemetry(session_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_country ON user_telemetry(country_code);
CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON user_telemetry(entry_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_plant_category ON plant_directory(category);
CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_logs(admin_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_tier ON admin_audit_logs(admin_tier);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials_feedback(is_approved_by_alpha);
CREATE INDEX IF NOT EXISTS idx_market_commodity ON market_rates(commodity_name, recorded_date DESC);
CREATE INDEX IF NOT EXISTS idx_market_location ON market_rates(state, district);
CREATE INDEX IF NOT EXISTS idx_ventures_slug ON ventures(slug);

-- ─── Row-Level Security ───
ALTER TABLE plant_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Everyone can read active plants
CREATE POLICY "public_read_active_plants" ON plant_directory
    FOR SELECT USING (is_active = TRUE);

-- Anyone can insert feedback
CREATE POLICY "anyone_insert_feedback" ON testimonials_feedback
    FOR INSERT WITH CHECK (TRUE);

-- Anyone can read approved feedback
CREATE POLICY "public_read_approved_feedback" ON testimonials_feedback
    FOR SELECT USING (is_approved_by_alpha = TRUE);

-- Audit logs: accessible via service_role (API), not anon
-- No public SELECT policy — admins access through API with service_role
