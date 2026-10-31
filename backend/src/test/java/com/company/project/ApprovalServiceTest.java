package com.company.project;

import com.company.project.common.exception.ResourceNotFoundException;
import com.company.project.dashboard.dto.ApprovalsResponse;
import com.company.project.dashboard.entity.ClientApproval;
import com.company.project.dashboard.entity.EmployeeApproval;
import com.company.project.dashboard.entity.TicketAssetApproval;
import com.company.project.dashboard.repository.ClientApprovalRepository;
import com.company.project.dashboard.repository.EmployeeApprovalRepository;
import com.company.project.dashboard.repository.TicketAssetApprovalRepository;
import com.company.project.dashboard.service.ApprovalServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApprovalServiceTest {

    @Mock
    private EmployeeApprovalRepository employeeRepo;

    @Mock
    private ClientApprovalRepository clientRepo;

    @Mock
    private TicketAssetApprovalRepository ticketAssetRepo;

    @InjectMocks
    private ApprovalServiceImpl service;

    private EmployeeApproval sampleEmployee;
    private ClientApproval sampleClient;
    private TicketAssetApproval sampleTicketAsset;

    @BeforeEach
    void setUp() {
        sampleEmployee = EmployeeApproval.builder()
                .id(1L)
                .employeeName("Arun S")
                .employeeCode("EMP-0012")
                .requestType("Sick Leave")
                .status("Pending")
                .sortOrder(1)
                .build();

        sampleClient = ClientApproval.builder()
                .id(1L)
                .approvalId("APP-CL-001")
                .clientName("Acme Corp")
                .status("Pending")
                .sortOrder(1)
                .build();

        sampleTicketAsset = TicketAssetApproval.builder()
                .id(1L)
                .approvalId("APP-TK-001")
                .title("Server Disk Space Upgrade")
                .status("Pending")
                .sortOrder(1)
                .build();
    }

    @Test
    @DisplayName("getAllApprovals should aggregate employees, clients, tickets and summary counts")
    void testGetAllApprovals() {
        when(employeeRepo.findAllByOrderBySortOrderAscIdAsc()).thenReturn(List.of(sampleEmployee));
        when(clientRepo.findAllByOrderBySortOrderAscIdAsc()).thenReturn(List.of(sampleClient));
        when(ticketAssetRepo.findAllByOrderBySortOrderAscIdAsc()).thenReturn(List.of(sampleTicketAsset));
        when(employeeRepo.countByStatusIgnoreCase("Pending")).thenReturn(1L);
        when(clientRepo.countByStatusIgnoreCase("Pending")).thenReturn(1L);
        when(ticketAssetRepo.countByStatusIgnoreCase("Pending")).thenReturn(1L);

        ApprovalsResponse response = service.getAllApprovals();

        assertNotNull(response);
        assertEquals(1, response.getEmployees().size());
        assertEquals(1, response.getClients().size());
        assertEquals(1, response.getTicketsAssets().size());
        assertEquals(3, response.getSummary().getTotal());
        assertEquals(3, response.getSummary().getPending());
        assertEquals(0, response.getSummary().getApproved());
    }

    @Test
    @DisplayName("updateEmployeeStatus should update status when employee approval exists")
    void testUpdateEmployeeStatusSuccess() {
        when(employeeRepo.findById(1L)).thenReturn(Optional.of(sampleEmployee));
        when(employeeRepo.save(any(EmployeeApproval.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EmployeeApproval updated = service.updateEmployeeStatus(1L, "Approved");

        assertNotNull(updated);
        assertEquals("Approved", updated.getStatus());
        verify(employeeRepo).save(sampleEmployee);
    }

    @Test
    @DisplayName("updateEmployeeStatus should throw ResourceNotFoundException when ID missing")
    void testUpdateEmployeeStatusNotFound() {
        when(employeeRepo.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.updateEmployeeStatus(999L, "Approved"));
    }

    @Test
    @DisplayName("createEmployeeApproval should default status to Pending and set sortOrder")
    void testCreateEmployeeApproval() {
        EmployeeApproval newReq = EmployeeApproval.builder()
                .employeeName("Jane Doe")
                .employeeCode("EMP-0099")
                .requestType("Casual Leave")
                .build();

        when(employeeRepo.count()).thenReturn(5L);
        when(employeeRepo.save(any(EmployeeApproval.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EmployeeApproval created = service.createEmployeeApproval(newReq);

        assertNotNull(created);
        assertEquals("Pending", created.getStatus());
        assertEquals(6, created.getSortOrder());
    }

    @Test
    @DisplayName("updateClientStatus should update status when client approval exists")
    void testUpdateClientStatusSuccess() {
        when(clientRepo.findById(1L)).thenReturn(Optional.of(sampleClient));
        when(clientRepo.save(any(ClientApproval.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ClientApproval updated = service.updateClientStatus(1L, "Rejected");

        assertNotNull(updated);
        assertEquals("Rejected", updated.getStatus());
    }

    @Test
    @DisplayName("updateClientStatus should throw ResourceNotFoundException when ID missing")
    void testUpdateClientStatusNotFound() {
        when(clientRepo.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.updateClientStatus(999L, "Rejected"));
    }

    @Test
    @DisplayName("createClientApproval should auto-generate approvalId if blank")
    void testCreateClientApproval() {
        ClientApproval newClient = ClientApproval.builder()
                .clientName("Beta Solutions")
                .requestType("Proposal Approval")
                .build();

        when(clientRepo.count()).thenReturn(2L);
        when(clientRepo.save(any(ClientApproval.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ClientApproval created = service.createClientApproval(newClient);

        assertNotNull(created);
        assertTrue(created.getApprovalId().matches("^APP-\\d{4}-003$"));
        assertEquals("Pending", created.getStatus());
    }

    @Test
    @DisplayName("updateTicketAssetStatus should update status when ticket/asset exists")
    void testUpdateTicketAssetStatusSuccess() {
        when(ticketAssetRepo.findById(1L)).thenReturn(Optional.of(sampleTicketAsset));
        when(ticketAssetRepo.save(any(TicketAssetApproval.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TicketAssetApproval updated = service.updateTicketAssetStatus(1L, "Approved");

        assertNotNull(updated);
        assertEquals("Approved", updated.getStatus());
    }

    @Test
    @DisplayName("updateTicketAssetStatus should throw ResourceNotFoundException when ID missing")
    void testUpdateTicketAssetStatusNotFound() {
        when(ticketAssetRepo.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.updateTicketAssetStatus(999L, "Approved"));
    }

    @Test
    @DisplayName("resetSeedData should delete and reseed all approval tables")
    void testResetSeedData() {
        doNothing().when(employeeRepo).deleteAllInBatch();
        doNothing().when(clientRepo).deleteAllInBatch();
        doNothing().when(ticketAssetRepo).deleteAllInBatch();

        service.resetSeedData();

        verify(employeeRepo).deleteAllInBatch();
        verify(clientRepo).deleteAllInBatch();
        verify(ticketAssetRepo).deleteAllInBatch();
        verify(employeeRepo).saveAll(anyList());
        verify(clientRepo).saveAll(anyList());
        verify(ticketAssetRepo).saveAll(anyList());
    }
}

