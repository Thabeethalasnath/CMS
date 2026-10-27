package com.company.project.sales.repository;

import com.company.project.sales.entity.LeadEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<LeadEntity, String> {
    List<LeadEntity> findAllByOrderByCreatedAtDesc();
}
