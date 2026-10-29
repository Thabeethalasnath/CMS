package com.company.project.dashboard.service;

import com.company.project.dashboard.dto.ActionRequest;
import com.company.project.dashboard.dto.CreateFollowUpItemRequest;
import com.company.project.dashboard.dto.FollowUpItemDto;
import com.company.project.dashboard.dto.FollowUpSummaryDto;

import java.util.List;

public interface FollowUpService {

    List<FollowUpItemDto> getAllItems(String priority, String search);

    FollowUpSummaryDto getSummary();

    FollowUpItemDto getItemById(Long id);

    FollowUpItemDto createItem(CreateFollowUpItemRequest request);

    FollowUpItemDto updateItem(Long id, CreateFollowUpItemRequest request);

    FollowUpItemDto toggleDone(Long id);

    FollowUpItemDto performAction(Long id, ActionRequest actionRequest);

    void deleteItem(Long id);

    void resetSeedData();
}
