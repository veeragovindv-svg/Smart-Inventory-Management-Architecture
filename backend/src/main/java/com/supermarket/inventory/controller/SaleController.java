package com.supermarket.inventory.controller;

import com.supermarket.inventory.dto.PredictionResponseDTO;
import com.supermarket.inventory.dto.SaleRequest;
import com.supermarket.inventory.entity.Product;
import com.supermarket.inventory.entity.SalesTransaction;
import com.supermarket.inventory.repository.ProductRepository;
import com.supermarket.inventory.repository.SalesTransactionRepository;
import com.supermarket.inventory.service.AlertEmailService;
import com.supermarket.inventory.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/sale")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SaleController {

    private final ProductRepository productRepository;
    private final SalesTransactionRepository salesTransactionRepository;
    private final PredictionService predictionService;
    private final AlertEmailService alertEmailService;

    @PostMapping
    public ResponseEntity<?> processSale(@RequestBody SaleRequest request) {
        Optional<Product> optionalProduct;
        if (request.getBarcode() != null && !request.getBarcode().isEmpty()) {
            optionalProduct = productRepository.findByBarcode(request.getBarcode());
        } else if (request.getProductId() != null) {
            optionalProduct = productRepository.findById(request.getProductId());
        } else {
            return ResponseEntity.badRequest().body("Barcode or ProductId is required.");
        }

        if (optionalProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product product = optionalProduct.get();
        int qty = request.getQuantity() != null ? request.getQuantity() : 1;

        if (product.getCurrentStock() < qty) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Insufficient stock",
                "availableStock", product.getCurrentStock()
            ));
        }

        // Deduct inventory stock
        product.setCurrentStock(product.getCurrentStock() - qty);
        Product savedProduct = productRepository.save(product);

        // Record Sale Transaction
        SalesTransaction transaction = salesTransactionRepository.save(SalesTransaction.builder()
                .product(savedProduct)
                .quantitySold(qty)
                .unitPrice(savedProduct.getUnitPrice())
                .transactionDate(LocalDateTime.now())
                .build());

        // Check forecast & trigger low stock email alert if critical
        PredictionResponseDTO forecast = predictionService.getForecastForProduct(savedProduct);
        if (Boolean.TRUE.equals(forecast.getIsReorderRecommended())) {
            alertEmailService.sendLowStockAlert(savedProduct, forecast);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Sale processed successfully");
        response.put("transactionId", transaction.getTransactionId());
        response.put("product", savedProduct);
        response.put("forecast", forecast);

        return ResponseEntity.ok(response);
    }
}
