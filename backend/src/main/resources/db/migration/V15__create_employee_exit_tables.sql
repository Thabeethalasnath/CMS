-- V15__create_employee_exit_tables.sql
-- Description: Create employee_exit_records, employee_exit_counters, triggers, indexes, and seed initial records

-- 1. Create table for Employee Exit records
CREATE TABLE IF NOT EXISTS public.employee_exit_records (
    id BIGSERIAL PRIMARY KEY,
    exit_id VARCHAR(50) NOT NULL UNIQUE,
    employee_id VARCHAR(50) NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    resignation_date DATE NOT NULL,
    approval_date DATE,
    notice_period_days INTEGER NOT NULL DEFAULT 30 CHECK (notice_period_days >= 0),
    last_working_day DATE NOT NULL,
    exit_type VARCHAR(50) NOT NULL CHECK (exit_type IN ('Resignation', 'Termination', 'Retirement', 'Absconding')),
    reason VARCHAR(500) NOT NULL,
    exit_status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (exit_status IN ('Approved', 'Pending', 'In Review', 'Rejected')),
    assets_returned VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (assets_returned IN ('Returned', 'Pending', '-')),
    full_and_final_status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (full_and_final_status IN ('Approved', 'Pending', 'In Review')),
    notes TEXT,
    notice_completion_date DATE,
    exit_readiness VARCHAR(50) NOT NULL DEFAULT 'Not Started' CHECK (exit_readiness IN ('Completed', 'In Progress', 'Not Started')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes for search, filter, and sorting queries
CREATE INDEX IF NOT EXISTS idx_employee_exit_exit_id ON public.employee_exit_records(exit_id);
CREATE INDEX IF NOT EXISTS idx_employee_exit_emp_id ON public.employee_exit_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_exit_emp_name ON public.employee_exit_records(employee_name);
CREATE INDEX IF NOT EXISTS idx_employee_exit_status ON public.employee_exit_records(exit_status);
CREATE INDEX IF NOT EXISTS idx_employee_exit_type ON public.employee_exit_records(exit_type);
CREATE INDEX IF NOT EXISTS idx_employee_exit_notice_days ON public.employee_exit_records(notice_period_days);
CREATE INDEX IF NOT EXISTS idx_employee_exit_resignation_date ON public.employee_exit_records(resignation_date);
CREATE INDEX IF NOT EXISTS idx_employee_exit_lwd ON public.employee_exit_records(last_working_day);
CREATE INDEX IF NOT EXISTS idx_employee_exit_readiness ON public.employee_exit_records(exit_readiness);

-- 3. Automatic updated_at trigger maintenance
DROP TRIGGER IF EXISTS trigger_employee_exit_records_updated_at ON public.employee_exit_records;
CREATE TRIGGER trigger_employee_exit_records_updated_at
BEFORE UPDATE ON public.employee_exit_records
FOR EACH ROW
EXECUTE FUNCTION update_collections_updated_at_column();

-- 4. Atomic, concurrency-safe Exit ID sequence counter table
CREATE TABLE IF NOT EXISTS public.employee_exit_counters (
    prefix VARCHAR(20) PRIMARY KEY,
    current_val BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Seed initial 18 exit records from designer-approved mock data
INSERT INTO public.employee_exit_records (
    exit_id, employee_id, employee_name, resignation_date, approval_date,
    notice_period_days, last_working_day, exit_type, reason,
    exit_status, assets_returned, full_and_final_status,
    notes, notice_completion_date, exit_readiness
)
VALUES
    ('EXI-00018', 'EMP-001', 'Amit Sharma', '2026-10-25', '2026-10-26', 30, '2026-11-24', 'Resignation', 'Personal reasons', 'Approved', 'Pending', 'Pending', '-', '2026-11-24', 'In Progress'),
    ('EXI-00017', 'EMP-004', 'Sneha Nair', '2026-10-20', '2026-10-21', 15, '2026-11-05', 'Resignation', 'Career growth', 'Pending', 'Returned', 'Pending', '-', '2026-11-05', 'Not Started'),
    ('EXI-00016', 'EMP-006', 'Ananya Rao', '2026-10-18', '2026-10-20', 20, '2026-11-07', 'Resignation', 'Family reasons', 'Approved', 'Returned', 'Approved', 'Laptop, ID Card', '2026-11-07', 'Completed'),
    ('EXI-00015', 'EMP-002', 'Priya Kapoor', '2026-10-15', '2026-10-18', 30, '2026-11-14', 'Resignation', 'Health issues', 'Pending', 'Pending', 'Pending', '-', NULL, 'Not Started'),
    ('EXI-00014', 'EMP-003', 'Rohan Kumar', '2026-10-08', '2026-10-10', 15, '2026-10-24', 'Termination', 'Restructuring', 'Approved', 'Returned', 'Approved', 'Company Assets', '2026-10-24', 'Completed'),
    ('EXI-00013', 'EMP-007', 'Karthik R', '2026-10-02', '2026-10-05', 45, '2026-11-16', 'Resignation', 'Higher Studies', 'In Review', '-', 'In Review', '-', '2026-11-16', 'In Progress'),
    ('EXI-00012', 'EMP-008', 'Divya Patel', '2026-09-28', '2026-09-30', 20, '2026-10-19', 'Resignation', 'Personal reasons', 'Approved', 'Returned', 'Approved', 'Laptop', '2026-10-19', 'Completed'),
    ('EXI-00011', 'EMP-005', 'Vikram Shah', '2026-09-22', '2026-09-26', 10, '2026-10-06', 'Resignation', 'Relocation', 'Approved', 'Returned', 'Approved', 'ID Card', '2026-10-06', 'Completed'),
    ('EXI-00010', 'EMP-009', 'Meera Joshi', '2026-09-15', '2026-09-18', 30, '2026-10-16', 'Resignation', 'Marriage', 'Pending', '-', 'Pending', '-', NULL, 'Not Started'),
    ('EXI-00009', 'EMP-010', 'Arjun Verma', '2026-09-10', '2026-09-12', 15, '2026-09-27', 'Termination', 'Performance', 'Approved', 'Returned', 'Approved', 'Laptop, ID Card', '2026-09-27', 'Completed'),
    ('EXI-00008', 'EMP-011', 'Sunita Deshmukh', '2026-09-01', '2026-09-03', 30, '2026-10-02', 'Resignation', 'Career growth', 'Approved', 'Returned', 'Approved', 'Laptop, Access Card', '2026-10-02', 'Completed'),
    ('EXI-00007', 'EMP-012', 'Rajesh Nair', '2026-08-20', '2026-08-23', 30, '2026-09-21', 'Resignation', 'Personal reasons', 'Approved', 'Returned', 'Approved', 'Laptop', '2026-09-21', 'Completed'),
    ('EXI-00006', 'EMP-013', 'Pooja Sharma', '2026-08-15', '2026-08-17', 15, '2026-08-31', 'Resignation', 'Higher Studies', 'Approved', 'Returned', 'Approved', 'ID Card, Token', '2026-08-31', 'Completed'),
    ('EXI-00005', 'EMP-014', 'Aditya Singhal', '2026-08-05', '2026-08-08', 30, '2026-09-06', 'Resignation', 'Relocation', 'Approved', 'Returned', 'Approved', 'Company Phone', '2026-09-06', 'Completed'),
    ('EXI-00004', 'EMP-015', 'Neha Gupta', '2026-07-28', '2026-07-30', 20, '2026-08-18', 'Resignation', 'Family reasons', 'Approved', 'Returned', 'Approved', 'Laptop, Monitor', '2026-08-18', 'Completed'),
    ('EXI-00003', 'EMP-016', 'Manoj Tiwari', '2026-07-18', '2026-07-20', 15, '2026-08-04', 'Termination', 'Contract Ended', 'Approved', 'Returned', 'Approved', 'All Assets', '2026-08-04', 'In Progress'),
    ('EXI-00002', 'EMP-017', 'Deepak Joshi', '2026-07-10', '2026-07-12', 30, '2026-08-11', 'Resignation', 'Career growth', 'In Review', 'Pending', 'In Review', 'Laptop', '2026-08-11', 'In Progress'),
    ('EXI-00001', 'EMP-018', 'Swati Mishra', '2026-07-01', '2026-07-04', 45, '2026-08-17', 'Resignation', 'Better Opportunity', 'Pending', 'Pending', 'Pending', '-', NULL, 'Not Started')
ON CONFLICT (exit_id) DO NOTHING;

-- 6. Initialize atomic sequence counter to 18 (matching max exit_id number)
INSERT INTO public.employee_exit_counters (prefix, current_val)
VALUES ('EXI', 18)
ON CONFLICT (prefix) DO UPDATE
SET current_val = GREATEST(public.employee_exit_counters.current_val, 18),
    updated_at = NOW();

