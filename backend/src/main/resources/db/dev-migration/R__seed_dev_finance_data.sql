-- R__seed_dev_finance_data.sql
-- Description: Repeatable dev-only seed for finance targets, sample expenses, and reconciled payments

-- 1. Reconcile Collections Payments for invoices with amount_paid > 0
INSERT INTO public.collections_payments (id, invoice_id, client_name, payment_date, amount, payment_method, reference_id, notes) VALUES
    ('PAY-2025-091', 'INV-2024-020', 'Trident Logistics', '2025-02-28', 95000.00, 'NEFT / RTGS', 'TXN-9910231', 'Partial payment'),
    ('PAY-2025-092', 'INV-2024-026', 'Zenith Architecture', '2025-02-15', 70000.00, 'Bank Transfer', 'TXN-9910232', 'Milestone release'),
    ('PAY-2025-093', 'INV-2024-033', 'Genesis Hospitality', '2025-03-20', 190000.00, 'Corporate Card', 'CC-9910233', 'Full invoice settlement'),
    ('PAY-2025-094', 'INV-2024-035', 'Imperial Exports', '2025-02-20', 50000.00, 'UPI', 'UPI-9910234', 'Advance installment')
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Finance Targets
INSERT INTO public.finance_targets (metric_key, target_value, comparison_direction, basis) VALUES
    ('invoice_value', 1250000.00, 'HIGHER_IS_BETTER', 'MONTHLY'),
    ('collected_payments', 1000000.00, 'HIGHER_IS_BETTER', 'MONTHLY'),
    ('outstanding_receivables', 3000000.00, 'LOWER_IS_BETTER', 'POINT_IN_TIME'),
    ('current_receivables', 2000000.00, 'NEUTRAL', 'POINT_IN_TIME'),
    ('aging_1_30', 1000000.00, 'LOWER_IS_BETTER', 'POINT_IN_TIME'),
    ('aging_31_60', 500000.00, 'LOWER_IS_BETTER', 'POINT_IN_TIME'),
    ('aging_61_90', 250000.00, 'LOWER_IS_BETTER', 'POINT_IN_TIME'),
    ('aging_90_plus', 100000.00, 'LOWER_IS_BETTER', 'POINT_IN_TIME'),
    ('total_expenses', 350000.00, 'LOWER_IS_BETTER', 'MONTHLY'),
    ('project_expenses', 150000.00, 'LOWER_IS_BETTER', 'MONTHLY'),
    ('operating_cash_result', 400000.00, 'HIGHER_IS_BETTER', 'MONTHLY'),
    ('collection_rate', 85.00, 'HIGHER_IS_BETTER', 'PERCENT')
ON CONFLICT (metric_key) DO UPDATE SET
    target_value = EXCLUDED.target_value,
    comparison_direction = EXCLUDED.comparison_direction,
    basis = EXCLUDED.basis,
    updated_at = CURRENT_TIMESTAMP;

-- 3. Seed Realistic Baseline Expenses for FY 2024-25 and Recent Periods
INSERT INTO public.expenses (expense_date, category, amount, is_project_expense, project_label, description, created_by) VALUES
    ('2025-01-10', 'Salaries & Contractors', 1776600.00, FALSE, NULL, 'Engineering & Core Team January Payroll', 'admin@cms.internal'),
    ('2025-01-15', 'Software & Tools', 1184400.00, FALSE, NULL, 'Enterprise Cloud & SaaS tool licenses', 'admin@cms.internal'),
    ('2025-01-20', 'Infrastructure & Servers', 634500.00, FALSE, NULL, 'AWS & Supabase production hosting', 'admin@cms.internal'),
    ('2025-02-05', 'Project Deliverables', 450000.00, TRUE, 'PRJ-2025-012', 'Specialist QA subcontracting', 'admin@cms.internal'),
    ('2025-02-12', 'Project Assets', 396000.00, TRUE, 'PRJ-2025-018', 'Client dedicated server setup', 'admin@cms.internal'),
    ('2025-02-18', 'Office & Administrative', 338400.00, FALSE, NULL, 'Facility lease and utilities', 'admin@cms.internal'),
    ('2025-02-25', 'Marketing & Sales', 296100.00, FALSE, NULL, 'Q1 Campaign advertising & collateral', 'admin@cms.internal'),
    ('2025-03-05', 'Project Deliverables', 320000.00, TRUE, 'PRJ-2025-022', 'External Security Penetration Testing', 'admin@cms.internal'),
    ('2025-03-15', 'Salaries & Contractors', 1820000.00, FALSE, NULL, 'Engineering & Core Team March Payroll', 'admin@cms.internal')
ON CONFLICT DO NOTHING;

