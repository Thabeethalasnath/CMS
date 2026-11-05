-- ==============================================================================
-- Migration: V23__create_auth_and_password_reset_tables.sql
-- Description: Creates app_users and password_reset_otps with normalized emails,
--              role & status check constraints, HMAC hash indexing, and RLS lockdown.
-- ==============================================================================

-- 1. App Users Table
CREATE TABLE IF NOT EXISTS public.app_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    password_changed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_app_users_username UNIQUE (username),
    CONSTRAINT uq_app_users_email UNIQUE (email),
    CONSTRAINT chk_app_users_normalized_email CHECK (email = lower(trim(email))),
    CONSTRAINT chk_app_users_role CHECK (role IN ('ADMIN', 'CEO')),
    CONSTRAINT chk_app_users_status CHECK (status IN ('ACTIVE', 'DISABLED', 'LOCKED'))
);

CREATE INDEX IF NOT EXISTS idx_app_users_email ON public.app_users (email);
CREATE INDEX IF NOT EXISTS idx_app_users_username ON public.app_users (username);
CREATE INDEX IF NOT EXISTS idx_app_users_status ON public.app_users (status);

-- 2. Password Reset OTPs & Tokens Table
CREATE TABLE IF NOT EXISTS public.password_reset_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
    otp_hash VARCHAR(64) NOT NULL,
    reset_token_hash VARCHAR(64),
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 5,
    expires_at TIMESTAMPTZ NOT NULL,
    token_expires_at TIMESTAMPTZ,
    used_at TIMESTAMPTZ,
    client_ip VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_password_reset_otps_attempts CHECK (attempts >= 0 AND attempts <= max_attempts)
);

CREATE INDEX IF NOT EXISTS idx_password_reset_otps_user ON public.password_reset_otps (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_password_reset_otps_expires ON public.password_reset_otps (expires_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unq_active_reset_token ON public.password_reset_otps (reset_token_hash)
    WHERE reset_token_hash IS NOT NULL AND used_at IS NULL;

-- 3. Row Level Security Lockdown
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.app_users FROM anon, authenticated;
REVOKE ALL ON TABLE public.password_reset_otps FROM anon, authenticated;

