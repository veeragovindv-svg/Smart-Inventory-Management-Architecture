package com.supermarket.inventory.controller;

import com.supermarket.inventory.dto.StockUpdateRequest;
import com.supermarket.inventory.entity.Product;
import com.supermarket.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class StockController {

    private final ProductRepository productRepository;

    @PostMapping("/update")
    public ResponseEntity<?> updateStock(@RequestBody StockUpdateRequest request) {
        if (request.getProductId() == null || request.getAddedQuantity() == null) {
            return ResponseEntity.badRequest().body("ProductId and AddedQuantity are required.");
        }

        return productRepository.findById(request.getProductId())
                .map(product -> {
                    int updatedStock = product.getCurrentStock() + request.getAddedQuantity();
                    product.setCurrentStock(updatedStock);
                    Product saved = productRepository.save(product);
                    return ResponseEntity.ok(Map.of(
                            "message", "Stock updated successfully",
                            "productId", saved.getProductId(),
                            "name", saved.getName(),
                            "newCurrentStock", saved.getCurrentStock()
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
