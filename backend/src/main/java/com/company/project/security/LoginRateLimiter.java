package com.company.project.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe in-memory login rate limiter.
 * Limits failed login attempts to a maximum of 5 attempts per username + IP within 15 minutes.
 */
@Component
public class LoginRateLimiter {

    public static final int MAX_FAILED_ATTEMPTS = 5;
    public static final long WINDOW_SECONDS = 15 * 60; // 15 minutes

    private static class AttemptRecord {
        int failedAttempts;
        Instant windowStartTime;

        AttemptRecord(Instant windowStartTime) {
            this.failedAttempts = 1;
            this.windowStartTime = windowStartTime;
        }
    }

    private final ConcurrentHashMap<String, AttemptRecord> records = new ConcurrentHashMap<>();

    private String buildKey(String username, String ip) {
        String u = username != null ? username.trim().toLowerCase() : "unknown";
        String i = ip != null ? ip.trim() : "unknown";
        return u + ":" + i;
    }

    /**
     * Checks if the username + IP combination is currently blocked due to exceeding max failed attempts.
     */
    public boolean isBlocked(String username, String ip) {
        String key = buildKey(username, ip);
        AttemptRecord record = records.get(key);
        if (record == null) {
            return false;
        }

        Instant now = Instant.now();
        if (now.isAfter(record.windowStartTime.plusSeconds(WINDOW_SECONDS))) {
            records.remove(key);
            return false;
        }

        return record.failedAttempts >= MAX_FAILED_ATTEMPTS;
    }

    /**
     * Records a failed login attempt for the given username + IP.
     */
    public void recordFailedAttempt(String username, String ip) {
        String key = buildKey(username, ip);
        Instant now = Instant.now();

        records.compute(key, (k, existing) -> {
            if (existing == null || now.isAfter(existing.windowStartTime.plusSeconds(WINDOW_SECONDS))) {
                return new AttemptRecord(now);
            }
            existing.failedAttempts++;
            return existing;
        });
    }

    /**
     * Resets failed login attempts upon successful authentication.
     */
    public void resetAttempts(String username, String ip) {
        String key = buildKey(username, ip);
        records.remove(key);
    }

    /**
     * Clears all recorded attempts (useful for testing).
     */
    public void clearAll() {
        records.clear();
    }
}

