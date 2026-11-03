-- V4__create_proposals_tables.sql
-- Description: Create proposals and proposals_counters tables with indexes, constraints, and audit triggers

CREATE TABLE IF NOT EXISTS public.proposals (
    id VARCHAR(50) PRIMARY KEY,
    opportunity_id VARCHAR(50) NOT NULL,
    client_id VARCHAR(50) NOT NULL,
    client_name VARCHAR(255),
    proposal_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    version VARCHAR(50) NOT NULL DEFAULT 'V1.0',
    title VARCHAR(255) NOT NULL,
    service_id VARCHAR(50) NOT NULL,
    service_name VARCHAR(255),
    service_before_tax NUMERIC(14, 2) NOT NULL CHECK (service_before_tax >= 0),
    tax_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    total_amount NUMERIC(14, 2) NOT NULL CHECK (total_amount >= 0),
    owner_id VARCHAR(50) NOT NULL,
    owner_name VARCHAR(255),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Sent', 'Pending', 'Approved', 'In Review', 'Rejected')),
    expected_decision_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_proposals_valid_until CHECK (valid_until >= proposal_date)
);

-- Performance Indexes for search, filter, and sorting queries
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_proposal_date ON public.proposals(proposal_date);
CREATE INDEX IF NOT EXISTS idx_proposals_valid_until ON public.proposals(valid_until);
CREATE INDEX IF NOT EXISTS idx_proposals_decision_date ON public.proposals(expected_decision_date);
CREATE INDEX IF NOT EXISTS idx_proposals_client_id ON public.proposals(client_id);
CREATE INDEX IF NOT EXISTS idx_proposals_opportunity_id ON public.proposals(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_proposals_service_id ON public.proposals(service_id);
CREATE INDEX IF NOT EXISTS idx_proposals_owner_id ON public.proposals(owner_id);
CREATE INDEX IF NOT EXISTS idx_proposals_title ON public.proposals(title);

-- Trigger for automatic updated_at maintenance
DROP TRIGGER IF EXISTS trigger_proposals_updated_at ON public.proposals;
CREATE TRIGGER trigger_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION update_collections_updated_at_column();

-- Atomic, concurrency-safe proposal ID sequence counter table
CREATE TABLE IF NOT EXISTS public.proposals_counters (
    prefix VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    current_val BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (prefix, year)
);
