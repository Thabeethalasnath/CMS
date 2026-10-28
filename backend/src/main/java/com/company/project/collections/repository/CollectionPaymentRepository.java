package com.company.project.collections.repository;

import com.company.project.collections.entity.CollectionPaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CollectionPaymentRepository extends JpaRepository<CollectionPaymentEntity, String> {

    List<CollectionPaymentEntity> findByInvoice_IdOrderByPaymentDateDesc(String invoiceId);

    @Query("SELECT p FROM CollectionPaymentEntity p WHERE p.paymentDate BETWEEN :startDate AND :endDate")
    List<CollectionPaymentEntity> findPaymentsInPeriod(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
