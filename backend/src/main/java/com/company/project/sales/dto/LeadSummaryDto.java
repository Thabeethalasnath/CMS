package com.company.project.sales.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadSummaryDto {
    private long totalLeads;
    private long newThisMonth;
    private long followUpsDue;
    private long convertedLeads;
    
    // MoM trend percentages (null when no historical baseline)
    private Double totalLeadsMoM;
    private Double newLeadsMoM;
    private Double followUpsDueMoM;
    private Double convertedMoM;
    
    private String lastUpdated;
}
