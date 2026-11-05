package com.company.project.finance.service;

import com.company.project.finance.dto.CreateExpenseRequest;
import com.company.project.finance.dto.ExpenseResponse;
import com.company.project.finance.dto.FinanceDashboardResponse;
import com.company.project.finance.dto.FinancePeriod;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDate;

public interface FinanceService {

    FinanceDashboardResponse getDashboard(FinancePeriod period, LocalDate from, LocalDate to, LocalDate customAsOf);

    ExpenseResponse createExpense(CreateExpenseRequest request, String createdBy);

    void exportCsv(FinancePeriod period, LocalDate from, LocalDate to, HttpServletResponse response) throws IOException;
}

