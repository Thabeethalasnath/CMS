package com.company.project.hr;

import com.company.project.hr.entity.CandidateEntity;
import com.company.project.hr.entity.EmployeeEntity;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class HrEntityMappingTest {

    @Test
    @DisplayName("EmployeeEntity should correctly construct and hold values via builder")
    void testEmployeeEntityBuilder() {
        String joinDate = "15 Jan 2023";
        EmployeeEntity emp = EmployeeEntity.builder()
                .id(1L)
                .employeeId("EMP-001")
                .employeeCode("E-001")
                .fullName("Aarav Sharma")
                .avatarInitials("AS")
                .avatarColor("#1D4ED8")
                .avatarBg("#DBEAFE")
                .workEmail("aarav.s@kalpanaaa.com")
                .department("Engineering")
                .designation("Senior Full Stack Developer")
                .monthlyCtc(new BigDecimal("125000.00"))
                .joiningDate(joinDate)
                .status("Active")
                .build();

        assertNotNull(emp);
        assertEquals(1L, emp.getId());
        assertEquals("EMP-001", emp.getEmployeeId());
        assertEquals("Aarav Sharma", emp.getFullName());
        assertEquals("aarav.s@kalpanaaa.com", emp.getWorkEmail());
        assertEquals("Engineering", emp.getDepartment());
        assertEquals("Senior Full Stack Developer", emp.getDesignation());
        assertEquals(new BigDecimal("125000.00"), emp.getMonthlyCtc());
        assertEquals(joinDate, emp.getJoiningDate());
        assertEquals("Active", emp.getStatus());
    }

    @Test
    @DisplayName("CandidateEntity should correctly construct and hold values via builder")
    void testCandidateEntityBuilder() {
        LocalDate createdDate = LocalDate.of(2025, 2, 10);
        CandidateEntity candidate = CandidateEntity.builder()
                .id("CAN-101")
                .name("Ishita Roy")
                .email("ishita.roy@example.com")
                .role("Lead UI/UX Designer")
                .department("Design")
                .status("Interviewing")
                .createdDate(createdDate)
                .build();

        assertNotNull(candidate);
        assertEquals("CAN-101", candidate.getId());
        assertEquals("Ishita Roy", candidate.getName());
        assertEquals("Lead UI/UX Designer", candidate.getRole());
        assertEquals("Design", candidate.getDepartment());
        assertEquals("Interviewing", candidate.getStatus());
        assertEquals(createdDate, candidate.getCreatedDate());
    }
}

