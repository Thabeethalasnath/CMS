package com.company.project.dashboard.service;

import com.company.project.common.exception.ResourceNotFoundException;
import com.company.project.dashboard.dto.ApprovalsResponse;
import com.company.project.dashboard.dto.ApprovalsSummaryDto;
import com.company.project.dashboard.entity.ClientApproval;
import com.company.project.dashboard.entity.EmployeeApproval;
import com.company.project.dashboard.entity.TicketAssetApproval;
import com.company.project.dashboard.repository.ClientApprovalRepository;
import com.company.project.dashboard.repository.EmployeeApprovalRepository;
import com.company.project.dashboard.repository.TicketAssetApprovalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApprovalServiceImpl implements ApprovalService {

    private final EmployeeApprovalRepository employeeRepo;
    private final ClientApprovalRepository clientRepo;
    private final TicketAssetApprovalRepository ticketAssetRepo;

    @Override
    @Transactional(readOnly = true)
    public ApprovalsResponse getAllApprovals() {
        List<EmployeeApproval> employees = employeeRepo.findAllByOrderBySortOrderAscIdAsc();
        List<ClientApproval> clients = clientRepo.findAllByOrderBySortOrderAscIdAsc();
        List<TicketAssetApproval> ticketsAssets = ticketAssetRepo.findAllByOrderBySortOrderAscIdAsc();

        long pending = 0;
        long approved = 0;
        long rejected = 0;

        for (EmployeeApproval e : employees) {
            if ("Pending".equalsIgnoreCase(e.getStatus())) pending++;
            else if ("Approved".equalsIgnoreCase(e.getStatus())) approved++;
            else if ("Rejected".equalsIgnoreCase(e.getStatus())) rejected++;
        }

        for (ClientApproval c : clients) {
            if ("Pending".equalsIgnoreCase(c.getStatus())) pending++;
            else if ("Approved".equalsIgnoreCase(c.getStatus())) approved++;
            else if ("Rejected".equalsIgnoreCase(c.getStatus())) rejected++;
        }

        for (TicketAssetApproval t : ticketsAssets) {
            if ("Pending".equalsIgnoreCase(t.getStatus())) pending++;
            else if ("Approved".equalsIgnoreCase(t.getStatus())) approved++;
            else if ("Rejected".equalsIgnoreCase(t.getStatus())) rejected++;
        }

        long total = pending + approved + rejected;

        return ApprovalsResponse.builder()
                .employees(employees)
                .clients(clients)
                .ticketsAssets(ticketsAssets)
                .summary(ApprovalsSummaryDto.builder()
                        .total(total)
                        .pending(pending)
                        .approved(approved)
                        .rejected(rejected)
                        .build())
                .build();
    }

    @Override
    @Transactional
    public EmployeeApproval updateEmployeeStatus(Long id, String status) {
        EmployeeApproval item = employeeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee approval not found with ID: " + id));
        item.setStatus(status);
        return employeeRepo.save(item);
    }

    @Override
    @Transactional
    public EmployeeApproval createEmployeeApproval(EmployeeApproval request) {
        if (request.getStatus() == null || request.getStatus().isBlank()) {
            request.setStatus("Pending");
        }
        if (request.getSortOrder() == null) {
            request.setSortOrder((int) employeeRepo.count() + 1);
        }
        return employeeRepo.save(request);
    }

    @Override
    @Transactional
    public ClientApproval updateClientStatus(Long id, String status) {
        ClientApproval item = clientRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client approval not found with ID: " + id));
        item.setStatus(status);
        return clientRepo.save(item);
    }

    @Override
    @Transactional
    public ClientApproval createClientApproval(ClientApproval request) {
        if (request.getStatus() == null || request.getStatus().isBlank()) {
            request.setStatus("Pending");
        }
        if (request.getApprovalId() == null || request.getApprovalId().isBlank()) {
            long count = clientRepo.count() + 1;
            request.setApprovalId(String.format("APP-CL-%03d", count));
        }
        if (request.getSortOrder() == null) {
            request.setSortOrder((int) clientRepo.count() + 1);
        }
        return clientRepo.save(request);
    }

    @Override
    @Transactional
    public TicketAssetApproval updateTicketAssetStatus(Long id, String status) {
        TicketAssetApproval item = ticketAssetRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket/Asset approval not found with ID: " + id));
        item.setStatus(status);
        return ticketAssetRepo.save(item);
    }

    @Override
    @Transactional
    public TicketAssetApproval createTicketAssetApproval(TicketAssetApproval request) {
        if (request.getStatus() == null || request.getStatus().isBlank()) {
            request.setStatus("Pending");
        }
        if (request.getApprovalId() == null || request.getApprovalId().isBlank()) {
            long count = ticketAssetRepo.count() + 1;
            request.setApprovalId(String.format("APP-TK-%03d", count));
        }
        if (request.getSortOrder() == null) {
            request.setSortOrder((int) ticketAssetRepo.count() + 1);
        }
        return ticketAssetRepo.save(request);
    }

    @Override
    @Transactional
    public void resetSeedData() {
        employeeRepo.deleteAllInBatch();
        clientRepo.deleteAllInBatch();
        ticketAssetRepo.deleteAllInBatch();

        // 1. Employee Approvals
        List<EmployeeApproval> empList = new ArrayList<>();
        empList.add(EmployeeApproval.builder().employeeName("Arun S").employeeCode("EMP-0012").requestType("Sick Leave").appliedDate("12 Mar 2025").fromDate("14 Mar 2025").toDate("16 Mar 2025").duration("3 days").reason("Not feeling well due to fever.").status("Pending").sortOrder(1).build());
        empList.add(EmployeeApproval.builder().employeeName("Priya D").employeeCode("EMP-0045").requestType("Work From Home").appliedDate("11 Mar 2025").fromDate("12 Mar 2025").toDate("13 Mar 2025").duration("2 days").reason("Personal work at home.").status("Pending").sortOrder(2).build());
        empList.add(EmployeeApproval.builder().employeeName("Rahul K").employeeCode("EMP-0032").requestType("Earned Leave").appliedDate("10 Mar 2025").fromDate("18 Mar 2025").toDate("20 Mar 2025").duration("3 days").reason("Family function.").status("Approved").sortOrder(3).build());
        empList.add(EmployeeApproval.builder().employeeName("Sneha K").employeeCode("EMP-0051").requestType("Sick Leave").appliedDate("09 Mar 2025").fromDate("09 Mar 2025").toDate("10 Mar 2025").duration("2 days").reason("Medical checkup.").status("Rejected").sortOrder(4).build());
        empList.add(EmployeeApproval.builder().employeeName("Manoj J").employeeCode("EMP-0021").requestType("Work From Home").appliedDate("08 Mar 2025").fromDate("10 Mar 2025").toDate("11 Mar 2025").duration("2 days").reason("Home repair work.").status("Pending").sortOrder(5).build());
        empList.add(EmployeeApproval.builder().employeeName("Ananya Roy").employeeCode("EMP-0019").requestType("Casual Leave").appliedDate("07 Mar 2025").fromDate("12 Mar 2025").toDate("12 Mar 2025").duration("1 day").reason("Personal appointment.").status("Approved").sortOrder(6).build());
        empList.add(EmployeeApproval.builder().employeeName("Vikram Singh").employeeCode("EMP-0028").requestType("Earned Leave").appliedDate("06 Mar 2025").fromDate("21 Mar 2025").toDate("25 Mar 2025").duration("5 days").reason("Annual vacation with family.").status("Approved").sortOrder(7).build());
        empList.add(EmployeeApproval.builder().employeeName("Kavita Nair").employeeCode("EMP-0062").requestType("Work From Home").appliedDate("05 Mar 2025").fromDate("06 Mar 2025").toDate("07 Mar 2025").duration("2 days").reason("Mild sprain recovery.").status("Pending").sortOrder(8).build());
        employeeRepo.saveAll(empList);

        // 2. Client Approvals
        List<ClientApproval> clList = new ArrayList<>();
        clList.add(ClientApproval.builder().approvalId("APP-CL-001").clientName("Acme Corp").requestType("Invoice Approval").referenceId("INV-2025-089").requester("Rajesh Verma").requestDate("11 Mar 2025").dueDate("15 Mar 2025").amount("₹ 1,45,000").status("Pending").sortOrder(1).build());
        clList.add(ClientApproval.builder().approvalId("APP-CL-002").clientName("Nexus Retail").requestType("Discount Approval").referenceId("DISC-Q1-012").requester("Priya Sharma").requestDate("10 Mar 2025").dueDate("14 Mar 2025").amount("₹ 35,000").status("Approved").sortOrder(2).build());
        clList.add(ClientApproval.builder().approvalId("APP-CL-003").clientName("Zenith Global").requestType("Contract Approval").referenceId("CONT-2025-04").requester("Vikram Roy").requestDate("08 Mar 2025").dueDate("12 Mar 2025").amount("₹ 8,50,000").status("Pending").sortOrder(3).build());
        clList.add(ClientApproval.builder().approvalId("APP-CL-004").clientName("Apex Infra").requestType("Invoice Approval").referenceId("INV-2025-094").requester("Sneha Gupta").requestDate("07 Mar 2025").dueDate("10 Mar 2025").amount("₹ 2,20,000").status("Approved").sortOrder(4).build());
        clList.add(ClientApproval.builder().approvalId("APP-CL-005").clientName("Starlight Media").requestType("Scope Change Approval").referenceId("CR-2025-03").requester("Amit Joshi").requestDate("05 Mar 2025").dueDate("08 Mar 2025").amount("₹ 75,000").status("Rejected").sortOrder(5).build());
        clientRepo.saveAll(clList);

        // 3. Ticket / Asset Approvals
        List<TicketAssetApproval> taList = new ArrayList<>();
        taList.add(TicketAssetApproval.builder().approvalId("APP-TK-001").recordType("Ticket").recordCode("TKT-4412").title("Server Disk Space Upgrade").clientRequester("FinEdge Systems").approvalType("Infra / Cloud").priority("High").requestDate("12 Mar 2025").assignedApprover("Dinesh Kumar").status("Pending").sortOrder(1).build());
        taList.add(TicketAssetApproval.builder().approvalId("APP-AST-002").recordType("Asset").recordCode("AST-089").title("MacBook Pro M3 Allocation").clientRequester("Suman Rao (UI/UX)").approvalType("Asset Allocation").priority("Medium").requestDate("11 Mar 2025").assignedApprover("Neha Mehta").status("Approved").sortOrder(2).build());
        taList.add(TicketAssetApproval.builder().approvalId("APP-TK-003").recordType("Ticket").recordCode("TKT-4389").title("Production Hotfix Deployment").clientRequester("CloudNine Ltd").approvalType("Bug / Hotfix").priority("High").requestDate("10 Mar 2025").assignedApprover("Rajesh Verma").status("Approved").sortOrder(3).build());
        taList.add(TicketAssetApproval.builder().approvalId("APP-AST-004").recordType("Asset").recordCode("AST-094").title("Ergonomic Chair Request").clientRequester("Manoj Patel (Eng)").approvalType("Hardware Asset").priority("Low").requestDate("09 Mar 2025").assignedApprover("Admin Team").status("Pending").sortOrder(4).build());
        taList.add(TicketAssetApproval.builder().approvalId("APP-TK-005").recordType("Ticket").recordCode("TKT-4350").title("Firewall Rule Exception").clientRequester("CoreBank Corp").approvalType("Security / Access").priority("High").requestDate("08 Mar 2025").assignedApprover("Security Lead").status("Rejected").sortOrder(5).build());
        taList.add(TicketAssetApproval.builder().approvalId("APP-AST-006").recordType("Asset").recordCode("AST-101").title("Dual Monitor Setup").clientRequester("Priya Sharma (PM)").approvalType("Asset Allocation").priority("Low").requestDate("06 Mar 2025").assignedApprover("IT Support").status("Approved").sortOrder(6).build());
        ticketAssetRepo.saveAll(taList);

        log.info("Reset and seeded all approval data.");
    }
}

