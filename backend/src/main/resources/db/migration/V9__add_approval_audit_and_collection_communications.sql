-- V9: Add approval audit columns and collection communications table

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'employee_approvals') THEN
        ALTER TABLE employee_approvals ADD COLUMN IF NOT EXISTS approved_by VARCHAR(100);
        ALTER TABLE employee_approvals ADD COLUMN IF NOT EXISTS decided_at TIMESTAMP;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_approvals') THEN
        ALTER TABLE client_approvals ADD COLUMN IF NOT EXISTS approved_by VARCHAR(100);
        ALTER TABLE client_approvals ADD COLUMN IF NOT EXISTS decided_at TIMESTAMP;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ticket_asset_approvals') THEN
        ALTER TABLE ticket_asset_approvals ADD COLUMN IF NOT EXISTS approved_by VARCHAR(100);
        ALTER TABLE ticket_asset_approvals ADD COLUMN IF NOT EXISTS decided_at TIMESTAMP;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS collection_communications (
    id BIGSERIAL PRIMARY KEY,
    invoice_id VARCHAR(50) NOT NULL,
    communication_type VARCHAR(50) NOT NULL,
    recipient VARCHAR(255),
    subject VARCHAR(255),
    message TEXT,
    logged_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_coll_comm_invoice ON collection_communications(invoice_id);
