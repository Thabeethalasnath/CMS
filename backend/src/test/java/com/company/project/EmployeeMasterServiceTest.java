package com.company.project;

import com.company.project.common.exception.ResourceNotFoundException;
import com.company.project.dashboard.dto.CreateEmployeeRequest;
import com.company.project.dashboard.dto.EmployeeMasterDto;
import com.company.project.dashboard.dto.EmployeeMasterSummaryDto;
import com.company.project.dashboard.entity.EmployeeMaster;
import com.company.project.dashboard.repository.EmployeeMasterRepository;
import com.company.project.dashboard.service.EmployeeMasterServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeMasterServiceTest {

    @Mock
    private EmployeeMasterRepository employeeRepository;

    @InjectMocks
    private EmployeeMasterServiceImpl employeeService;

    private EmployeeMaster sampleEmployee;

    @BeforeEach
    void setUp() {
        sampleEmployee = EmployeeMaster.builder()
                .id(1L)
                .employeeId("EMP-001")
                .employeeCode("E-001")
                .fullName("Amit Sharma")
                .avatarInitials("AS")
                .avatarColor("#1D4ED8")
                .avatarBg("#DBEAFE")
                .workEmail("amit.sharma@company.com")
                .phone("+91 98765 43210")
                .department("Engineering")
                .designation("Software Engineer")
                .employmentType("Full Time")
                .status("Active")
                .location("Bangalore")
                .reportingManager("Akshit Ujjain")
                .joiningDate("15 Jan 2023")
                .tenureStatus("1-3 Years")
                .monthlyCtc(new BigDecimal("45000.00"))
                .annualCtc(new BigDecimal("540000.00"))
                .gender("Male")
                .orderIndex(1)
                .build();
    }

    @Test
    @DisplayName("getAllEmployees returns filtered list")
    void testGetAllEmployees() {
        when(employeeRepository.findAllByOrderByOrderIndexAscIdAsc()).thenReturn(List.of(sampleEmployee));

        List<EmployeeMasterDto> list = employeeService.getAllEmployees(
                "Engineering", null, null, "Active", null, null, "Amit"
        );

        assertThat(list).hasSize(1);
        assertThat(list.get(0).getEmployeeId()).isEqualTo("EMP-001");
        assertThat(list.get(0).getFullName()).isEqualTo("Amit Sharma");
    }

    @Test
    @DisplayName("getSummary calculates KPI metrics accurately")
    void testGetSummary() {
        when(employeeRepository.count()).thenReturn(248L);
        when(employeeRepository.countByStatusIgnoreCase("Active")).thenReturn(212L);
        when(employeeRepository.countByStatusIgnoreCase("On Notice")).thenReturn(5L);
        when(employeeRepository.sumTotalMonthlyCtc()).thenReturn(new BigDecimal("1845000.00"));

        EmployeeMasterSummaryDto summary = employeeService.getSummary();

        assertThat(summary.getTotalEmployees()).isEqualTo(248L);
        assertThat(summary.getActiveEmployees()).isEqualTo(212L);
        assertThat(summary.getOnNoticeEmployees()).isEqualTo(5L);
        assertThat(summary.getTotalMonthlyCtc()).isEqualByComparingTo(new BigDecimal("1845000.00"));
    }

    @Test
    @DisplayName("getById returns employee when found")
    void testGetById() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(sampleEmployee));

        EmployeeMasterDto dto = employeeService.getById(1L);
        assertThat(dto.getFullName()).isEqualTo("Amit Sharma");
    }

    @Test
    @DisplayName("getById throws ResourceNotFoundException when not found")
    void testGetByIdNotFound() {
        when(employeeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> employeeService.getById(99L));
    }

    @Test
    @DisplayName("createEmployee creates and returns dto")
    void testCreateEmployee() {
        when(employeeRepository.count()).thenReturn(1L);
        when(employeeRepository.save(any(EmployeeMaster.class))).thenAnswer(invocation -> {
            EmployeeMaster e = invocation.getArgument(0);
            e.setId(2L);
            return e;
        });

        CreateEmployeeRequest req = CreateEmployeeRequest.builder()
                .fullName("Priya Kapoor")
                .workEmail("priya.k@company.com")
                .phone("+91 87654 32109")
                .department("Design")
                .designation("UI/UX Designer")
                .joiningDate("10 Feb 2023")
                .monthlyCtc(new BigDecimal("38000.00"))
                .build();

        EmployeeMasterDto created = employeeService.createEmployee(req);
        assertThat(created.getFullName()).isEqualTo("Priya Kapoor");
        assertThat(created.getAvatarInitials()).isEqualTo("PK");
    }
}

