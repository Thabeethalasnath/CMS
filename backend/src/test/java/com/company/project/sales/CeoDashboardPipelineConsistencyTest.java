package com.company.project.sales;

import com.company.project.collections.repository.CollectionInvoiceRepository;
import com.company.project.collections.repository.CollectionPaymentRepository;
import com.company.project.dashboard.dto.CeoDashboardResponse;
import com.company.project.dashboard.dto.OpportunitySummaryDto;
import com.company.project.dashboard.entity.DashboardKpiCard;
import com.company.project.dashboard.entity.Opportunity;
import com.company.project.dashboard.repository.*;
import com.company.project.dashboard.service.DashboardService;
import com.company.project.dashboard.service.OpportunityServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CeoDashboardPipelineConsistencyTest {

    @Mock
    private DashboardKpiCardRepository kpiCardRepository;
    @Mock
    private FinanceMonthlyRepository financeMonthlyRepository;
    @Mock
    private ExpenseBreakdownRepository expenseBreakdownRepository;
    @Mock
    private SalesPipelineStageRepository salesPipelineStageRepository;
    @Mock
    private ProjectStatusDistributionRepository projectStatusDistributionRepository;
    @Mock
    private PeopleMonthlyRepository peopleMonthlyRepository;
    @Mock
    private PeopleSummaryRepository peopleSummaryRepository;
    @Mock
    private ManagementAlertRepository managementAlertRepository;
    @Mock
    private DashboardSettingsRepository dashboardSettingsRepository;
    @Mock
    private OpportunityRepository opportunityRepository;
    @Mock
    private FollowUpItemRepository followUpItemRepository;
    @Mock
    private EmployeeApprovalRepository employeeApprovalRepository;
    @Mock
    private ClientApprovalRepository clientApprovalRepository;
    @Mock
    private TicketAssetApprovalRepository ticketAssetApprovalRepository;
    @Mock
    private EmployeeMasterRepository employeeMasterRepository;
    @Mock
    private CollectionInvoiceRepository collectionInvoiceRepository;
    @Mock
    private CollectionPaymentRepository collectionPaymentRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @InjectMocks
    private OpportunityServiceImpl opportunityService;

    @Test
    @DisplayName("Assert that CEO Dashboard weighted sales pipeline matches Opportunity Summary weighted pipeline")
    void assertPipelineMatchesAcrossCeoDashboardAndOpportunities() {
        BigDecimal weightedSum = new BigDecimal("4500000.00");

        // Mock OpportunityRepository for both services
        when(opportunityRepository.sumWeightedPipeline()).thenReturn(weightedSum);

        Opportunity opp1 = Opportunity.builder()
                .id(1L)
                .opportunityId("O-2025-001")
                .stage("Proposal")
                .status("Active")
                .probability(60)
                .estimatedValue(new BigDecimal("5000000.00"))
                .weightedPipeline(new BigDecimal("3000000.00"))
                .build();

        Opportunity opp2 = Opportunity.builder()
                .id(2L)
                .opportunityId("O-2025-002")
                .stage("Negotiation")
                .status("Active")
                .probability(75)
                .estimatedValue(new BigDecimal("2000000.00"))
                .weightedPipeline(new BigDecimal("1500000.00"))
                .build();

        when(opportunityRepository.findAll()).thenReturn(List.of(opp1, opp2));

        DashboardKpiCard pipelineCard = new DashboardKpiCard();
        pipelineCard.setId(4L);
        pipelineCard.setCardKey("weighted_sales_pipeline");
        pipelineCard.setTitle("Weighted Sales Pipeline");
        pipelineCard.setSortOrder(4);

        when(kpiCardRepository.findAllByOrderBySortOrderAsc()).thenReturn(new ArrayList<>(List.of(pipelineCard)));

        // 1. Get CEO Dashboard response
        CeoDashboardResponse dashboardResponse = dashboardService.getCeoDashboard();
        assertNotNull(dashboardResponse);

        DashboardKpiCard card = dashboardResponse.getKpis().stream()
                .filter(c -> "weighted_sales_pipeline".equalsIgnoreCase(c.getCardKey()))
                .findFirst()
                .orElse(null);
        assertNotNull(card);

        // 2. Get Opportunity Summary response
        OpportunitySummaryDto oppSummary = opportunityService.getSummary();
        assertNotNull(oppSummary);

        // Assert that both use the exact same weighted pipeline calculation
        assertEquals(card.getRawValue(), oppSummary.getWeightedPipeline());
        assertEquals(weightedSum, card.getRawValue());
    }
}
