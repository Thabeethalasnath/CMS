package com.company.project.clients.service;

import com.company.project.clients.entity.ClientEntity;
import com.company.project.clients.repository.ClientRepository;
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
        }).orElseThrow(() -> new RuntimeException("Client not found with id: " + id));
    }

    @Transactional
    public void deleteClient(String id) {
        clientRepository.deleteById(id);
    }
}
