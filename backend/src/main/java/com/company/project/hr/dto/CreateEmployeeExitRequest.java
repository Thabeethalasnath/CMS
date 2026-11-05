package com.company.project.hr.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEmployeeExitRequest {

    @JsonAlias({"id", "exitId"})
    private String exitId;

    @NotBlank(message = "Employee ID is mandatory")
    @JsonProperty("employeeId")
    private String employeeId;

    @NotBlank(message = "Employee Name is mandatory")
    @JsonProperty("employeeName")
    private String employeeName;

    @NotBlank(message = "Resignation date is mandatory")
    private String resignationDate;

    private String approvalDate;

    @NotNull(message = "Notice period days is mandatory")
    @Min(value = 0, message = "Notice period cannot be negative")
    private Integer noticePeriodDays;

    @NotBlank(message = "Last working day is mandatory")
    private String lastWorkingDay;

    @NotBlank(message = "Exit type is mandatory")
    private String exitType;

    @NotBlank(message = "Reason is mandatory")
    private String reason;

    private String exitStatus;
    private String assetsReturned;
    private String fullAndFinalStatus;
    private String notes;
    private String noticeCompletionDate;
    private String exitReadiness;
}

