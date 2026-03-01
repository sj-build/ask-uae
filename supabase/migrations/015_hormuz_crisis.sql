-- ============================================================================
-- Migration 015: Hormuz Crisis Dashboard Tables
-- Adds 8 tables for real-time Strait of Hormuz monitoring
-- ============================================================================

-- 1. Vessel Tracking (AIS data, time-series)
CREATE TABLE IF NOT EXISTS hormuz_vessel_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mmsi TEXT NOT NULL,
    vessel_name TEXT,
    vessel_type TEXT CHECK (vessel_type IN ('tanker', 'container', 'lng_carrier', 'bulk', 'cargo', 'passenger', 'military', 'other')),
    imo TEXT,
    flag TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    speed_knots NUMERIC(6, 2),
    heading NUMERIC(6, 2),
    course NUMERIC(6, 2),
    nav_status TEXT,
    status TEXT CHECK (status IN ('transiting', 'stopped', 'u_turn', 'dark')),
    destination TEXT,
    draught NUMERIC(6, 2),
    cargo_type TEXT,
    estimated_cargo_volume_barrels BIGINT,
    zone TEXT CHECK (zone IN ('hormuz', 'persian_gulf', 'gulf_of_oman', 'red_sea', 'gulf_of_aden')),
    raw_ais_data JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vessel_timestamp ON hormuz_vessel_tracking(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_vessel_mmsi ON hormuz_vessel_tracking(mmsi);
CREATE INDEX IF NOT EXISTS idx_vessel_type ON hormuz_vessel_tracking(vessel_type);
CREATE INDEX IF NOT EXISTS idx_vessel_status ON hormuz_vessel_tracking(status);
CREATE INDEX IF NOT EXISTS idx_vessel_zone ON hormuz_vessel_tracking(zone);
CREATE UNIQUE INDEX IF NOT EXISTS idx_vessel_mmsi_ts ON hormuz_vessel_tracking(mmsi, timestamp);

-- 2. Traffic Summary (hourly/daily aggregates)
CREATE TABLE IF NOT EXISTS hormuz_traffic_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_type TEXT NOT NULL CHECK (period_type IN ('hourly', 'daily')),
    period_start TIMESTAMPTZ NOT NULL,
    zone TEXT NOT NULL DEFAULT 'hormuz',
    total_vessels INT DEFAULT 0,
    tanker_count INT DEFAULT 0,
    lng_carrier_count INT DEFAULT 0,
    container_count INT DEFAULT 0,
    other_count INT DEFAULT 0,
    transiting_count INT DEFAULT 0,
    stopped_count INT DEFAULT 0,
    u_turn_count INT DEFAULT 0,
    dark_vessel_count INT DEFAULT 0,
    eastbound_count INT DEFAULT 0,
    westbound_count INT DEFAULT 0,
    avg_speed_knots NUMERIC(6, 2),
    estimated_crude_barrels BIGINT,
    estimated_lng_tonnes BIGINT,
    traffic_change_pct NUMERIC(6, 2),
    anomaly_flag BOOLEAN DEFAULT FALSE,
    anomaly_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_traffic_timestamp ON hormuz_traffic_summary(period_start DESC);
CREATE INDEX IF NOT EXISTS idx_traffic_period ON hormuz_traffic_summary(period_type);
CREATE INDEX IF NOT EXISTS idx_traffic_anomaly ON hormuz_traffic_summary(anomaly_flag) WHERE anomaly_flag = TRUE;
CREATE UNIQUE INDEX IF NOT EXISTS idx_traffic_period_zone ON hormuz_traffic_summary(period_type, period_start, zone);

-- 3. Oil Price Tracking
CREATE TABLE IF NOT EXISTS oil_price_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    benchmark TEXT NOT NULL CHECK (benchmark IN ('brent', 'wti')),
    symbol TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    open_price NUMERIC(10, 2),
    high_price NUMERIC(10, 2),
    low_price NUMERIC(10, 2),
    prev_close NUMERIC(10, 2),
    change_pct NUMERIC(6, 3),
    change_1h_pct NUMERIC(6, 3),
    change_30m_pct NUMERIC(6, 3),
    volume BIGINT,
    source TEXT DEFAULT 'yahoo_finance',
    is_market_open BOOLEAN DEFAULT TRUE,
    spike_flag BOOLEAN DEFAULT FALSE,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_oil_timestamp ON oil_price_tracking(fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_oil_benchmark ON oil_price_tracking(benchmark);
CREATE INDEX IF NOT EXISTS idx_oil_spike ON oil_price_tracking(spike_flag) WHERE spike_flag = TRUE;

-- 4. Maritime Security Alerts
CREATE TABLE IF NOT EXISTS maritime_security_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL CHECK (source IN ('ukmto', 'marad', 'jmic', 'jwc', 'uk_mod', 'other')),
    alert_id TEXT,
    title TEXT NOT NULL,
    summary TEXT,
    full_text TEXT,
    threat_level TEXT CHECK (threat_level IN ('normal', 'elevated', 'substantial', 'critical')),
    region TEXT CHECK (region IN ('hormuz', 'persian_gulf', 'gulf_of_oman', 'red_sea', 'gulf_of_aden', 'arabian_sea')),
    affects_hormuz BOOLEAN DEFAULT FALSE,
    key_changes TEXT,
    url TEXT,
    content_hash TEXT UNIQUE,
    raw_data JSONB,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alert_source ON maritime_security_alerts(source);
CREATE INDEX IF NOT EXISTS idx_alert_timestamp ON maritime_security_alerts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_hormuz ON maritime_security_alerts(affects_hormuz) WHERE affects_hormuz = TRUE;
CREATE INDEX IF NOT EXISTS idx_alert_threat ON maritime_security_alerts(threat_level);

-- 5. Shipping Market Indicators
CREATE TABLE IF NOT EXISTS shipping_market_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    indicator_type TEXT NOT NULL CHECK (indicator_type IN (
        'vlcc_freight_rate', 'suezmax_freight_rate', 'war_risk_premium',
        'container_freight_index', 'bunker_price', 'hormuz_shipping_cost',
        'insurance_proxy_score'
    )),
    indicator_name TEXT,
    value NUMERIC(15, 2) NOT NULL,
    unit TEXT,
    change_pct NUMERIC(6, 2),
    source TEXT,
    notes TEXT,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_indicator_type ON shipping_market_indicators(indicator_type);
CREATE INDEX IF NOT EXISTS idx_indicator_timestamp ON shipping_market_indicators(fetched_at DESC);

-- 6. War News Feed
CREATE TABLE IF NOT EXISTS war_news_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT,
    url TEXT UNIQUE,
    source_name TEXT NOT NULL,
    source_type TEXT CHECK (source_type IN ('wire', 'broadcast', 'osint', 'official', 'social', 'rss')),
    category TEXT CHECK (category IN (
        'hormuz_shipping', 'oil_energy', 'military_ops', 'iran_internal',
        'uae_impact', 'market_reaction', 'diplomacy', 'insurance_maritime',
        'casualties', 'regime_change'
    )),
    severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    keywords TEXT[],
    sentiment NUMERIC(4, 2),
    is_verified BOOLEAN DEFAULT FALSE,
    related_alert_id UUID REFERENCES maritime_security_alerts(id),
    raw_data JSONB,
    published_at TIMESTAMPTZ,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_timestamp ON war_news_feed(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON war_news_feed(category);
CREATE INDEX IF NOT EXISTS idx_news_severity ON war_news_feed(severity);
CREATE INDEX IF NOT EXISTS idx_news_source ON war_news_feed(source_name);
CREATE INDEX IF NOT EXISTS idx_news_keywords ON war_news_feed USING GIN (keywords);

-- 7. Telegram Alert Log
CREATE TABLE IF NOT EXISTS telegram_alert_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_level TEXT NOT NULL CHECK (alert_level IN ('critical', 'warning', 'status')),
    trigger_type TEXT NOT NULL CHECK (trigger_type IN (
        'traffic_drop', 'oil_spike', 'vessel_u_turn', 'dark_vessel_surge',
        'security_alert_new', 'war_news_critical', 'insurance_indicator',
        'scheduled_status'
    )),
    title TEXT,
    message TEXT NOT NULL,
    chat_id TEXT,
    message_id TEXT,
    delivery_status TEXT CHECK (delivery_status IN ('sent', 'failed', 'retry')),
    cooldown_key TEXT,
    related_data JSONB,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telegram_timestamp ON telegram_alert_log(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_telegram_level ON telegram_alert_log(alert_level);
CREATE INDEX IF NOT EXISTS idx_telegram_trigger ON telegram_alert_log(trigger_type);
CREATE INDEX IF NOT EXISTS idx_telegram_cooldown ON telegram_alert_log(cooldown_key, sent_at DESC);

-- 8. Map Events
CREATE TABLE IF NOT EXISTS map_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL CHECK (event_type IN (
        'airstrike', 'missile_launch', 'missile_intercept', 'naval_incident',
        'vessel_seizure', 'explosion', 'protest', 'airport_closure',
        'port_closure', 'military_deployment', 'humanitarian'
    )),
    title TEXT NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location_name TEXT,
    country TEXT,
    source_name TEXT,
    source_url TEXT,
    severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    content_hash TEXT UNIQUE,
    icon_type TEXT,
    media_url TEXT,
    event_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_map_event_type ON map_events(event_type);
CREATE INDEX IF NOT EXISTS idx_map_timestamp ON map_events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_map_active ON map_events(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_map_location ON map_events(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_map_severity ON map_events(severity);

-- ============================================================================
-- Enable Supabase Realtime for key tables
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE hormuz_vessel_tracking;
ALTER PUBLICATION supabase_realtime ADD TABLE oil_price_tracking;
ALTER PUBLICATION supabase_realtime ADD TABLE maritime_security_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE war_news_feed;
ALTER PUBLICATION supabase_realtime ADD TABLE map_events;
ALTER PUBLICATION supabase_realtime ADD TABLE telegram_alert_log;

-- ============================================================================
-- RLS Policies (read-only for anon, full for service_role)
-- ============================================================================
ALTER TABLE hormuz_vessel_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE hormuz_traffic_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE oil_price_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE maritime_security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_market_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE war_news_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_alert_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_events ENABLE ROW LEVEL SECURITY;

-- Anon read access (for frontend)
CREATE POLICY "anon_read_vessels" ON hormuz_vessel_tracking FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_traffic" ON hormuz_traffic_summary FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_oil" ON oil_price_tracking FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_alerts" ON maritime_security_alerts FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_indicators" ON shipping_market_indicators FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_news" ON war_news_feed FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_map" ON map_events FOR SELECT TO anon USING (true);
-- telegram_alert_log is NOT readable by anon (admin only)

-- Service role full access (for API routes / workers)
CREATE POLICY "service_full_vessels" ON hormuz_vessel_tracking FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_full_traffic" ON hormuz_traffic_summary FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_full_oil" ON oil_price_tracking FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_full_alerts" ON maritime_security_alerts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_full_indicators" ON shipping_market_indicators FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_full_news" ON war_news_feed FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_full_telegram" ON telegram_alert_log FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_full_map" ON map_events FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================================
-- Helper RPC: Get traffic stats for dashboard
-- ============================================================================
CREATE OR REPLACE FUNCTION get_hormuz_traffic_stats(hours_back INT DEFAULT 24)
RETURNS TABLE (
    total_vessels BIGINT,
    tanker_count BIGINT,
    stopped_count BIGINT,
    u_turn_count BIGINT,
    dark_count BIGINT,
    avg_speed NUMERIC,
    eastbound BIGINT,
    westbound BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT v.mmsi)::BIGINT AS total_vessels,
        COUNT(DISTINCT v.mmsi) FILTER (WHERE v.vessel_type = 'tanker')::BIGINT AS tanker_count,
        COUNT(DISTINCT v.mmsi) FILTER (WHERE v.status = 'stopped')::BIGINT AS stopped_count,
        COUNT(DISTINCT v.mmsi) FILTER (WHERE v.status = 'u_turn')::BIGINT AS u_turn_count,
        COUNT(DISTINCT v.mmsi) FILTER (WHERE v.status = 'dark')::BIGINT AS dark_count,
        ROUND(AVG(v.speed_knots)::NUMERIC, 1) AS avg_speed,
        COUNT(DISTINCT v.mmsi) FILTER (WHERE v.course BETWEEN 45 AND 135)::BIGINT AS eastbound,
        COUNT(DISTINCT v.mmsi) FILTER (WHERE v.course BETWEEN 225 AND 315)::BIGINT AS westbound
    FROM hormuz_vessel_tracking v
    WHERE v.timestamp > NOW() - (hours_back || ' hours')::INTERVAL
      AND v.zone = 'hormuz';
END;
$$ LANGUAGE plpgsql STABLE;
