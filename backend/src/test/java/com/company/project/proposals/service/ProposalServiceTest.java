package com.company.project.proposals.service;

import com.company.project.common.exception.BusinessValidationException;
import com.company.project.common.exception.ResourceNotFoundException;
import com.company.project.proposals.dto.CreateProposalRequest;
import com.company.project.proposals.dto.ProposalKpiSummaryResponse;
import com.company.project.proposals.dto.ProposalResponse;
import com.company.project.proposals.entity.ProposalEntity;
import com.company.project.proposals.repository.ProposalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProposalServiceTest {

    @Mock
    private ProposalRepository proposalRepository;

    @Mock
    private ProposalIdGeneratorService idGeneratorService;

    @Spy
    private ProposalCalculationService calculationService = new ProposalCalculationService();

    @InjectMocks
    private ProposalService proposalService;

    private ProposalEntity sampleEntity;

    @BeforeEach
    void setUp() {
        sampleEntity = ProposalEntity.builder()
                .id("P-2025-001")
                .opportunityId("O-2025-003")
                .clientId("C-001")
                .clientName("Tata Consultancy Enterprise")
                .proposalDate(LocalDate.of(2025, 3, 15))
                .validUntil(LocalDate.of(2025, 4, 30))
                .version("V1.0")
                .title("Website Redesign Proposal")
                .serviceId("S-001")
                .serviceName("Web & UI Engineering")
                .serviceBeforeTax(new BigDecimal("100000.00"))
                .taxAmount(new BigDecimal("18000.00"))
                .totalAmount(new BigDecimal("118000.00"))
                .ownerId("EMP-001")
                .ownerName("Akshit Ujjain")
                .status("Sent")
                .expectedDecisionDate(LocalDate.of(2025, 4, 28))
                .description("Sample description")
                .build();
    }

    @Test
    @DisplayName("Should retrieve proposal by ID successfully")
    void testGetProposalByIdSuccess() {
        when(proposalRepository.findById("P-2025-001")).thenReturn(Optional.of(sampleEntity));

        ProposalResponse response = proposalService.getProposalById("P-2025-001");
        assertNotNull(response);
        assertEquals("P-2025-001", response.getProposalId());
        assertEquals("Website Redesign Proposal", response.getTitle());
        assertEquals("Sent", response.getStatus());
        assertEquals("15 Mar 2025", response.getProposalDate());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when proposal ID does not exist")
    void testGetProposalByIdNotFound() {
        when(proposalRepository.findById("P-2025-999")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                proposalService.getProposalById("P-2025-999")
        );
    }

    @Test
    @DisplayName("Should create proposal successfully when request is valid")
    void testCreateProposalSuccess() {
        CreateProposalRequest request = CreateProposalRequest.builder()
                .proposalId("P-2025-200")
                .opportunityId("O-2025-001")
                .clientId("C-001")
                .clientName("Tata Consultancy Enterprise")
                .proposalDate("15 Mar 2025")
                .validUntil("30 Apr 2025")
                .version("V1.0")
                .title("New Cloud Architecture")
                .serviceId("S-005")
                .serviceName("AWS & Kubernetes Infra")
                .serviceBeforeTax(new BigDecimal("200000.00"))
                .taxAmount(new BigDecimal("36000.00"))
                .totalAmount(new BigDecimal("236000.00"))
                .ownerId("EMP-001")
                .ownerName("Akshit Ujjain")
                .status("Pending")
                .expectedDecisionDate("28 Apr 2025")
                .description("Cloud infrastructure design")
                .build();

        when(proposalRepository.existsById("P-2025-200")).thenReturn(false);
        when(proposalRepository.save(any(ProposalEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProposalResponse response = proposalService.createProposal(request);
        assertNotNull(response);
        assertEquals("P-2025-200", response.getProposalId());
        assertEquals("New Cloud Architecture", response.getTitle());
        assertEquals("Pending", response.getStatus());
        verify(idGeneratorService).syncCounterIfHigher("P-2025-200");
    }

    @Test
    @DisplayName("Should reject duplicate proposal ID")
    void testCreateProposalDuplicateId() {
        CreateProposalRequest request = CreateProposalRequest.builder()
                .proposalId("P-2025-001")
                .title("Duplicate Proposal")
                .build();

        when(proposalRepository.existsById("P-2025-001")).thenReturn(true);

        BusinessValidationException ex = assertThrows(BusinessValidationException.class, () ->
                proposalService.createProposal(request)
        );
        assertTrue(ex.getMessage().contains("already exists"));
    }

    @Test
    @DisplayName("Should reject invalid proposal status")
    void testCreateProposalInvalidStatus() {
        CreateProposalRequest request = CreateProposalRequest.builder()
                .proposalId("P-2025-201")
                .title("Invalid Status Proposal")
                .status("UnknownStatus")
                .build();

        when(proposalRepository.existsById("P-2025-201")).thenReturn(false);

        BusinessValidationException ex = assertThrows(BusinessValidationException.class, () ->
                proposalService.createProposal(request)
        );
        assertTrue(ex.getMessage().contains("Invalid status"));
    }

    @Test
    @DisplayName("Should update proposal status successfully")
    void testUpdateStatusSuccess() {
        when(proposalRepository.findById("P-2025-001")).thenReturn(Optional.of(sampleEntity));
        when(proposalRepository.save(any(ProposalEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProposalResponse response = proposalService.updateProposalStatus("P-2025-001", "Approved");
        assertNotNull(response);
        assertEquals("Approved", response.getStatus());
        assertEquals("P-2025-001", response.getProposalId());
    }

    @Test
    @DisplayName("Should reject invalid status update")
    void testUpdateStatusInvalid() {
        BusinessValidationException ex = assertThrows(BusinessValidationException.class, () ->
                proposalService.updateProposalStatus("P-2025-001", "Disapproved")
        );
        assertTrue(ex.getMessage().contains("Invalid status"));
    }

    @Test
    @DisplayName("Should calculate KPI metrics from repository counts")
    void testGetKpiSummary() {
        when(proposalRepository.count()).thenReturn(124L);
        when(proposalRepository.countByStatus("Pending")).thenReturn(36L);
        when(proposalRepository.countByStatus("Approved")).thenReturn(52L);
        when(proposalRepository.sumTotalAmount()).thenReturn(new BigDecimal("45200000.00"));

        ProposalKpiSummaryResponse kpis = proposalService.getKpiSummary();
        assertNotNull(kpis);
        assertEquals(124L, kpis.getTotalProposals());
        assertEquals(36L, kpis.getPendingDecisions());
        assertEquals(52L, kpis.getApprovedProposals());
        assertEquals(new BigDecimal("45200000.00"), kpis.getTotalProposalValue());
    }
}
