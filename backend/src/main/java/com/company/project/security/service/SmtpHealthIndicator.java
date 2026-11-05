package com.company.project.security.service;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * Custom Actuator Health Indicator for Transactional SMTP service.
 * In production:
 *   - Reports UP when live SMTP provider host and credentials are configured.
 *   - Reports DOWN with UNCONFIGURED status and alert when unconfigured.
 * In dev / test:
 *   - Reports UP with DEV_MAILPIT status referencing Mailpit at localhost:1025.
 */
@Component("smtpHealth")
public class SmtpHealthIndicator implements HealthIndicator {

    private final EmailService emailService;
    private final Environment environment;

    public SmtpHealthIndicator(EmailService emailService, Environment environment) {
        this.emailService = emailService;
        this.environment = environment;
    }

    @Override
    public Health health() {
        boolean configured = emailService.isSmtpConfigured();
        boolean isProd = environment.matchesProfiles("prod");

        if (!configured) {
            if (isProd) {
                return Health.down()
                        .withDetail("status", "UNCONFIGURED")
                        .withDetail("warning", "Transactional SMTP provider is not configured in production. Outgoing emails cannot be delivered.")
                        .withDetail("host", emailService.getSmtpHost())
                        .withDetail("port", emailService.getSmtpPort())
                        .build();
            } else {
                return Health.up()
                        .withDetail("status", "DEV_MAILPIT")
                        .withDetail("notice", "Running in dev/test environment. Mailpit expected at localhost:1025.")
                        .withDetail("host", emailService.getSmtpHost())
                        .withDetail("port", emailService.getSmtpPort())
                        .build();
            }
        }

        return Health.up()
                .withDetail("status", "CONFIGURED")
                .withDetail("provider", "Transactional SMTP")
                .withDetail("host", emailService.getSmtpHost())
                .withDetail("port", emailService.getSmtpPort())
                .withDetail("sender", emailService.getFromEmail())
                .build();
    }
}

