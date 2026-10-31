package com.company.project;

import com.company.project.common.exception.ResourceNotFoundException;
import com.company.project.dashboard.dto.ContractDto;
import com.company.project.dashboard.dto.ContractSummaryDto;
import com.company.project.dashboard.dto.CreateContractRequest;
import com.company.project.dashboard.entity.Contract;
import com.company.project.dashboard.repository.ContractRepository;
import com.company.project.dashboard.service.ContractServiceImpl;
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
class ContractServiceTest {

    @Mock
    private ContractRepository contractRepository;

    @InjectMocks
    private ContractServiceImpl contractService;

    private Contract sampleContract;

    @BeforeEach
    void setUp() {
        sampleContract = Contract.builder()
                .id(1L)
                .contractId("C-2025-001")
                .clientId("C-001")
                .proposalId("P-2025-001")
                .contractType("Service Agreement")
                .startDate("15 Mar 2025")
                .endDate("14 Mar 2026")
                .renewalDate("14 Feb 2026")
                .contractValue(new BigDecimal("1200000.00"))
                .noticePeriod(30)
                .paymentTerms("Monthly")
                .status("Active")
                .orderIndex(1)
                .build();
    }

    @Test
    @DisplayName("getAllContracts filters correctly")
    void testGetAllContracts() {
        when(contractRepository.findAllByOrderByOrderIndexAscIdAsc()).thenReturn(List.of(sampleContract));

        List<ContractDto> result = contractService.getAllContracts("All", "All", "All", "All", null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getContractId()).isEqualTo("C-2025-001");
        assertThat(result.get(0).getContractValueFormatted()).satisfies(val ->
                assertThat(val.contains("12,00,000") || val.contains("1,200,000")).isTrue());
    }

    @Test
    @DisplayName("getSummary returns metrics")
    void testGetSummary() {
        when(contractRepository.count()).thenReturn(72L);
        when(contractRepository.countByStatusIgnoreCase("Active")).thenReturn(56L);
        when(contractRepository.countByStatusIgnoreCase("Expiring")).thenReturn(8L);
        when(contractRepository.sumTotalContractValue()).thenReturn(new BigDecimal("123456.00"));

        ContractSummaryDto summary = contractService.getSummary();

        assertThat(summary.getTotalContracts()).isEqualTo(72);
        assertThat(summary.getActiveContracts()).isEqualTo(56);
        assertThat(summary.getExpiringContracts()).isEqualTo(8);
        assertThat(summary.getTotalContractValueFormatted()).satisfies(val ->
                assertThat(val.contains("1,23,456") || val.contains("123,456")).isTrue());
    }

    @Test
    @DisplayName("getById returns contract when exists")
    void testGetByIdSuccess() {
        when(contractRepository.findById(1L)).thenReturn(Optional.of(sampleContract));

        ContractDto result = contractService.getById(1L);

        assertThat(result.getContractId()).isEqualTo("C-2025-001");
        assertThat(result.getClientId()).isEqualTo("C-001");
    }

    @Test
    @DisplayName("getById throws ResourceNotFoundException when absent")
    void testGetByIdNotFound() {
        when(contractRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> contractService.getById(99L));
    }

    @Test
    @DisplayName("createContract saves and returns new contract")
    void testCreateContract() {
        CreateContractRequest req = CreateContractRequest.builder()
                .clientId("C-002")
                .contractType("Support & Maintenance")
                .startDate("01 Mar 2025")
                .endDate("28 Feb 2026")
                .contractValue(new BigDecimal("600000.00"))
                .noticePeriod(15)
                .paymentTerms("Quarterly")
                .status("Active")
                .build();

        when(contractRepository.count()).thenReturn(1L);
        when(contractRepository.save(any(Contract.class))).thenAnswer(invocation -> {
            Contract c = invocation.getArgument(0);
            c.setId(2L);
            return c;
        });

        ContractDto created = contractService.createContract(req);

        int year = java.time.LocalDate.now().getYear();
        assertThat(created.getId()).isEqualTo(2L);
        assertThat(created.getContractId()).isEqualTo("C-" + year + "-002");
        assertThat(created.getClientId()).isEqualTo("C-002");
    }

    @Test
    @DisplayName("deleteContract removes contract when present")
    void testDeleteContract() {
        when(contractRepository.existsById(1L)).thenReturn(true);
        doNothing().when(contractRepository).deleteById(1L);

        contractService.deleteContract(1L);

        verify(contractRepository, times(1)).deleteById(1L);
    }
}
