package com.supermarket.inventory.repository;

import com.supermarket.inventory.entity.Product;
import com.supermarket.inventory.entity.SalesTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SalesTransactionRepository extends JpaRepository<SalesTransaction, Long> {
    List<SalesTransaction> findByProductOrderByTransactionDateDesc(Product product);
    
    @Query("SELECT s FROM SalesTransaction s WHERE s.product = :product AND s.transactionDate >= :startDate ORDER BY s.transactionDate ASC")
    List<SalesTransaction> findRecentSalesForProduct(@Param("product") Product product, @Param("startDate") LocalDateTime startDate);
}
