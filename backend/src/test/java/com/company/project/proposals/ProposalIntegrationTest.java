package com.company.project.proposals;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProposalIntegrationTest {

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

    @Test
    @DisplayName("GET /api/v1/proposals should return paginated proposals")
    void testListProposalsPaginated() throws Exception {
        mockMvc.perform(get("/api/v1/proposals")
                        .param("page", "1")
                        .param("size", "10")
                        .param("sort", "date-newest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.pageNumber", is(1)))
                .andExpect(jsonPath("$.pageSize", is(10)))
                .andExpect(jsonPath("$.totalElements", greaterThanOrEqualTo(124)));
    }

    @Test
    @DisplayName("GET /api/v1/proposals with search should filter records")
    void testSearchProposals() throws Exception {
        mockMvc.perform(get("/api/v1/proposals")
                        .param("search", "Website Redesign"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.content[0].title", containsString("Website Redesign")));
    }

    @Test
    @DisplayName("GET /api/v1/proposals with status filter")
    void testFilterByStatus() throws Exception {
        mockMvc.perform(get("/api/v1/proposals")
                        .param("status", "Pending")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].status", is("Pending")));
    }

    @Test
    @DisplayName("GET /api/v1/proposals/{id} should return proposal details")
    void testGetProposalDetails() throws Exception {
        mockMvc.perform(get("/api/v1/proposals/P-2025-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.proposalId", is("P-2025-001")))
                .andExpect(jsonPath("$.clientId", is("C-001")))
                .andExpect(jsonPath("$.opportunityId", is("O-2025-003")))
                .andExpect(jsonPath("$.serviceBeforeTax", is(100000.0)))
                .andExpect(jsonPath("$.taxAmount", is(18000.0)))
                .andExpect(jsonPath("$.totalAmount", is(118000.0)));
    }

    @Test
    @DisplayName("GET /api/v1/proposals/{id} for non-existent proposal should return 404")
    void testGetNonExistentProposal() throws Exception {
        mockMvc.perform(get("/api/v1/proposals/P-NONEXISTENT-999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")));
    }

    @Test
    @DisplayName("GET /api/v1/proposals/kpis should return dynamic KPI summary")
    void testGetKpis() throws Exception {
        mockMvc.perform(get("/api/v1/proposals/kpis"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalProposals", greaterThanOrEqualTo(124)))
                .andExpect(jsonPath("$.pendingDecisions", greaterThanOrEqualTo(36)))
                .andExpect(jsonPath("$.approvedProposals", greaterThanOrEqualTo(52)))
                .andExpect(jsonPath("$.totalProposalValue", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/v1/proposals/next-id should return valid candidate ID")
    void testGetNextId() throws Exception {
        mockMvc.perform(get("/api/v1/proposals/next-id"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nextId", matchesPattern("^P-2025-\\d{3,}$")));
    }

    @Test
    @DisplayName("POST /api/v1/proposals should create and persist new proposal")
    void testCreateProposalIntegration() throws Exception {
        String uniqueId = "P-2025-991";
        Map<String, Object> payload = new HashMap<>();
        payload.put("proposalId", uniqueId);
        payload.put("opportunityId", "O-2025-001");
        payload.put("clientId", "C-001");
        payload.put("clientName", "Tata Consultancy Enterprise");
        payload.put("proposalDate", "15 Mar 2025");
        payload.put("validUntil", "30 Apr 2025");
        payload.put("version", "V1.0");
        payload.put("title", "Integration Test Proposal");
        payload.put("serviceId", "S-001");
        payload.put("serviceName", "Web & UI Engineering");
        payload.put("serviceBeforeTax", 150000.00);
        payload.put("taxAmount", 27000.00);
        payload.put("totalAmount", 177000.00);
        payload.put("ownerId", "EMP-001");
        payload.put("ownerName", "Akshit Ujjain");
        payload.put("status", "Sent");
        payload.put("expectedDecisionDate", "25 Apr 2025");
        payload.put("description", "Automated end-to-end integration test proposal.");

        mockMvc.perform(post("/api/v1/proposals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.proposalId", is(uniqueId)))
                .andExpect(jsonPath("$.totalAmount", is(177000.0)));

        // Retrieve saved proposal
        mockMvc.perform(get("/api/v1/proposals/" + uniqueId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.proposalId", is(uniqueId)))
                .andExpect(jsonPath("$.title", is("Integration Test Proposal")));

        // Update its status
        Map<String, String> statusUpdate = Map.of("status", "Approved");
        mockMvc.perform(patch("/api/v1/proposals/" + uniqueId + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("Approved")));
    }

    @Test
    @DisplayName("PATCH /api/v1/proposals/{id}/status with invalid status should return 400")
    void testInvalidStatusUpdate() throws Exception {
        Map<String, String> statusUpdate = Map.of("status", "InvalidStatusName");
        mockMvc.perform(patch("/api/v1/proposals/P-2025-001/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Bad Request")));
    }

    @Test
    @DisplayName("POST /api/v1/proposals with invalid financial math should return 400")
    void testInvalidFinancialAmounts() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("proposalId", "P-2025-992");
        payload.put("opportunityId", "O-2025-001");
        payload.put("clientId", "C-001");
        payload.put("proposalDate", "15 Mar 2025");
        payload.put("validUntil", "30 Apr 2025");
        payload.put("version", "V1.0");
        payload.put("title", "Invalid Math Proposal");
        payload.put("serviceId", "S-001");
        payload.put("serviceBeforeTax", 100000.00);
        payload.put("taxAmount", 18000.00);
        payload.put("totalAmount", 999999.00); // Mismatched
        payload.put("ownerId", "EMP-001");
        payload.put("status", "Sent");
        payload.put("expectedDecisionDate", "25 Apr 2025");

        mockMvc.perform(post("/api/v1/proposals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Bad Request")));
    }
}
