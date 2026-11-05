-- V22__create_projects_and_tasks_tables.sql
-- Description: DDL definitions for projects and project_tasks tables with RLS and security controls

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id VARCHAR(50) PRIMARY KEY,
    project_code VARCHAR(50) NOT NULL UNIQUE,
    project_name VARCHAR(255) NOT NULL,
    client_id VARCHAR(50) NOT NULL,
    project_manager VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    planned_end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'In Progress',
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
    health VARCHAR(50) NOT NULL DEFAULT 'On Track',
    contract_value NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    tasks_completed INTEGER NOT NULL DEFAULT 0,
    tasks_total INTEGER NOT NULL DEFAULT 0,
    progress INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON public.projects(priority);
CREATE INDEX IF NOT EXISTS idx_projects_health ON public.projects(health);
CREATE INDEX IF NOT EXISTS idx_projects_manager ON public.projects(project_manager);

-- 2. Project Tasks Table
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL,
    milestone VARCHAR(100) NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    assigned_to VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    estimated_hours NUMERIC(6, 1) NOT NULL DEFAULT 0,
    actual_hours NUMERIC(6, 1) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'In Progress',
    progress INTEGER NOT NULL DEFAULT 0,
    dependencies VARCHAR(100) DEFAULT 'None',
    subtasks_completed INTEGER NOT NULL DEFAULT 0,
    subtasks_total INTEGER NOT NULL DEFAULT 0,
    health VARCHAR(50) NOT NULL DEFAULT 'On Track',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_assigned_to ON public.project_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_project_tasks_status ON public.project_tasks(status);
CREATE INDEX IF NOT EXISTS idx_project_tasks_milestone ON public.project_tasks(milestone);

-- 3. Row Level Security Lockdown
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.projects FROM anon, authenticated;
REVOKE ALL ON TABLE public.project_tasks FROM anon, authenticated;

