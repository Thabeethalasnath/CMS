package com.company.project.clients.service;

import com.company.project.clients.dto.CreateClientRequest;
import com.company.project.clients.dto.UpdateClientRequest;
import com.company.project.clients.entity.ClientEntity;
import com.company.project.clients.repository.ClientRepository;
import com.company.project.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    @Transactional(readOnly = true)
    public List<ClientEntity> getAllClients() {
        return clientRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    @Transactional(readOnly = true)
    public Optional<ClientEntity> getClientById(String id) {
        return clientRepository.findById(id);
    }

    @Transactional
    public ClientEntity createClient(ClientEntity client) {
        if (client.getId() == null || client.getId().isBlank()) {
            long count = clientRepository.count() + 1;
            client.setId(String.format("C-%03d", count));
        }
        if (client.getClientCode() == null || client.getClientCode().isBlank()) {
            client.setClientCode("CL-" + client.getId().replace("C-", ""));
        }
        return clientRepository.save(client);
    }

    @Transactional
    public ClientEntity createClient(CreateClientRequest request) {
        ClientEntity client = ClientEntity.builder()
                .clientCode(request.getClientCode())
                .clientName(request.getClientName())
                .companyName(request.getCompanyName())
                .industry(request.getIndustry())
                .contactPerson(request.getContactPerson())
                .email(request.getEmail())
                .phone(request.getPhone())
                .country(request.getCountry())
                .city(request.getCity())
                .clientType(request.getClientType())
                .accountOwner(request.getAccountOwner())
                .status(request.getStatus() != null && !request.getStatus().isBlank() ? request.getStatus() : "Active")
                .creditLimit(request.getCreditLimit() != null ? request.getCreditLimit().toPlainString() : null)
                .onboardingDate(request.getOnboardingDate())
                .notes(request.getNotes())
                .build();
        return createClient(client);
    }

    @Transactional
    public ClientEntity updateClient(String id, ClientEntity updatedClient) {
        return clientRepository.findById(id).map(existing -> {
            if (updatedClient.getClientCode() != null) existing.setClientCode(updatedClient.getClientCode());
            if (updatedClient.getClientName() != null) existing.setClientName(updatedClient.getClientName());
            if (updatedClient.getCompanyName() != null) existing.setCompanyName(updatedClient.getCompanyName());
            if (updatedClient.getIndustry() != null) existing.setIndustry(updatedClient.getIndustry());
            if (updatedClient.getContactPerson() != null) existing.setContactPerson(updatedClient.getContactPerson());
            if (updatedClient.getEmail() != null) existing.setEmail(updatedClient.getEmail());
            if (updatedClient.getPhone() != null) existing.setPhone(updatedClient.getPhone());
            if (updatedClient.getCountry() != null) existing.setCountry(updatedClient.getCountry());
            if (updatedClient.getCity() != null) existing.setCity(updatedClient.getCity());
            if (updatedClient.getClientType() != null) existing.setClientType(updatedClient.getClientType());
            if (updatedClient.getAccountOwner() != null) existing.setAccountOwner(updatedClient.getAccountOwner());
            if (updatedClient.getStatus() != null) existing.setStatus(updatedClient.getStatus());
            if (updatedClient.getCreditLimit() != null) existing.setCreditLimit(updatedClient.getCreditLimit());
            if (updatedClient.getOnboardingDate() != null) existing.setOnboardingDate(updatedClient.getOnboardingDate());
            if (updatedClient.getNotes() != null) existing.setNotes(updatedClient.getNotes());
            return clientRepository.save(existing);
        }).orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + id));
    }

    @Transactional
    public ClientEntity updateClient(String id, UpdateClientRequest request) {
        return clientRepository.findById(id).map(existing -> {
            if (request.getClientCode() != null) existing.setClientCode(request.getClientCode());
            if (request.getClientName() != null) existing.setClientName(request.getClientName());
            if (request.getCompanyName() != null) existing.setCompanyName(request.getCompanyName());
            if (request.getIndustry() != null) existing.setIndustry(request.getIndustry());
            if (request.getContactPerson() != null) existing.setContactPerson(request.getContactPerson());
            if (request.getEmail() != null) existing.setEmail(request.getEmail());
            if (request.getPhone() != null) existing.setPhone(request.getPhone());
            if (request.getCountry() != null) existing.setCountry(request.getCountry());
            if (request.getCity() != null) existing.setCity(request.getCity());
            if (request.getClientType() != null) existing.setClientType(request.getClientType());
            if (request.getAccountOwner() != null) existing.setAccountOwner(request.getAccountOwner());
            if (request.getStatus() != null) existing.setStatus(request.getStatus());
            if (request.getCreditLimit() != null) existing.setCreditLimit(request.getCreditLimit().toPlainString());
            if (request.getOnboardingDate() != null) existing.setOnboardingDate(request.getOnboardingDate());
            if (request.getNotes() != null) existing.setNotes(request.getNotes());
            return clientRepository.save(existing);
        }).orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + id));
    }

    @Transactional
    public void deleteClient(String id) {
        clientRepository.deleteById(id);
    }
}
