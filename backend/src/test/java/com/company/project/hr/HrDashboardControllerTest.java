package com.company.project.hr;

import com.company.project.common.exception.GlobalExceptionHandler;
import com.company.project.common.response.PageResponse;
import com.company.project.hr.controller.HrDashboardController;
import com.company.project.hr.dto.*;
import com.company.project.hr.service.HrDashboardService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class HrDashboardControllerTest {

    private MockMvc mockMvc;

    @Mock
    private HrDashboardService hrDashboardService;

    @InjectMocks
    private HrDashboardController hrDashboardController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(hrDashboardController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /api/v1/hr/dashboard returns 200 with dashboard overview")
    void testGetDashboardEndpoint() throws Exception {
        HrDashboardResponse response = HrDashboardResponse.builder()
                .lastUpdated("15 Mar 2025, 10:30 AM")
                .workforce(WorkforceOverviewDto.builder().activeEmployees(10).totalMonthlyCtc("₹ 17,45,000.00").build())
                .attendance(AttendanceOverviewDto.builder().records(10).effectiveDate("31 Oct 2026").build())
                .build();

        when(hrDashboardService.getHrDashboard(any(), any())).thenReturn(response);

        mockMvc.perform(get("/api/v1/hr/dashboard?department=Engineering&period=This Month"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastUpdated").value("15 Mar 2025, 10:30 AM"))
                .andExpect(jsonPath("$.workforce.activeEmployees").value(10))
                .andExpect(jsonPath("$.attendance.effectiveDate").value("31 Oct 2026"));
    }

    @Test
    @DisplayName("GET /api/v1/hr/employees returns 200 with paginated employee directory")
    void testGetEmployeesEndpoint() throws Exception {
        EmployeeDto emp = EmployeeDto.builder()
                .id("EMP-001")
                .name("Akshit Ujjain")
                .department("Engineering")
                .role("Lead Architect")
                .email("akshit@kalpanaaa.com")
                .monthlyCtc(new BigDecimal("240000.00"))
                .joiningDate("2023-01-15")
                .status("Active")
                .build();

        PageResponse<EmployeeDto> pageResponse = PageResponse.<EmployeeDto>builder()
                .content(List.of(emp))
                .pageNumber(0)
                .pageSize(10)
                .totalElements(1)
                .totalPages(1)
                .build();

        when(hrDashboardService.getEmployees(any(), any(), any(), anyInt(), anyInt())).thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/hr/employees?search=Akshit&page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value("EMP-001"))
                .andExpect(jsonPath("$.content[0].name").value("Akshit Ujjain"));
    }

    @Test
    @DisplayName("POST /api/v1/hr/employees returns 201 with created employee")
    void testCreateEmployeeEndpoint() throws Exception {
        CreateEmployeeRequest request = CreateEmployeeRequest.builder()
                .name("Priya Sharma")
                .email("priya.s@kalpanaaa.com")
                .department("Engineering")
                .role("Fullstack Dev")
                .monthlyCtc(new BigDecimal("160000.00"))
                .joiningDate("2025-03-15")
                .status("Active")
                .build();

        EmployeeDto created = EmployeeDto.builder()
                .id("EMP-002")
                .name("Priya Sharma")
                .email("priya.s@kalpanaaa.com")
                .department("Engineering")
                .role("Fullstack Dev")
                .monthlyCtc(new BigDecimal("160000.00"))
                .joiningDate("2025-03-15")
                .status("Active")
                .build();

        when(hrDashboardService.createEmployee(any(CreateEmployeeRequest.class))).thenReturn(created);

        mockMvc.perform(post("/api/v1/hr/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("EMP-002"))
                .andExpect(jsonPath("$.email").value("priya.s@kalpanaaa.com"));
    }

    @Test
    @DisplayName("POST /api/v1/hr/employees returns 400 on invalid payload (empty email)")
    void testCreateEmployeeValidationFailure() throws Exception {
        CreateEmployeeRequest invalid = CreateEmployeeRequest.builder()
                .name("")
                .email("invalid-email")
                .department("")
                .role("")
                .monthlyCtc(BigDecimal.ZERO)
                .joiningDate("")
                .build();

        mockMvc.perform(post("/api/v1/hr/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }

    @Test
    @DisplayName("PATCH /api/v1/hr/leaves/{id}/status returns 200 with updated leave approval")
    void testUpdateLeaveStatusEndpoint() throws Exception {
        UpdateLeaveStatusRequest request = UpdateLeaveStatusRequest.builder().status("Approved").build();
        LeaveApprovalDto dto = LeaveApprovalDto.builder()
                .id(1L)
                .employeeName("Sneha Roy")
                .status("Approved")
                .build();

        when(hrDashboardService.updateLeaveStatus(eq(1L), any(UpdateLeaveStatusRequest.class))).thenReturn(dto);

        mockMvc.perform(patch("/api/v1/hr/leaves/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("Approved"));
    }

    @Test
    @DisplayName("POST /api/v1/hr/attendance returns 201 when logging attendance")
    void testLogAttendanceEndpoint() throws Exception {
        LogAttendanceRequest request = LogAttendanceRequest.builder()
                .employeeId("EMP-001")
                .employeeName("Akshit Ujjain")
                .status("Present")
                .attendanceDate("31 Oct 2026")
                .build();

        AttendanceDto dto = AttendanceDto.builder()
                .id("ATT-123")
                .employeeId("EMP-001")
                .employeeName("Akshit Ujjain")
                .attendanceDate("31 Oct 2026")
                .status("Present")
                .isLate(false)
                .build();

        when(hrDashboardService.logAttendance(any(LogAttendanceRequest.class))).thenReturn(dto);

        mockMvc.perform(post("/api/v1/hr/attendance")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("ATT-123"))
                .andExpect(jsonPath("$.status").value("Present"));
    }

    @Test
    @DisplayName("GET /api/v1/hr/candidates returns 200 with candidate pipeline list")
    void testGetCandidatesEndpoint() throws Exception {
        CandidateDto candidate = CandidateDto.builder()
                .id("CAN-101")
                .name("Aarav Patel")
                .role("Backend Lead")
                .department("Engineering")
                .status("Open")
                .createdDate("2025-01-10")
                .daysInPipeline(45L)
                .build();

        when(hrDashboardService.getCandidates(any(), any())).thenReturn(List.of(candidate));

        mockMvc.perform(get("/api/v1/hr/candidates?department=Engineering&minDaysInPipeline=30"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("CAN-101"))
                .andExpect(jsonPath("$[0].daysInPipeline").value(45));
    }

    @Test
    @DisplayName("GET /api/v1/hr/activities returns 200 with recent activity logs")
    void testGetActivitiesEndpoint() throws Exception {
        RecentActivityDto activity = RecentActivityDto.builder()
                .id("act-1")
                .date("15 Mar 2025")
                .rawDate("2025-03-15")
                .type("Employee")
                .description("New employee added")
                .status("Completed")
                .department("Engineering")
                .build();

        when(hrDashboardService.getRecentActivities()).thenReturn(List.of(activity));

        mockMvc.perform(get("/api/v1/hr/activities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("act-1"))
                .andExpect(jsonPath("$[0].type").value("Employee"));
    }

    @Test
    @DisplayName("POST /api/v1/hr/employees returns 409 Conflict with duplicate email message")
    void testCreateEmployeeDuplicateEmailConstraintReturns409() throws Exception {
        CreateEmployeeRequest request = CreateEmployeeRequest.builder()
                .name("Existing Employee")
                .email("duplicate@kalpanaaa.com")
                .department("Engineering")
                .role("Developer")
                .monthlyCtc(new BigDecimal("120000.00"))
                .joiningDate("2025-03-01")
                .status("Active")
                .build();

        when(hrDashboardService.createEmployee(any(CreateEmployeeRequest.class)))
                .thenThrow(new org.springframework.dao.DataIntegrityViolationException("duplicate key value violates unique constraint 'employees_email_key'"));

        mockMvc.perform(post("/api/v1/hr/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Conflict"))
                .andExpect(jsonPath("$.message").value("An employee with this email address already exists."));
    }

    @Test
    @DisplayName("POST /api/v1/hr/attendance returns 409 Conflict on attendance unique constraint violation")
    void testLogAttendanceConstraintViolationReturns409() throws Exception {
        LogAttendanceRequest request = LogAttendanceRequest.builder()
                .employeeId("EMP-001")
                .employeeName("Akshit Ujjain")
                .status("Present")
                .attendanceDate("2025-03-15")
                .build();

        when(hrDashboardService.logAttendance(any(LogAttendanceRequest.class)))
                .thenThrow(new org.springframework.dao.DataIntegrityViolationException("duplicate key value violates unique constraint 'uq_attendance_employee_date'"));

        mockMvc.perform(post("/api/v1/hr/attendance")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Conflict"))
                .andExpect(jsonPath("$.message").value("Attendance has already been recorded for this employee on the specified date."));
    }

    @Test
    @DisplayName("GET /api/v1/hr/employees returns 500 on generic DataAccessException without leaking database details")
    void testGenericDatabaseErrorReturns500Sanitized() throws Exception {
        when(hrDashboardService.getEmployees(any(), any(), any(), anyInt(), anyInt()))
                .thenThrow(new org.springframework.dao.DataAccessResourceFailureException("Connection refused: postgres://secret_user:secret_pw@db.internal:5432"));

        mockMvc.perform(get("/api/v1/hr/employees"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.error").value("Database Error"))
                .andExpect(jsonPath("$.message").value("A database error occurred while processing the request."));
    }

    @Test
    @DisplayName("PATCH /api/v1/hr/leaves/{id}/status returns 400 when attempting to modify already finalized leave")
    void testFinalizedLeaveModificationReturns400() throws Exception {
        UpdateLeaveStatusRequest request = UpdateLeaveStatusRequest.builder().status("Rejected").build();

        when(hrDashboardService.updateLeaveStatus(eq(1L), any(UpdateLeaveStatusRequest.class)))
                .thenThrow(new com.company.project.common.exception.BusinessValidationException(
                        "Leave request id 1 has already been finalized as 'Approved' and cannot be modified."
                ));

        mockMvc.perform(patch("/api/v1/hr/leaves/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Leave request id 1 has already been finalized as 'Approved' and cannot be modified."));
    }

    @Test
    @DisplayName("GET /api/v1/hr/leaves returns 200 with compatible leave contract fields")
    void testGetLeavesCompatibleContract() throws Exception {
        LeaveApprovalDto leave = LeaveApprovalDto.builder()
                .id(1L)
                .employeeId("EMP-001")
                .employeeCode("EMP-001")
                .employeeName("Sneha Roy")
                .department("Engineering")
                .requestType("Sick Leave")
                .leaveType("Sick Leave")
                .appliedDate("11 Mar 2025")
                .fromDate("2025-03-12")
                .toDate("2025-03-14")
                .startDate("2025-03-12")
                .endDate("2025-03-14")
                .duration("3 days")
                .days(3)
                .reason("Viral fever")
                .status("Pending")
                .build();

        when(hrDashboardService.getLeaves(any())).thenReturn(List.of(leave));

        mockMvc.perform(get("/api/v1/hr/leaves?status=Pending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].leaveType").value("Sick Leave"))
                .andExpect(jsonPath("$[0].startDate").value("2025-03-12"))
                .andExpect(jsonPath("$[0].endDate").value("2025-03-14"))
                .andExpect(jsonPath("$[0].days").value(3))
                .andExpect(jsonPath("$[0].department").value("Engineering"))
                .andExpect(jsonPath("$[0].requestType").value("Sick Leave"))
                .andExpect(jsonPath("$[0].duration").value("3 days"));
    }

    @Test
    @DisplayName("GET /api/v1/hr/attendance returns 200 with date and department")
    void testGetAttendanceCompatibleContract() throws Exception {
        AttendanceDto attendance = AttendanceDto.builder()
                .id("ATT-001")
                .employeeId("EMP-001")
                .employeeName("Akshit Ujjain")
                .attendanceDate("2025-03-15")
                .date("2025-03-15")
                .department("Engineering")
                .status("Present")
                .checkIn("09:15 AM")
                .build();

        when(hrDashboardService.getAttendanceRecords(any(), any())).thenReturn(List.of(attendance));

        mockMvc.perform(get("/api/v1/hr/attendance?date=2025-03-15"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("ATT-001"))
                .andExpect(jsonPath("$[0].attendanceDate").value("2025-03-15"))
                .andExpect(jsonPath("$[0].date").value("2025-03-15"))
                .andExpect(jsonPath("$[0].department").value("Engineering"));
    }

    @Test
    @DisplayName("POST /api/v1/hr/attendance returns 400 when attendanceDate has invalid format")
    void testLogAttendanceInvalidDateFormatReturns400() throws Exception {
        LogAttendanceRequest request = LogAttendanceRequest.builder()
                .employeeId("EMP-001")
                .employeeName("Akshit Ujjain")
                .status("Present")
                .attendanceDate("10/31/2026")
                .build();

        when(hrDashboardService.logAttendance(any(LogAttendanceRequest.class)))
                .thenThrow(new com.company.project.common.exception.BusinessValidationException(
                        "Invalid attendance date format: '10/31/2026'. Supported formats are 'YYYY-MM-DD' (e.g. 2025-03-15) and 'D MMM YYYY' (e.g. 15 Mar 2025)."
                ));

        mockMvc.perform(post("/api/v1/hr/attendance")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Invalid attendance date format: '10/31/2026'. Supported formats are 'YYYY-MM-DD' (e.g. 2025-03-15) and 'D MMM YYYY' (e.g. 15 Mar 2025)."));
    }
}

