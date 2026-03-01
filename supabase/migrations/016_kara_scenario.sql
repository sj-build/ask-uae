-- ============================================================================
-- KARA Scenario Intelligence Agent — DB Schema
-- Tables for scenario state, analysis log, variable history
-- ============================================================================

-- 1. Scenario State — Current scenario probabilities + variables snapshot
CREATE TABLE scenario_state (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scenario_a_pct DECIMAL(5, 2) NOT NULL DEFAULT 25,
    scenario_b_pct DECIMAL(5, 2) NOT NULL DEFAULT 35,
    scenario_c_pct DECIMAL(5, 2) NOT NULL DEFAULT 35,
    scenario_d_pct DECIMAL(5, 2) NOT NULL DEFAULT 5,
    primary_scenario VARCHAR(5) NOT NULL DEFAULT 'B',
    primary_sub_scenario VARCHAR(5),
    transition_detected VARCHAR(20),
    variables_snapshot JSONB,
    reasoning TEXT,
    trigger_news_ids BIGINT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scenario_timestamp ON scenario_state(timestamp);
CREATE INDEX idx_scenario_primary ON scenario_state(primary_scenario);

-- 2. Scenario Analysis Log — Full AI analysis history
CREATE TABLE scenario_analysis_log (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    input_data_summary TEXT,
    news_ids_analyzed BIGINT[],
    claude_request JSONB,
    claude_response JSONB,
    alert_level VARCHAR(20),
    scenario_changed BOOLEAN DEFAULT FALSE,
    variables_changed JSONB,
    telegram_sent BOOLEAN DEFAULT FALSE,
    telegram_message_id VARCHAR(50),
    processing_time_ms INTEGER,
    token_usage JSONB,
    cost_usd DECIMAL(8, 4),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analysis_timestamp ON scenario_analysis_log(timestamp);
CREATE INDEX idx_analysis_level ON scenario_analysis_log(alert_level);

-- 3. Scenario Variable History — Track individual variable changes
CREATE TABLE scenario_variable_history (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    variable_name VARCHAR(100) NOT NULL,
    old_value VARCHAR(200),
    new_value VARCHAR(200),
    confidence DECIMAL(3, 2),
    source VARCHAR(200),
    analysis_id BIGINT REFERENCES scenario_analysis_log(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_variable_name ON scenario_variable_history(variable_name);
CREATE INDEX idx_variable_timestamp ON scenario_variable_history(timestamp);

-- 4. RLS policies
ALTER TABLE scenario_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_analysis_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_variable_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read scenario_state" ON scenario_state
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow service insert/update scenario_state" ON scenario_state
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon read scenario_analysis_log" ON scenario_analysis_log
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow service insert/update scenario_analysis_log" ON scenario_analysis_log
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon read scenario_variable_history" ON scenario_variable_history
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow service insert/update scenario_variable_history" ON scenario_variable_history
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 5. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE scenario_state;

-- 6. Insert initial state
INSERT INTO scenario_state (
    scenario_a_pct, scenario_b_pct, scenario_c_pct, scenario_d_pct,
    primary_scenario, reasoning, variables_snapshot
) VALUES (
    25, 35, 35, 5,
    'B',
    'Initial state: Prolonged Conflict most likely based on current Hormuz blockade and IRGC resistance.',
    '{
        "irgc_command_status": "disrupted",
        "hormuz_status": "blocked",
        "iran_missile_activity": "high",
        "us_military_ops": "major_combat",
        "iran_air_defense": "destroyed",
        "khamenei_status": "confirmed_dead",
        "iran_successor": "no_clear_successor",
        "iran_protests": "celebrations_reported",
        "iran_military_defections": "none_confirmed",
        "oil_price_brent": 82.0,
        "hormuz_traffic_pct": 25,
        "uae_airspace": "closed",
        "uae_airport_status": "suspended",
        "ceasefire_talks": "none",
        "un_security_council": "emergency_session",
        "russia_china_stance": "verbal_condemnation"
    }'::jsonb
);
