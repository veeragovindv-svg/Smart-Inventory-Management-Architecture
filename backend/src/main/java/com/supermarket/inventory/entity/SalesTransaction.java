package com.supermarket.inventory.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantitySold;

    @Column(nullable = false)
    private Double unitPrice;

    @Column(nullable = false)
    private LocalDateTime transactionDate;
}
