package com.company.project.clients.controller;

import com.company.project.clients.dto.ClientResponse;
import com.company.project.clients.dto.CreateClientRequest;
import com.company.project.clients.dto.UpdateClientRequest;
import com.company.project.clients.entity.ClientEntity;
import com.company.project.clients.service.ClientService;
import com.company.project.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClientResponse>>> getAllClients() {
        List<ClientResponse> list = clientService.getAllClients().stream()
                .map(ClientResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClientResponse>> getClientById(@PathVariable String id) {
        return clientService.getClientById(id)
                .map(client -> ResponseEntity.ok(ApiResponse.success(ClientResponse.fromEntity(client))))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CEO')")
    public ResponseEntity<ApiResponse<ClientResponse>> createClient(@Valid @RequestBody CreateClientRequest request) {
        ClientEntity created = clientService.createClient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Client created successfully", ClientResponse.fromEntity(created)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CEO')")
    public ResponseEntity<ApiResponse<ClientResponse>> updateClient(@PathVariable String id, @Valid @RequestBody UpdateClientRequest request) {
        ClientEntity saved = clientService.updateClient(id, request);
        return ResponseEntity.ok(ApiResponse.success("Client updated successfully", ClientResponse.fromEntity(saved)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteClient(@PathVariable String id) {
        clientService.deleteClient(id);
        return ResponseEntity.ok(ApiResponse.success("Client deleted successfully", null));
    }
}
