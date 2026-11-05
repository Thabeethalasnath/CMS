package com.company.project.security.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetRateLimiter {

    private final long cooldownSeconds;
    private final int hourlyLimit;

    private final Map<String, Instant> lastRequestTimes = new ConcurrentHashMap<>();
    private final Map<String, Deque<Instant>> hourlyRequestTimes = new ConcurrentHashMap<>();

    public PasswordResetRateLimiter(
            @Value("${app.auth.otp.cooldown-seconds:60}") long cooldownSeconds,
            @Value("${app.auth.otp.hourly-limit:5}") int hourlyLimit
    ) {
        this.cooldownSeconds = cooldownSeconds;
        this.hourlyLimit = hourlyLimit;
    }

    private String buildKey(String identifier, String clientIp) {
        String cleanId = identifier != null ? identifier.trim().toLowerCase() : "unknown";
        String cleanIp = clientIp != null ? clientIp.trim() : "unknown";
        return cleanId + "@" + cleanIp;
    }

    /**
     * Checks if the request is rate-limited. Returns remaining seconds of cooldown if blocked, or 0 if allowed.
     */
    public long getRemainingCooldownSeconds(String email, String clientIp) {
        String key = buildKey(email, clientIp);
        Instant now = Instant.now();

        // 1. Check cooldown
        Instant lastTime = lastRequestTimes.get(key);
        if (lastTime != null) {
            long elapsedSeconds = java.time.Duration.between(lastTime, now).getSeconds();
            if (elapsedSeconds < cooldownSeconds) {
                return cooldownSeconds - elapsedSeconds;
            }
        }

        // 2. Check hourly limit
        Deque<Instant> requests = hourlyRequestTimes.get(key);
        if (requests != null) {
            synchronized (requests) {
                Instant oneHourAgo = now.minusSeconds(3600);
                while (!requests.isEmpty() && requests.peekFirst().isBefore(oneHourAgo)) {
                    requests.pollFirst();
                }
                if (requests.size() >= hourlyLimit) {
                    Instant oldest = requests.peekFirst();
                    if (oldest != null) {
                        long wait = 3600 - java.time.Duration.between(oldest, now).getSeconds();
                        return Math.max(1, wait);
                    }
                    return 60;
                }
            }
        }

        return 0;
    }

    /**
     * Records a valid OTP request attempt.
     */
    public void recordRequest(String email, String clientIp) {
        String key = buildKey(email, clientIp);
        Instant now = Instant.now();

        lastRequestTimes.put(key, now);

        hourlyRequestTimes.compute(key, (k, existing) -> {
            Deque<Instant> deque = existing != null ? existing : new ArrayDeque<>();
            synchronized (deque) {
                Instant oneHourAgo = now.minusSeconds(3600);
                while (!deque.isEmpty() && deque.peekFirst().isBefore(oneHourAgo)) {
                    deque.pollFirst();
                }
                deque.addLast(now);
            }
            return deque;
        });
    }

    /**
     * Reset limits (useful for test resets).
     */
    public void reset(String email, String clientIp) {
        String key = buildKey(email, clientIp);
        lastRequestTimes.remove(key);
        hourlyRequestTimes.remove(key);
    }
}

