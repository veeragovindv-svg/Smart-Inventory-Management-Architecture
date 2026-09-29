package com.supermarket.inventory.dto;

import lombok.Data;

@Data
public class StockUpdateRequest {
    private Long productId;
    private Integer addedQuantity;
}
