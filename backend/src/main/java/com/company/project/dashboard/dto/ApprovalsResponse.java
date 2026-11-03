package com.company.project.dashboard.dto;

import com.company.project.dashboard.entity.ClientApproval;
import com.company.project.dashboard.entity.EmployeeApproval;
import com.company.project.dashboard.entity.TicketAssetApproval;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalsResponse {
    private List<EmployeeApproval> employees;
    private List<ClientApproval> clients;
    private List<TicketAssetApproval> ticketsAssets;
    private ApprovalsSummaryDto summary;
}

