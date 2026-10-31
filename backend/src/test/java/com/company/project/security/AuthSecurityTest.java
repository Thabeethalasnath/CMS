package com.company.project.security;

import com.company.project.dashboard.dto.CeoDashboardUpdateRequest;
import com.company.project.dashboard.entity.DashboardSettings;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthSecurityTest {

    static {
        File[] envFiles = new File[]{ new File(".env"), new File("backend/.env"), new File("../.env") };
        for (File envFile : envFiles) {
            if (envFile.exists()) {
                try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) continue;
                        int eqIdx = line.indexOf('=');
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            if ((value.startsWith("\"") && value.endsWith("\"")) ||
                                (value.startsWith("'") && value.endsWith("'"))) {
                                value = value.substring(1, value.length() - 1);
                            }
                            if (System.getProperty(key) == null && System.getenv(key) == null) {
                                System.setProperty(key, value);
                            }
                        }
                    }
                } catch (Exception ignored) {}
                break;
            }
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private String validToken;

    @BeforeEach
    void setUp() {
        validToken = "Bearer " + jwtTokenProvider.generateToken("akshit.ujjain", "CEO");
    }

    @Test
    @DisplayName("Unauthenticated request to protected /api/v1/dashboard/ceo returns 401 Unauthorized")
    void testUnauthenticatedAccessReturns401() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/ceo"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Public actuator health check returns 200 without authentication")
    void testActuatorHealthIsPublic() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Authentication endpoint /api/v1/auth/login is public and returns valid JWT")
    void testLoginEndpointIsPublicAndReturnsToken() throws Exception {
        AuthController.LoginRequest request = new AuthController.LoginRequest("akshit.ujjain", "password123");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.role").value("CEO"));
    }

    @Test
    @DisplayName("Authenticated request with valid Bearer token accesses /api/v1/dashboard/sidebar/counts")
    void testAuthenticatedSidebarCounts() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/sidebar/counts")
                        .header("Authorization", validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.pendingApprovals").isNumber())
                .andExpect(jsonPath("$.data.overdueFollowUps").isNumber());
    }

    @Test
    @DisplayName("PUT /api/v1/dashboard/ceo with valid token updates settings")
    void testUpdateDashboardSettings() throws Exception {
        DashboardSettings updateSettings = new DashboardSettings();
        updateSettings.setCompanyName("KALPANAAA SOFTWARE SOLUTIONS");
        updateSettings.setDashboardTitle("CEO Executive Dashboard");

        CeoDashboardUpdateRequest request = new CeoDashboardUpdateRequest();
        request.setSettings(updateSettings);

        mockMvc.perform(put("/api/v1/dashboard/ceo")
                        .header("Authorization", validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.settings.company_name").value("KALPANAAA SOFTWARE SOLUTIONS"));
    }

    @Test
    @DisplayName("POST /api/v1/collections/invoices/INV-2024-001/reminder logs reminder")
    void testSendReminderEndpoint() throws Exception {
        Map<String, Object> reminderRequest = Map.of(
                "channels", Map.of("email", true, "whatsapp", true),
                "template", "Standard Overdue Notice"
        );

        mockMvc.perform(post("/api/v1/collections/invoices/INV-2024-001/reminders")
                        .header("Authorization", validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reminderRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("POST /api/v1/collections/invoices/INV-2024-001/communication logs communication history")
    void testLogCommunicationEndpoint() throws Exception {
        Map<String, Object> commRequest = Map.of(
                "communicationType", "EMAIL",
                "recipient", "finance@acme.com",
                "subject", "Payment Reminder for INV-2024-001",
                "message", "Please settle the outstanding balance."
        );

        mockMvc.perform(post("/api/v1/collections/invoices/INV-2024-001/communications")
                        .header("Authorization", validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("Invalid token to protected endpoint returns 401 Unauthorized")
    void testInvalidTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/ceo")
                        .header("Authorization", "Bearer invalid.fake.token"))
                .andExpect(status().isUnauthorized());
    }
}

