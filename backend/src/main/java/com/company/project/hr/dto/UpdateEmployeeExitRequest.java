package com.company.project.hr.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEmployeeExitRequest {

    @JsonAlias({"id", "exitId"})
    private String exitId;

    @JsonProperty("employeeId")
    private String employeeId;

    @JsonProperty("employeeName")
    private String employeeName;
    private String resignationDate;
    private String approvalDate;

    @Min(value = 0, message = "Notice period cannot be negative")
    private Integer noticePeriodDays;

    private String lastWorkingDay;
    private String exitType;
    private String reason;
    private String exitStatus;
    private String assetsReturned;
    private String fullAndFinalStatus;
    private String notes;
    private String noticeCompletionDate;
    private String exitReadiness;
}

