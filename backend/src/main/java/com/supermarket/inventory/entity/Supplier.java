package com.supermarket.inventory.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "suppliers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long supplierId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String contactEmail;

    private String phone;

    @Column(nullable = false)
    private Integer leadTimeDays;
}
