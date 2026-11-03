package com.company.project.hr.service;

import com.company.project.common.response.PageResponse;
import com.company.project.hr.dto.*;

import java.util.List;

public interface HrDashboardService {

    HrDashboardResponse getHrDashboard(String department, String period);

    default HrDashboardResponse getHrDashboard() {
        return getHrDashboard(null, null);
    }

    HrDashboardResponse refreshHrDashboard();

    PageResponse<EmployeeDto> getEmployees(String search, String department, String status, int page, int size);

    EmployeeDto createEmployee(CreateEmployeeRequest request);

    List<LeaveApprovalDto> getLeaves(String status);

    LeaveApprovalDto updateLeaveStatus(Long id, UpdateLeaveStatusRequest request);

    List<AttendanceDto> getAttendanceRecords(String date, String status);

    AttendanceDto logAttendance(LogAttendanceRequest request);

    List<CandidateDto> getCandidates(String department, Integer minDaysInPipeline);

    List<RecentActivityDto> getRecentActivities();
}
