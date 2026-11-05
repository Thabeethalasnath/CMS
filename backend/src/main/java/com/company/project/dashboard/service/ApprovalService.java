package com.company.project.dashboard.service;

import com.company.project.dashboard.dto.ApprovalsResponse;
import com.company.project.dashboard.dto.CreateClientApprovalRequest;
import com.company.project.dashboard.dto.CreateEmployeeApprovalRequest;
import com.company.project.dashboard.dto.CreateTicketAssetApprovalRequest;
import com.company.project.dashboard.entity.ClientApproval;
import com.company.project.dashboard.entity.EmployeeApproval;
import com.company.project.dashboard.entity.TicketAssetApproval;

public interface ApprovalService {
    ApprovalsResponse getAllApprovals();

    EmployeeApproval updateEmployeeStatus(Long id, String status);

    EmployeeApproval createEmployeeApproval(EmployeeApproval request);

    EmployeeApproval createEmployeeApproval(CreateEmployeeApprovalRequest request);

    ClientApproval updateClientStatus(Long id, String status);

    ClientApproval createClientApproval(ClientApproval request);

    ClientApproval createClientApproval(CreateClientApprovalRequest request);

    TicketAssetApproval updateTicketAssetStatus(Long id, String status);

    TicketAssetApproval createTicketAssetApproval(TicketAssetApproval request);

    TicketAssetApproval createTicketAssetApproval(CreateTicketAssetApprovalRequest request);

    void resetSeedData();
}

