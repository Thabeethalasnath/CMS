-- V11__migrate_leads_column_types.sql
-- Description: Convert string date and amount columns in leads table to native DATE and NUMERIC(14,2) types, and add lead_counters table

DO $$
BEGIN
    -- 1. Migrate lead_date to DATE
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'lead_date' AND data_type = 'character varying'
    ) THEN
        ALTER TABLE public.leads
            ALTER COLUMN lead_date TYPE DATE
            USING (
                CASE
                    WHEN lead_date IS NULL OR lead_date = '' THEN CURRENT_DATE
                    WHEN lead_date ~ '^\d{4}-\d{2}-\d{2}' THEN substring(lead_date from 1 for 10)::DATE
                    WHEN lead_date ~ '^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}' THEN to_date(lead_date, 'DD Mon YYYY')
                    ELSE CURRENT_DATE
                END
            );
    END IF;

    -- 2. Migrate expected_close_date to DATE
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'expected_close_date' AND data_type = 'character varying'
    ) THEN
        ALTER TABLE public.leads
            ALTER COLUMN expected_close_date TYPE DATE
            USING (
                CASE
                    WHEN expected_close_date IS NULL OR expected_close_date = '' THEN NULL
                    WHEN expected_close_date ~ '^\d{4}-\d{2}-\d{2}' THEN substring(expected_close_date from 1 for 10)::DATE
                    WHEN expected_close_date ~ '^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}' THEN to_date(expected_close_date, 'DD Mon YYYY')
                    ELSE NULL
                END
            );
    END IF;

    -- 3. Migrate next_follow_up to DATE
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'next_follow_up' AND data_type = 'character varying'
    ) THEN
        ALTER TABLE public.leads
            ALTER COLUMN next_follow_up TYPE DATE
            USING (
                CASE
                    WHEN next_follow_up IS NULL OR next_follow_up = '' THEN NULL
                    WHEN next_follow_up ~ '^\d{4}-\d{2}-\d{2}' THEN substring(next_follow_up from 1 for 10)::DATE
                    WHEN next_follow_up ~ '^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}' THEN to_date(next_follow_up, 'DD Mon YYYY')
                    ELSE NULL
                END
            );
    END IF;

    -- 4. Migrate estimated_value to NUMERIC(14,2)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'estimated_value' AND data_type = 'character varying'
    ) THEN
        ALTER TABLE public.leads
            ALTER COLUMN estimated_value TYPE NUMERIC(14, 2)
            USING (
                CASE
                    WHEN estimated_value IS NULL OR estimated_value = '' THEN 0.00
                    ELSE NULLIF(regexp_replace(estimated_value, '[^0-9.]', '', 'g'), '')::NUMERIC(14, 2)
                END
            );
    END IF;

    -- 5. Migrate expected_value to NUMERIC(14,2)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'expected_value' AND data_type = 'character varying'
    ) THEN
        ALTER TABLE public.leads
            ALTER COLUMN expected_value TYPE NUMERIC(14, 2)
            USING (
                CASE
                    WHEN expected_value IS NULL OR expected_value = '' THEN NULL
                    ELSE NULLIF(regexp_replace(expected_value, '[^0-9.]', '', 'g'), '')::NUMERIC(14, 2)
                END
            );
    END IF;
END $$;

-- 6. Atomic counter table for sequential Lead IDs (L-YYYY-NNN)
CREATE TABLE IF NOT EXISTS public.lead_counters (
    prefix VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    current_val BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (prefix, year)
);

-- Seed existing counter from maximum existing lead ID
INSERT INTO public.lead_counters (prefix, year, current_val)
SELECT 'L', 2025, COALESCE(MAX(NULLIF(regexp_replace(id, '^L-2025-', ''), ''))::BIGINT, 0)
FROM public.leads
WHERE id ~ '^L-2025-\d+$'
ON CONFLICT (prefix, year) DO UPDATE SET current_val = GREATEST(public.lead_counters.current_val, EXCLUDED.current_val);
