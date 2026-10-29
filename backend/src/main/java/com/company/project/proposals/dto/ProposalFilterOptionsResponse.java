package com.company.project.proposals.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalFilterOptionsResponse {
    private List<String> owners;
    private List<String> clients;
    private List<String> opportunities;
    private List<String> services;
}
