package com.company.project.collections.repository;

import com.company.project.collections.entity.CollectionInvoiceEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CollectionInvoiceRepository extends JpaRepository<CollectionInvoiceEntity, String>, JpaSpecificationExecutor<CollectionInvoiceEntity> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM CollectionInvoiceEntity i WHERE i.id = :id")
    Optional<CollectionInvoiceEntity> findByIdWithLock(@Param("id") String id);

    List<CollectionInvoiceEntity> findByInvoiceStatus(String invoiceStatus);

    List<CollectionInvoiceEntity> findByCollectionStatus(String collectionStatus);

    List<CollectionInvoiceEntity> findByProjectId(String projectId);

    List<CollectionInvoiceEntity> findByClientId(String clientId);

    @Query("SELECT DISTINCT i.clientName FROM CollectionInvoiceEntity i ORDER BY i.clientName")
    List<String> findDistinctClientNames();

    List<CollectionInvoiceEntity> findByStatus(String status);

    @Query("SELECT COALESCE(SUM(i.invoiceAmount), 0) FROM CollectionInvoiceEntity i")
    BigDecimal sumTotalInvoiceAmount();

    @Query("SELECT COALESCE(SUM(i.outstanding), 0) FROM CollectionInvoiceEntity i")
    BigDecimal sumTotalOutstanding();

    @Query("SELECT COALESCE(SUM(i.amountPaid), 0) FROM CollectionInvoiceEntity i")
    BigDecimal sumTotalAmountPaid();

    long countByStatusIgnoreCase(String status);
}
