-- V10__create_dashboard_approvals_followup_tables.sql
-- Description: DDL definitions for Dashboard, Approvals, Follow-Up Queue, Opportunities, Contracts, Employees, Clients, Leads, and Attendance

-- 1. Dashboard Settings
CREATE TABLE IF NOT EXISTS public.dashboard_settings (
    id BIGSERIAL PRIMARY KEY,
    company_name VARCHAR(255),
    dashboard_title VARCHAR(255),
    dashboard_subtitle VARCHAR(255),
    active_date_range VARCHAR(100),
    last_updated VARCHAR(100),
    user_name VARCHAR(100),
    user_role VARCHAR(100)
);

-- 2. Dashboard KPI Cards
CREATE TABLE IF NOT EXISTS public.dashboard_kpi_cards (
    id BIGSERIAL PRIMARY KEY,
    card_key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    raw_value NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    formatted_value VARCHAR(100) NOT NULL DEFAULT '0',
    change_percentage NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    change_type VARCHAR(50) NOT NULL DEFAULT 'neutral',
    comparison_text VARCHAR(255),
    icon_type VARCHAR(50) NOT NULL DEFAULT 'chart',
    color_theme VARCHAR(50) NOT NULL DEFAULT 'slate',
    sort_order INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Finance Monthly Overview
CREATE TABLE IF NOT EXISTS public.finance_monthly (
    id BIGSERIAL PRIMARY KEY,
    month_name VARCHAR(50) NOT NULL,
    month_short VARCHAR(20) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    revenue NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    collections NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    target NUMERIC(15, 2) NOT NULL DEFAULT 0.00
);

-- 4. Expense Breakdown
CREATE TABLE IF NOT EXISTS public.expense_breakdown (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    percentage NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    color VARCHAR(50),
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- 5. Sales Pipeline Stages
CREATE TABLE IF NOT EXISTS public.sales_pipeline_stages (
    id BIGSERIAL PRIMARY KEY,
    stage_name VARCHAR(100) NOT NULL,
    deal_count INTEGER NOT NULL DEFAULT 0,
    total_value NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    weighted_value NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    probability INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- 6. Project Status Distribution
CREATE TABLE IF NOT EXISTS public.project_status_distribution (
    id BIGSERIAL PRIMARY KEY,
    status_name VARCHAR(100) NOT NULL,
    project_count INTEGER NOT NULL DEFAULT 0,
    color VARCHAR(50),
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- 7. People Monthly
CREATE TABLE IF NOT EXISTS public.people_monthly (
    id BIGSERIAL PRIMARY KEY,
    month_name VARCHAR(50) NOT NULL,
    month_short VARCHAR(20) NOT NULL,
    employee_count INTEGER NOT NULL DEFAULT 0,
    net_payroll NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    employer_payroll_cost NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- 8. People Summary
CREATE TABLE IF NOT EXISTS public.people_summary (
    id BIGSERIAL PRIMARY KEY,
    active_employees INTEGER NOT NULL DEFAULT 0,
    open_positions INTEGER NOT NULL DEFAULT 0,
    attrition_rate NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    avg_tenure_years NUMERIC(6, 2) NOT NULL DEFAULT 0.00
);

-- 9. Management Alerts
CREATE TABLE IF NOT EXISTS public.management_alerts (
    id BIGSERIAL PRIMARY KEY,
    alert_key VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL DEFAULT 'info',
    alert_count INTEGER NOT NULL DEFAULT 0,
    route_path VARCHAR(255),
    action_label VARCHAR(100),
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- 10. Employee Approvals
CREATE TABLE IF NOT EXISTS public.employee_approvals (
    id BIGSERIAL PRIMARY KEY,
    employee_name VARCHAR(255) NOT NULL,
    employee_code VARCHAR(50) NOT NULL,
    request_type VARCHAR(100) NOT NULL,
    applied_date VARCHAR(50) NOT NULL,
    from_date VARCHAR(50) NOT NULL,
    to_date VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    approved_by VARCHAR(100),
    decided_at TIMESTAMPTZ
);

-- 11. Client Approvals
CREATE TABLE IF NOT EXISTS public.client_approvals (
    id BIGSERIAL PRIMARY KEY,
    approval_id VARCHAR(50) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    request_type VARCHAR(100) NOT NULL,
    reference_id VARCHAR(50) NOT NULL,
    requester VARCHAR(100) NOT NULL,
    request_date VARCHAR(50) NOT NULL,
    due_date VARCHAR(50) NOT NULL,
    amount VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    approved_by VARCHAR(100),
    decided_at TIMESTAMPTZ
);

-- 12. Ticket & Asset Approvals
CREATE TABLE IF NOT EXISTS public.ticket_asset_approvals (
    id BIGSERIAL PRIMARY KEY,
    approval_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    record_type VARCHAR(50) NOT NULL,
    record_code VARCHAR(50) NOT NULL,
    client_requester VARCHAR(100) NOT NULL,
    approval_type VARCHAR(100) NOT NULL,
    requested_date VARCHAR(50) NOT NULL,
    urgency VARCHAR(50) NOT NULL DEFAULT 'Normal',
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    approved_by VARCHAR(100),
    decided_at TIMESTAMPTZ
);

-- 13. Follow-Up Queue
CREATE TABLE IF NOT EXISTS public.follow_up_queue (
    id BIGSERIAL PRIMARY KEY,
    source_module VARCHAR(100) NOT NULL,
    item_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    record_id VARCHAR(50),
    due_date VARCHAR(50),
    assigned_to VARCHAR(100),
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
    health VARCHAR(50) NOT NULL DEFAULT 'On Track',
    is_done BOOLEAN NOT NULL DEFAULT FALSE,
    impact_value NUMERIC(15, 2) DEFAULT 0.00,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 14. Opportunities
CREATE TABLE IF NOT EXISTS public.opportunities (
    id BIGSERIAL PRIMARY KEY,
    opportunity_id VARCHAR(50) NOT NULL UNIQUE,
    client_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    deal_value NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    weighted_value NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    stage VARCHAR(50) NOT NULL,
    probability INTEGER NOT NULL DEFAULT 0,
    expected_close_date VARCHAR(50),
    owner VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 15. Contracts
CREATE TABLE IF NOT EXISTS public.contracts (
    id BIGSERIAL PRIMARY KEY,
    contract_id VARCHAR(50) NOT NULL UNIQUE,
    client_id VARCHAR(50) NOT NULL,
    proposal_id VARCHAR(50) NOT NULL,
    contract_type VARCHAR(100) NOT NULL,
    start_date VARCHAR(50) NOT NULL,
    end_date VARCHAR(50) NOT NULL,
    renewal_date VARCHAR(50),
    contract_value NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    notice_period INTEGER,
    payment_terms VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    order_index INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 16. Employees (Employee Master)
CREATE TABLE IF NOT EXISTS public.employees (
    id BIGSERIAL PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    employee_code VARCHAR(50) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    work_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    department VARCHAR(100),
    designation VARCHAR(100),
    employment_type VARCHAR(50),
    joining_date VARCHAR(50),
    reporting_manager VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    location VARCHAR(100),
    years_of_service NUMERIC(4, 1),
    current_tenure_status VARCHAR(50),
    monthly_ctc NUMERIC(15, 2),
    monthly_cost NUMERIC(15, 2),
    annual_ctc NUMERIC(15, 2),
    basic_pct NUMERIC(5, 2),
    hra_pct NUMERIC(5, 2),
    other_allowance NUMERIC(15, 2),
    employee_pf_pct NUMERIC(5, 2),
    employee_esi_pct NUMERIC(5, 2),
    pt_monthly NUMERIC(15, 2),
    tds_monthly NUMERIC(15, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 17. Leads
CREATE TABLE IF NOT EXISTS public.leads (
    id VARCHAR(64) PRIMARY KEY,
    lead_date VARCHAR(64) NOT NULL,
    company VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    source VARCHAR(64) NOT NULL,
    service_interest VARCHAR(128) NOT NULL,
    country VARCHAR(128) NOT NULL,
    city VARCHAR(128) NOT NULL,
    owner_id VARCHAR(128) NOT NULL,
    stage VARCHAR(64) NOT NULL,
    status VARCHAR(64) NOT NULL,
    next_follow_up VARCHAR(64),
    estimated_value VARCHAR(64),
    lead_score INTEGER,
    expected_value VARCHAR(64),
    expected_close_date VARCHAR(64),
    lost_reason VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 18. Clients
CREATE TABLE IF NOT EXISTS public.clients (
    id VARCHAR(64) PRIMARY KEY,
    client_code VARCHAR(64) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(128) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    country VARCHAR(128) NOT NULL,
    city VARCHAR(128) NOT NULL,
    client_type VARCHAR(64) NOT NULL,
    account_owner VARCHAR(128) NOT NULL,
    status VARCHAR(64) NOT NULL,
    credit_limit VARCHAR(64),
    onboarding_date VARCHAR(64),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 19. Attendance
CREATE TABLE IF NOT EXISTS public.attendance (
    id VARCHAR(30) PRIMARY KEY,
    attendance_date VARCHAR(50) NOT NULL,
    employee_id VARCHAR(30) NOT NULL,
    employee_name VARCHAR(100) NOT NULL,
    avatar_initials VARCHAR(10),
    avatar_color VARCHAR(30),
    status VARCHAR(30) NOT NULL,
    check_in VARCHAR(30),
    check_out VARCHAR(30),
    work_hours VARCHAR(30),
    overtime_hours VARCHAR(30),
    work_minutes INTEGER,
    overtime_minutes INTEGER,
    day_type VARCHAR(30),
    is_late BOOLEAN,
    has_overtime BOOLEAN,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

