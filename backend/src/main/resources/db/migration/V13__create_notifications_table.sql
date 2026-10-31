-- V13: Create portal_notifications table for real-time notifications in portal
CREATE TABLE IF NOT EXISTS portal_notifications (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    detail TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    link VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portal_notif_unread ON portal_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_portal_notif_created_at ON portal_notifications(created_at DESC);

