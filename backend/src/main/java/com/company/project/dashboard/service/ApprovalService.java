package com.company.project.dashboard.service;

import com.company.project.dashboard.dto.ApprovalsResponse;
import com.company.project.dashboard.entity.ClientApproval;
import com.company.project.dashboard.entity.EmployeeApproval;
import com.company.project.dashboard.entity.TicketAssetApproval;

public interface ApprovalService {
    ApprovalsResponse getAllApprovals();

    EmployeeApproval updateEmployeeStatus(Long id, String status);

    EmployeeApproval createEmployeeApproval(EmployeeApproval request);

    ClientApproval updateClientStatus(Long id, String status);

    ClientApproval createClientApproval(ClientApproval request);

    TicketAssetApproval updateTicketAssetStatus(Long id, String status);

    TicketAssetApproval createTicketAssetApproval(TicketAssetApproval request);

    void resetSeedData();
}

