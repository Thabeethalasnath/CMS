package com.company.project.dashboard.service;

import com.company.project.dashboard.dto.CreateOpportunityRequest;
import com.company.project.dashboard.dto.OpportunityDto;
import com.company.project.dashboard.dto.OpportunitySummaryDto;

import java.util.List;

public interface OpportunityService {

    List<OpportunityDto> getAllOpportunities(
            String stage,
            String status,
            String ownerId,
            String clientId,
            String serviceId,
            String search
    );

    OpportunitySummaryDto getSummary();

    OpportunityDto getById(Long id);

    OpportunityDto createOpportunity(CreateOpportunityRequest request);

    OpportunityDto updateOpportunity(Long id, CreateOpportunityRequest request);

    void deleteOpportunity(Long id);

    void resetSeedData();
}

