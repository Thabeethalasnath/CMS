package com.company.project.clients.repository;

import com.company.project.clients.entity.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, String> {
    Optional<ClientEntity> findByClientCode(String clientCode);
}
