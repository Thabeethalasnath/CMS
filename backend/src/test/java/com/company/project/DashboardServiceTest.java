package com.company.project;

import com.company.project.common.exception.ResourceNotFoundException;
import com.company.project.dashboard.dto.CeoDashboardResponse;
import com.company.project.dashboard.entity.*;
import com.company.project.dashboard.repository.*;
import com.company.project.dashboard.service.DashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

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
    private com.company.project.collections.repository.CollectionInvoiceRepository collectionInvoiceRepository;
    @Mock
    private com.company.project.collections.repository.CollectionPaymentRepository collectionPaymentRepository;

    @InjectMocks
    private DashboardService service;

    private DashboardKpiCard sampleKpi;
    private ManagementAlert sampleAlert;

    @BeforeEach
    void setUp() {
        sampleKpi = new DashboardKpiCard();
        sampleKpi.setId(1L);
        sampleKpi.setCardKey("weighted_sales_pipeline");
        sampleKpi.setTitle("Weighted Sales Pipeline");
        sampleKpi.setRawValue(new BigDecimal("100000"));
        sampleKpi.setFormattedValue("₹ 1,00,000");
        sampleKpi.setSortOrder(1);

        sampleAlert = new ManagementAlert();
        sampleAlert.setId(1L);
        sampleAlert.setAlertKey("pending_approvals");
        sampleAlert.setTitle("Pending Approvals");
        sampleAlert.setAlertCount(0);
        sampleAlert.setSortOrder(1);
    }

    @Test
    @DisplayName("getCeoDashboard should assemble all sections and synchronize cross-page metrics")
    void testGetCeoDashboard() {
        DashboardSettings settings = new DashboardSettings();
        settings.setCompanyName("KALPANAAA SOFTWARE SOLUTIONS");
        settings.setDashboardTitle("CEO Dashboard");

        PeopleSummary peopleSummary = new PeopleSummary();
        peopleSummary.setActiveEmployees(48);

        when(dashboardSettingsRepository.findAll()).thenReturn(List.of(settings));
        when(kpiCardRepository.findAllByOrderBySortOrderAsc()).thenReturn(new ArrayList<>(List.of(sampleKpi)));
        when(financeMonthlyRepository.findAllByOrderBySortOrderAsc()).thenReturn(List.of());
        when(expenseBreakdownRepository.findAllByOrderBySortOrderAsc()).thenReturn(List.of());
        when(salesPipelineStageRepository.findAllByOrderBySortOrderAsc()).thenReturn(List.of());
        when(projectStatusDistributionRepository.findAllByOrderBySortOrderAsc()).thenReturn(List.of());
        when(peopleMonthlyRepository.findAllByOrderBySortOrderAsc()).thenReturn(List.of());
        when(peopleSummaryRepository.findAll()).thenReturn(List.of(peopleSummary));
        when(managementAlertRepository.findAllByOrderBySortOrderAsc()).thenReturn(new ArrayList<>(List.of(sampleAlert)));

        when(employeeApprovalRepository.countByStatusIgnoreCase("Pending")).thenReturn(4L);
        when(clientApprovalRepository.countByStatusIgnoreCase("Pending")).thenReturn(2L);

        when(opportunityRepository.sumWeightedPipeline()).thenReturn(new BigDecimal("5000000"));

        CeoDashboardResponse response = service.getCeoDashboard();

        assertNotNull(response);
        assertEquals("CEO Dashboard", response.getSettings().getDashboardTitle());
        // Verify cross-page pending approvals sync: 4 + 2 = 6
        assertEquals(6, response.getAlerts().get(0).getAlertCount());
        // Verify weighted sales pipeline sync: 5,000,000
        assertEquals(new BigDecimal("5000000"), response.getKpis().get(0).getRawValue());
    }

    @Test
    @DisplayName("updateKpi should update kpi card and save")
    void testUpdateKpiSuccess() {
        when(kpiCardRepository.findById(1L)).thenReturn(Optional.of(sampleKpi));
        when(kpiCardRepository.save(any(DashboardKpiCard.class))).thenAnswer(invocation -> invocation.getArgument(0));

        DashboardKpiCard updateReq = new DashboardKpiCard();
        updateReq.setFormattedValue("₹ 2,00,000");
        updateReq.setRawValue(new BigDecimal("200000"));

        DashboardKpiCard updated = service.updateKpi(1L, updateReq);

        assertNotNull(updated);
        assertEquals("₹ 2,00,000", updated.getFormattedValue());
        assertEquals(new BigDecimal("200000"), updated.getRawValue());
    }

    @Test
    @DisplayName("updateKpi should throw ResourceNotFoundException when KPI missing")
    void testUpdateKpiNotFound() {
        when(kpiCardRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.updateKpi(999L, sampleKpi));
    }

    @Test
    @DisplayName("updateAlert should increment alert count and clamp to zero on negative delta")
    void testUpdateAlert() {
        when(managementAlertRepository.findById(1L)).thenReturn(Optional.of(sampleAlert));
        when(managementAlertRepository.save(any(ManagementAlert.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ManagementAlert updated = service.updateAlert(1L, 5);
        assertEquals(5, updated.getAlertCount());

        ManagementAlert clamped = service.updateAlert(1L, -10);
        assertEquals(0, clamped.getAlertCount());
    }

    @Test
    @DisplayName("updateAlert should throw ResourceNotFoundException when alert missing")
    void testUpdateAlertNotFound() {
        when(managementAlertRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.updateAlert(999L, 1));
    }
}

