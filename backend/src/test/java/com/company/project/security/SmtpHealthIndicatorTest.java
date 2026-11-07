package com.company.project.security;

import com.company.project.security.service.EmailService;
import com.company.project.security.service.SmtpHealthIndicator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.Status;
import org.springframework.core.env.Environment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

class SmtpHealthIndicatorTest {

    private EmailService emailService;
    private Environment environment;
    private SmtpHealthIndicator healthIndicator;

    @BeforeEach
    void setUp() {
        emailService = Mockito.mock(EmailService.class);
        environment = Mockito.mock(Environment.class);
        healthIndicator = new SmtpHealthIndicator(emailService, environment);
    }

    @Test
    @DisplayName("Dev profile: reports UP with DEV_MAILPIT details")
    void testDevProfileMailpitHealth() {
        when(emailService.isSmtpConfigured()).thenReturn(true);
        when(environment.matchesProfiles("prod")).thenReturn(false);
        when(emailService.getSmtpHost()).thenReturn("localhost");
        when(emailService.getSmtpPort()).thenReturn(1025);
        when(emailService.getFromEmail()).thenReturn("no-reply@kalpanaaa.in");

        Health health = healthIndicator.health();

        assertThat(health.getStatus()).isEqualTo(Status.UP);
        assertThat(health.getDetails()).containsEntry("status", "CONFIGURED");
        assertThat(health.getDetails()).containsEntry("host", "localhost");
        assertThat(health.getDetails()).containsEntry("port", 1025);
    }

    @Test
    @DisplayName("Prod profile: unconfigured SMTP reports DOWN with UNCONFIGURED warning")
    void testProdUnconfiguredSmtpReportsDown() {
        when(emailService.isSmtpConfigured()).thenReturn(false);
        when(environment.matchesProfiles("prod")).thenReturn(true);
        when(emailService.getSmtpHost()).thenReturn("");
        when(emailService.getSmtpPort()).thenReturn(587);

        Health health = healthIndicator.health();

        assertThat(health.getStatus()).isEqualTo(Status.DOWN);
        assertThat(health.getDetails()).containsEntry("status", "UNCONFIGURED");
        assertThat(health.getDetails().get("warning").toString()).contains("Transactional SMTP provider is not configured");
    }

    @Test
    @DisplayName("Prod profile: properly configured SMTP reports UP")
    void testProdConfiguredSmtpReportsUp() {
        when(emailService.isSmtpConfigured()).thenReturn(true);
        when(environment.matchesProfiles("prod")).thenReturn(true);
        when(emailService.getSmtpHost()).thenReturn("smtp.resend.com");
        when(emailService.getSmtpPort()).thenReturn(587);
        when(emailService.getFromEmail()).thenReturn("no-reply@kalpanaaa.in");

        Health health = healthIndicator.health();

        assertThat(health.getStatus()).isEqualTo(Status.UP);
        assertThat(health.getDetails()).containsEntry("status", "CONFIGURED");
        assertThat(health.getDetails()).containsEntry("host", "smtp.resend.com");
    }
}

