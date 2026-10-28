-- V3__add_invoice_sequence_counter.sql
-- Description: Dedicated table for atomic, concurrency-safe invoice sequence generation

CREATE TABLE IF NOT EXISTS public.collections_invoice_counters (
    prefix VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    current_val BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (prefix, year)
);

-- Seed initial counter values based on existing records in collections_invoices
INSERT INTO public.collections_invoice_counters (prefix, year, current_val)
VALUES 
  ('INV', 2024, (SELECT COALESCE(MAX(CASE WHEN id ~ '^INV-2024-[0-9]+$' THEN substring(id from '^INV-2024-([0-9]+)$')::bigint ELSE 0 END), 0) FROM public.collections_invoices)),
  ('INV', 2025, (SELECT COALESCE(MAX(CASE WHEN id ~ '^INV-2025-[0-9]+$' THEN substring(id from '^INV-2025-([0-9]+)$')::bigint ELSE 0 END), 0) FROM public.collections_invoices)),
  ('INV', 2026, (SELECT COALESCE(MAX(CASE WHEN id ~ '^INV-2026-[0-9]+$' THEN substring(id from '^INV-2026-([0-9]+)$')::bigint ELSE 0 END), 0) FROM public.collections_invoices))
ON CONFLICT (prefix, year) DO NOTHING;
