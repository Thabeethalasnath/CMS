package com.company.project.dashboard.service;

import com.company.project.dashboard.dto.ContractDto;
import com.company.project.dashboard.dto.ContractSummaryDto;
import com.company.project.dashboard.dto.CreateContractRequest;

import java.util.List;

public interface ContractService {

    List<ContractDto> getAllContracts(
            String clientId,
            String proposalId,
            String contractType,
            String status,
            String search
    );

    ContractSummaryDto getSummary();

    ContractDto getById(Long id);

    ContractDto createContract(CreateContractRequest request);

    ContractDto updateContract(Long id, CreateContractRequest request);

    void deleteContract(Long id);

    void resetSeedData();
}

