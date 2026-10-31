package com.company.project;

import com.company.project.common.exception.ResourceNotFoundException;
import com.company.project.dashboard.dto.CreateOpportunityRequest;
import com.company.project.dashboard.dto.OpportunityDto;
import com.company.project.dashboard.dto.OpportunitySummaryDto;
import com.company.project.dashboard.entity.Opportunity;
import com.company.project.dashboard.repository.OpportunityRepository;
import com.company.project.dashboard.service.OpportunityServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OpportunityServiceTest {

    @Mock
    private OpportunityRepository repository;

    @InjectMocks
    private OpportunityServiceImpl service;

    private Opportunity sampleOpportunity;

    @BeforeEach
    void setUp() {
        sampleOpportunity = Opportunity.builder()
                .id(1L)
                .opportunityId("O-2025-001")
                .leadId("L-2025-001")
                .clientId("C-001")
                .opportunityName("Website Redesign Project")
                .ownerId("EMP-001")
                .serviceId("S-001")
                .stage("New")
                .probability(20)
                .estimatedValue(new BigDecimal("500000"))
                .expectedCloseDate("20 Apr 2025")
                .lastContact("15 Mar 2025")
                .nextFollowUp("18 Mar 2025")
                .status("Open")
                .lostReason("-")
                .weightedPipeline(new BigDecimal("100000"))
                .orderIndex(1)
                .build();
    }

    @Test
    @DisplayName("getAllOpportunities without filters should query findAllByOrderByOrderIndexAscCreatedAtAsc")
    void testGetAllOpportunitiesNoFilters() {
        when(repository.findAllByOrderByOrderIndexAscCreatedAtAsc()).thenReturn(List.of(sampleOpportunity));

        List<OpportunityDto> result = service.getAllOpportunities(null, null, null, null, null, null);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Website Redesign Project", result.get(0).getOpportunityName());
        assertEquals("O-2025-001", result.get(0).getOpportunityId());
    }

    @Test
    @DisplayName("getAllOpportunities with filters should call searchOpportunities")
    void testGetAllOpportunitiesWithFilters() {
        when(repository.searchOpportunities("New", "Open", null, null, null, null))
                .thenReturn(List.of(sampleOpportunity));

        List<OpportunityDto> result = service.getAllOpportunities("New", "Open", "All", null, null, null);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(repository).searchOpportunities("New", "Open", null, null, null, null);
    }

    @Test
    @DisplayName("getSummary should calculate open, won, and weighted sums accurately")
    void testGetSummary() {
        Opportunity wonOpp = Opportunity.builder()
                .id(2L)
                .stage("Won")
                .status("Won")
                .weightedPipeline(new BigDecimal("200000"))
                .build();

        when(repository.findAll()).thenReturn(List.of(sampleOpportunity, wonOpp));

        OpportunitySummaryDto summary = service.getSummary();

        assertNotNull(summary);
        assertEquals(2L, summary.getTotalOpportunities());
        assertEquals(1L, summary.getOpenOpportunities());
        assertEquals(1L, summary.getWonOpportunities());
        assertEquals(new BigDecimal("300000"), summary.getWeightedPipeline());
        assertTrue(summary.getWeightedPipelineFormatted().contains("300,000") || summary.getWeightedPipelineFormatted().contains("3,00,000"));
    }

    @Test
    @DisplayName("getById should return mapped DTO when opportunity exists")
    void testGetByIdFound() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleOpportunity));

        OpportunityDto result = service.getById(1L);

        assertNotNull(result);
        assertEquals("O-2025-001", result.getOpportunityId());
        assertEquals("Website Redesign Project", result.getOpportunityName());
    }

    @Test
    @DisplayName("getById should throw ResourceNotFoundException when opportunity does not exist")
    void testGetByIdNotFound() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.getById(999L));
    }

    @Test
    @DisplayName("createOpportunity should compute weighted pipeline and auto-generate ID")
    void testCreateOpportunity() {
        CreateOpportunityRequest request = CreateOpportunityRequest.builder()
                .opportunityName("Mobile App MVP")
                .clientId("C-002")
                .ownerId("EMP-002")
                .serviceId("S-002")
                .stage("Qualified")
                .probability(50)
                .estimatedValue(new BigDecimal("1000000"))
                .status("Open")
                .build();

        String expectedId = "O-" + java.time.LocalDate.now().getYear() + "-002";
        when(repository.count()).thenReturn(1L);
        when(repository.findByOpportunityId(expectedId)).thenReturn(Optional.empty());
        when(repository.save(any(Opportunity.class))).thenAnswer(invocation -> {
            Opportunity o = invocation.getArgument(0);
            o.setId(2L);
            return o;
        });

        OpportunityDto created = service.createOpportunity(request);

        assertNotNull(created);
        assertEquals("Mobile App MVP", created.getOpportunityName());
        assertEquals(expectedId, created.getOpportunityId());
        assertEquals(new BigDecimal("500000"), created.getWeightedPipeline());
    }

    @Test
    @DisplayName("updateOpportunity should update fields and recalculate weighted pipeline")
    void testUpdateOpportunity() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleOpportunity));
        when(repository.save(any(Opportunity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CreateOpportunityRequest updateReq = CreateOpportunityRequest.builder()
                .opportunityName("Renamed Project")
                .probability(80)
                .estimatedValue(new BigDecimal("500000"))
                .stage("Proposal")
                .status("In Progress")
                .build();

        OpportunityDto updated = service.updateOpportunity(1L, updateReq);

        assertNotNull(updated);
        assertEquals("Renamed Project", updated.getOpportunityName());
        assertEquals("Proposal", updated.getStage());
        assertEquals(new BigDecimal("400000"), updated.getWeightedPipeline());
    }

    @Test
    @DisplayName("deleteOpportunity should remove record when exists")
    void testDeleteOpportunitySuccess() {
        when(repository.existsById(1L)).thenReturn(true);
        doNothing().when(repository).deleteById(1L);

        assertDoesNotThrow(() -> service.deleteOpportunity(1L));
        verify(repository).deleteById(1L);
    }

    @Test
    @DisplayName("deleteOpportunity should throw ResourceNotFoundException when ID does not exist")
    void testDeleteOpportunityNotFound() {
        when(repository.existsById(999L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> service.deleteOpportunity(999L));
        verify(repository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("resetSeedData should delete in batch and repopulate 8 seed records")
    void testResetSeedData() {
        doNothing().when(repository).deleteAllInBatch();
        when(repository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        service.resetSeedData();

        verify(repository).deleteAllInBatch();
        verify(repository).saveAll(argThat(list -> ((List<?>) list).size() == 8));
    }
}
