package com.supermarket.inventory.dto;

import lombok.Data;

@Data
public class SaleRequest {
    private String barcode;
    private Long productId;
    private Integer quantity;
}
