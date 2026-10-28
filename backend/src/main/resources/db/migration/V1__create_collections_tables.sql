-- V1__create_collections_tables.sql
-- Description: Create collections_invoices and collections_payments tables with constraints, indexes and triggers

CREATE TABLE IF NOT EXISTS public.collections_invoices (
    id VARCHAR(50) PRIMARY KEY,
    client_id VARCHAR(50),
    client_name VARCHAR(255) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    invoice_amount NUMERIC(14, 2) NOT NULL CHECK (invoice_amount >= 0),
    amount_paid NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (amount_paid >= 0),
    outstanding NUMERIC(14, 2) NOT NULL CHECK (outstanding >= 0),
    days_overdue INTEGER,
    ageing_bucket VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    recommended_action VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for high-performance filtering, sorting, and reporting
CREATE INDEX IF NOT EXISTS idx_collections_invoices_status ON public.collections_invoices(status);
CREATE INDEX IF NOT EXISTS idx_collections_invoices_due_date ON public.collections_invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_collections_invoices_client ON public.collections_invoices(client_name);
CREATE INDEX IF NOT EXISTS idx_collections_invoices_ageing ON public.collections_invoices(ageing_bucket);

-- Trigger function for automatic updated_at timestamp
CREATE OR REPLACE FUNCTION update_collections_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trigger_collections_invoices_updated_at ON public.collections_invoices;
CREATE TRIGGER trigger_collections_invoices_updated_at
BEFORE UPDATE ON public.collections_invoices
FOR EACH ROW
EXECUTE FUNCTION update_collections_updated_at_column();

-- Table for tracking payment transactions against invoices
CREATE TABLE IF NOT EXISTS public.collections_payments (
    id VARCHAR(50) PRIMARY KEY,
    invoice_id VARCHAR(50) NOT NULL REFERENCES public.collections_invoices(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    payment_date DATE NOT NULL,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(100) NOT NULL,
    reference_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_payments_invoice_id ON public.collections_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_collections_payments_date ON public.collections_payments(payment_date);
