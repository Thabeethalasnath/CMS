package com.company.project.hr.service;

import com.company.project.common.response.PageResponse;
import com.company.project.hr.dto.*;

import java.util.List;

public interface EmployeeExitService {

    PageResponse<EmployeeExitResponse> getExitRecords(
            String search,
            String exitStatus,
            String exitType,
            String noticePeriod,
            String approvalStatus,
            String dateRange,
            String sort,
            int page,
            int size
    );

    List<EmployeeExitResponse> getAllFilteredExitRecords(
            String search,
            String exitStatus,
            String exitType,
            String noticePeriod,
            String approvalStatus,
            String dateRange,
            String sort
    );

    EmployeeExitResponse getExitRecordById(String exitId);

    EmployeeExitResponse createExitRecord(CreateEmployeeExitRequest request);

    EmployeeExitResponse updateExitRecord(String exitId, UpdateEmployeeExitRequest request);

    void deleteExitRecord(String exitId);

    EmployeeExitKpiResponse getKpis();

    NextExitIdResponse getNextExitId();

    EmployeeExitFilterOptionsResponse getFilterOptions();
}

