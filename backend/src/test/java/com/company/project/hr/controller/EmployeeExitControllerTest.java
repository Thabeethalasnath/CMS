package com.company.project.hr.controller;

import com.company.project.common.exception.GlobalExceptionHandler;
import com.company.project.common.response.PageResponse;
import com.company.project.hr.dto.*;
import com.company.project.hr.service.EmployeeExitService;
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

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class EmployeeExitControllerTest {

    private MockMvc mockMvc;

    @Mock
    private EmployeeExitService employeeExitService;

    @InjectMocks
    private EmployeeExitController employeeExitController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private EmployeeExitResponse sampleResponse;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(employeeExitController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        sampleResponse = EmployeeExitResponse.builder()
                .id("EXI-00018")
                .exitId("EXI-00018")
                .employeeId("EMP-001")
                .employeeName("Amit Sharma")
                .resignationDate("25 Oct 2026")
                .approvalDate("26 Oct 2026")
                .noticePeriodDays(30)
                .lastWorkingDay("24 Nov 2026")
                .exitType("Resignation")
                .reason("Career Growth")
                .exitStatus("Approved")
                .assetsReturned("Yes")
                .fullAndFinalStatus("In Review")
                .notes("Smooth handover")
                .noticeCompletionDate("24 Nov 2026")
                .exitReadiness("In Progress")
                .build();
    }

    @Test
    @DisplayName("GET /api/v1/hr/employee-exits returns 200 with PageResponse")
    void testGetRecordsEndpoint() throws Exception {
        PageResponse<EmployeeExitResponse> pageResponse = PageResponse.<EmployeeExitResponse>builder()
                .content(List.of(sampleResponse))
                .pageNumber(1)
                .pageSize(10)
                .totalElements(1)
                .totalPages(1)
                .first(true)
                .last(true)
                .build();

        when(employeeExitService.getExitRecords(any(), any(), any(), any(), any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/hr/employee-exits")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].exitId").value("EXI-00018"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    @DisplayName("GET /api/v1/hr/employee-exits/{exitId} returns 200")
    void testGetRecordByIdEndpoint() throws Exception {
        when(employeeExitService.getExitRecordById("EXI-00018")).thenReturn(sampleResponse);

        mockMvc.perform(get("/api/v1/hr/employee-exits/EXI-00018")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exitId").value("EXI-00018"))
                .andExpect(jsonPath("$.employeeName").value("Amit Sharma"));
    }

    @Test
    @DisplayName("POST /api/v1/hr/employee-exits returns 201 Created")
    void testCreateRecordEndpoint() throws Exception {
        CreateEmployeeExitRequest request = CreateEmployeeExitRequest.builder()
                .employeeId("EMP-020")
                .employeeName("Rahul Joshi")
                .resignationDate("25 Oct 2026")
                .approvalDate("26 Oct 2026")
                .noticePeriodDays(30)
                .lastWorkingDay("24 Nov 2026")
                .exitType("Resignation")
                .reason("Better Opportunity")
                .build();

        when(employeeExitService.createExitRecord(any(CreateEmployeeExitRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(post("/api/v1/hr/employee-exits")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.exitId").value("EXI-00018"));
    }

    @Test
    @DisplayName("PUT /api/v1/hr/employee-exits/{exitId} returns 200 OK")
    void testUpdateRecordEndpoint() throws Exception {
        UpdateEmployeeExitRequest request = UpdateEmployeeExitRequest.builder()
                .exitStatus("Completed")
                .build();

        when(employeeExitService.updateExitRecord(eq("EXI-00018"), any(UpdateEmployeeExitRequest.class)))
                .thenReturn(sampleResponse);

        mockMvc.perform(put("/api/v1/hr/employee-exits/EXI-00018")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exitId").value("EXI-00018"));
    }

    @Test
    @DisplayName("DELETE /api/v1/hr/employee-exits/{exitId} returns 204 No Content")
    void testDeleteRecordEndpoint() throws Exception {
        doNothing().when(employeeExitService).deleteExitRecord("EXI-00018");

        mockMvc.perform(delete("/api/v1/hr/employee-exits/EXI-00018"))
                .andExpect(status().isNoContent());

        verify(employeeExitService, times(1)).deleteExitRecord("EXI-00018");
    }

    @Test
    @DisplayName("GET /api/v1/hr/employee-exits/kpis returns 200 with KPI data")
    void testGetKpisEndpoint() throws Exception {
        EmployeeExitKpiResponse kpiResponse = EmployeeExitKpiResponse.builder()
                .totalExitRequests(18)
                .totalExitRequestsTrend(12)
                .approvedExits(12)
                .approvedExitsTrend(33)
                .pendingApprovals(4)
                .pendingApprovalsTrend(-9)
                .completedExits(10)
                .completedExitsTrend(67)
                .build();

        when(employeeExitService.getKpis()).thenReturn(kpiResponse);

        mockMvc.perform(get("/api/v1/hr/employee-exits/kpis"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalExitRequests").value(18))
                .andExpect(jsonPath("$.approvedExits").value(12))
                .andExpect(jsonPath("$.pendingApprovals").value(4))
                .andExpect(jsonPath("$.completedExits").value(10));
    }

    @Test
    @DisplayName("GET /api/v1/hr/employee-exits/next-id returns 200 with next suggested ID")
    void testGetNextIdEndpoint() throws Exception {
        when(employeeExitService.getNextExitId()).thenReturn(new NextExitIdResponse("EXI-00019", "EMP-019"));

        mockMvc.perform(get("/api/v1/hr/employee-exits/next-id"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nextExitId").value("EXI-00019"))
                .andExpect(jsonPath("$.suggestedEmployeeId").value("EMP-019"));
    }

    @Test
    @DisplayName("GET /api/v1/hr/employee-exits/export returns JSON list for export")
    void testExportCsvEndpoint() throws Exception {
        when(employeeExitService.getAllFilteredExitRecords(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(List.of(sampleResponse));

        mockMvc.perform(get("/api/v1/hr/employee-exits/export"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].exitId").value("EXI-00018"));
    }
}
