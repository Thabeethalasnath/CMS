package com.company.project.collections.repository;

import com.company.project.collections.entity.CollectionInvoiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CollectionInvoiceRepository extends JpaRepository<CollectionInvoiceEntity, String>, JpaSpecificationExecutor<CollectionInvoiceEntity> {

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
