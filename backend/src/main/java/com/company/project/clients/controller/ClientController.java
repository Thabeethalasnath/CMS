package com.company.project.clients.controller;

import com.company.project.clients.entity.ClientEntity;
import com.company.project.clients.service.ClientService;
import com.company.project.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClientEntity>>> getAllClients() {
        return ResponseEntity.ok(ApiResponse.success(clientService.getAllClients()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClientEntity>> getClientById(@PathVariable String id) {
        return clientService.getClientById(id)
                .map(client -> ResponseEntity.ok(ApiResponse.success(client)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClientEntity>> createClient(@RequestBody ClientEntity client) {
        ClientEntity created = clientService.createClient(client);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Client created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClientEntity>> updateClient(@PathVariable String id, @RequestBody ClientEntity updatedClient) {
        try {
            ClientEntity saved = clientService.updateClient(id, updatedClient);
            return ResponseEntity.ok(ApiResponse.success("Client updated successfully", saved));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteClient(@PathVariable String id) {
        clientService.deleteClient(id);
        return ResponseEntity.ok(ApiResponse.success("Client deleted successfully", null));
    }
}
