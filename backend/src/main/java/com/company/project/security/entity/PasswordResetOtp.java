package com.company.project.security.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "password_reset_otps")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(name = "otp_hash", nullable = false, length = 64)
    private String otpHash;

    @Column(name = "reset_token_hash", length = 64)
    private String resetTokenHash;

    @Column(nullable = false)
    @Builder.Default
    private int attempts = 0;

    @Column(name = "max_attempts", nullable = false)
    @Builder.Default
    private int maxAttempts = 5;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "token_expires_at")
    private Instant tokenExpiresAt;

    @Column(name = "used_at")
    private Instant usedAt;

    @Column(name = "client_ip", length = 45)
    private String clientIp;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public boolean isExpired() {
        return expiresAt != null && Instant.now().isAfter(expiresAt);
    }

    public boolean isTokenExpired() {
        return tokenExpiresAt != null && Instant.now().isAfter(tokenExpiresAt);
    }

    public boolean isUsed() {
        return usedAt != null;
    }

    public boolean isMaxAttemptsReached() {
        return attempts >= maxAttempts;
    }
}

