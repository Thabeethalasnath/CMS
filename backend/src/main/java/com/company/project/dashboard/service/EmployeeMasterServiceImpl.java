package com.company.project.dashboard.service;

import com.company.project.common.exception.ResourceNotFoundException;
import com.company.project.dashboard.dto.CreateEmployeeRequest;
import com.company.project.dashboard.dto.EmployeeMasterDto;
import com.company.project.dashboard.dto.EmployeeMasterSummaryDto;
import com.company.project.dashboard.entity.EmployeeMaster;
import com.company.project.dashboard.repository.EmployeeMasterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeMasterServiceImpl implements EmployeeMasterService {

    private final EmployeeMasterRepository employeeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeMasterDto> getAllEmployees(
            String department,
            String designation,
            String employmentType,
            String status,
            String location,
            String reportingManager,
            String search
    ) {
        List<EmployeeMaster> employees = employeeRepository.findAllByOrderByOrderIndexAscIdAsc();

        return employees.stream()
                .filter(e -> department == null || department.equalsIgnoreCase("All") || department.isBlank()
                        || e.getDepartment().equalsIgnoreCase(department))
                .filter(e -> designation == null || designation.equalsIgnoreCase("All") || designation.isBlank()
                        || e.getDesignation().equalsIgnoreCase(designation))
                .filter(e -> employmentType == null || employmentType.equalsIgnoreCase("All") || employmentType.isBlank()
                        || e.getEmploymentType().equalsIgnoreCase(employmentType))
                .filter(e -> status == null || status.equalsIgnoreCase("All") || status.isBlank()
                        || e.getStatus().equalsIgnoreCase(status))
                .filter(e -> location == null || location.equalsIgnoreCase("All") || location.isBlank()
                        || e.getLocation().equalsIgnoreCase(location))
                .filter(e -> reportingManager == null || reportingManager.equalsIgnoreCase("All") || reportingManager.isBlank()
                        || e.getReportingManager().equalsIgnoreCase(reportingManager))
                .filter(e -> {
                    if (search == null || search.isBlank()) return true;
                    String s = search.toLowerCase();
                    return (e.getEmployeeId() != null && e.getEmployeeId().toLowerCase().contains(s))
                            || (e.getEmployeeCode() != null && e.getEmployeeCode().toLowerCase().contains(s))
                            || (e.getFullName() != null && e.getFullName().toLowerCase().contains(s))
                            || (e.getWorkEmail() != null && e.getWorkEmail().toLowerCase().contains(s))
                            || (e.getPhone() != null && e.getPhone().toLowerCase().contains(s));
                })
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeMasterSummaryDto getSummary() {
        long totalEmployees = employeeRepository.count();
        long activeEmployees = employeeRepository.countByStatusIgnoreCase("Active");
        long onNoticeEmployees = employeeRepository.countByStatusIgnoreCase("On Notice");
        BigDecimal totalMonthlyCtc = employeeRepository.sumTotalMonthlyCtc();

        return EmployeeMasterSummaryDto.builder()
                .totalEmployees(totalEmployees)
                .totalEmployeesTrend("↑ 12% vs last month")
                .activeEmployees(activeEmployees)
                .activeEmployeesTrend("↑ 8% vs last month")
                .onNoticeEmployees(onNoticeEmployees)
                .onNoticeEmployeesTrend("↓ 25% vs last month")
                .totalMonthlyCtc(totalMonthlyCtc)
                .totalMonthlyCtcFormatted(formatIndianCurrency(totalMonthlyCtc))
                .totalMonthlyCtcTrend("↑ 8% vs last month")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeMasterDto getById(Long id) {
        EmployeeMaster employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return mapToDto(employee);
    }

    @Override
    @Transactional
    public EmployeeMasterDto createEmployee(CreateEmployeeRequest request) {
        String empId = request.getEmployeeId();
        if (empId == null || empId.isBlank()) {
            long count = employeeRepository.count() + 1;
            empId = String.format("EMP-%03d", count);
        }

        String empCode = request.getEmployeeCode();
        if (empCode == null || empCode.isBlank()) {
            long count = employeeRepository.count() + 1;
            empCode = String.format("E-%03d", count);
        }

        String initials = request.getAvatarInitials();
        if (initials == null || initials.isBlank()) {
            String[] parts = request.getFullName().trim().split("\\s+");
            if (parts.length >= 2) {
                initials = ("" + parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
            } else if (parts.length == 1 && !parts[0].isEmpty()) {
                initials = parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
            } else {
                initials = "EM";
            }
        }

        BigDecimal annual = request.getAnnualCtc();
        if (annual == null && request.getMonthlyCtc() != null) {
            annual = request.getMonthlyCtc().multiply(BigDecimal.valueOf(12));
        }

        EmployeeMaster entity = EmployeeMaster.builder()
                .employeeId(empId)
                .employeeCode(empCode)
                .fullName(request.getFullName())
                .avatarInitials(initials)
                .avatarColor(request.getAvatarColor() != null ? request.getAvatarColor() : "#1D4ED8")
                .avatarBg(request.getAvatarBg() != null ? request.getAvatarBg() : "#DBEAFE")
                .workEmail(request.getWorkEmail())
                .phone(request.getPhone())
                .department(request.getDepartment())
                .designation(request.getDesignation())
                .employmentType(request.getEmploymentType() != null ? request.getEmploymentType() : "Full Time")
                .status(request.getStatus() != null ? request.getStatus() : "Active")
                .location(request.getLocation() != null ? request.getLocation() : "Bangalore")
                .reportingManager(request.getReportingManager() != null ? request.getReportingManager() : "Akshit Ujjain")
                .joiningDate(request.getJoiningDate())
                .tenureStatus(request.getTenureStatus() != null ? request.getTenureStatus() : "1-3 Years")
                .monthlyCtc(request.getMonthlyCtc())
                .annualCtc(annual)
                .gender(request.getGender() != null ? request.getGender() : "Male")
                .orderIndex((int) (employeeRepository.count() + 1))
                .build();

        EmployeeMaster saved = employeeRepository.save(entity);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public EmployeeMasterDto updateEmployee(Long id, CreateEmployeeRequest request) {
        EmployeeMaster employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        employee.setFullName(request.getFullName());
        employee.setWorkEmail(request.getWorkEmail());
        employee.setPhone(request.getPhone());
        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        if (request.getEmploymentType() != null) employee.setEmploymentType(request.getEmploymentType());
        if (request.getStatus() != null) employee.setStatus(request.getStatus());
        if (request.getLocation() != null) employee.setLocation(request.getLocation());
        if (request.getReportingManager() != null) employee.setReportingManager(request.getReportingManager());
        if (request.getJoiningDate() != null) employee.setJoiningDate(request.getJoiningDate());
        if (request.getTenureStatus() != null) employee.setTenureStatus(request.getTenureStatus());
        if (request.getMonthlyCtc() != null) {
            employee.setMonthlyCtc(request.getMonthlyCtc());
            employee.setAnnualCtc(request.getMonthlyCtc().multiply(BigDecimal.valueOf(12)));
        }

        EmployeeMaster updated = employeeRepository.save(employee);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }

    private EmployeeMasterDto mapToDto(EmployeeMaster e) {
        return EmployeeMasterDto.builder()
                .id(e.getId())
                .employeeId(e.getEmployeeId())
                .employeeCode(e.getEmployeeCode())
                .fullName(e.getFullName())
                .avatarInitials(e.getAvatarInitials())
                .avatarColor(e.getAvatarColor())
                .avatarBg(e.getAvatarBg())
                .workEmail(e.getWorkEmail())
                .phone(e.getPhone())
                .department(e.getDepartment())
                .designation(e.getDesignation())
                .employmentType(e.getEmploymentType())
                .status(e.getStatus())
                .location(e.getLocation())
                .reportingManager(e.getReportingManager())
                .joiningDate(e.getJoiningDate())
                .tenureStatus(e.getTenureStatus())
                .monthlyCtc(e.getMonthlyCtc())
                .monthlyCtcFormatted(formatIndianCurrency(e.getMonthlyCtc()))
                .annualCtc(e.getAnnualCtc())
                .annualCtcFormatted(formatIndianCurrency(e.getAnnualCtc()))
                .gender(e.getGender())
                .orderIndex(e.getOrderIndex())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }

    private String formatIndianCurrency(BigDecimal amount) {
        if (amount == null) return "₹ 0";
        try {
            Locale inLocale = new Locale("en", "IN");
            NumberFormat nf = NumberFormat.getNumberInstance(inLocale);
            return "₹ " + nf.format(amount.longValue());
        } catch (Exception e) {
            return "₹ " + amount.toString();
        }
    }
}

