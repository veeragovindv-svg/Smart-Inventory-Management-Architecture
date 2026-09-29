package com.supermarket.inventory.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(nullable = false, unique = true)
    private String barcode;

    @Column(nullable = false)
    private String name;

    private String category;

    @Column(nullable = false)
    private Integer currentStock;

    @Column(nullable = false)
    private Integer minThreshold;

    @Column(nullable = false)
    private Double unitPrice;

    private String expiryDate; // YYYY-MM-DD

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;
}
