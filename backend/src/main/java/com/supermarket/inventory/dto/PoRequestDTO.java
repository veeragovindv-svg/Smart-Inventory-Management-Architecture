package com.supermarket.inventory.dto;

import lombok.Data;

@Data
public class PoRequestDTO {
    private Long productId;
    private Long supplierId;
    private Integer orderQuantity;
}
