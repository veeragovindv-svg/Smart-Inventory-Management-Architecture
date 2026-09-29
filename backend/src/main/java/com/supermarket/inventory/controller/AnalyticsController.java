package com.supermarket.inventory.controller;

import com.supermarket.inventory.entity.Product;
import com.supermarket.inventory.entity.SalesTransaction;
import com.supermarket.inventory.repository.ProductRepository;
import com.supermarket.inventory.repository.SalesTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AnalyticsController {

    private final ProductRepository productRepository;
    private final SalesTransactionRepository salesTransactionRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getFinancialSummary() {
        List<Product> products = productRepository.findAll();
        List<SalesTransaction> transactions = salesTransactionRepository.findAll();

        double totalStockValuation = 0.0;
        int totalUnitsInStock = 0;
        int lowStockCount = 0;
        int criticalStockCount = 0;

        for (Product p : products) {
            totalUnitsInStock += p.getCurrentStock();
            totalStockValuation += (p.getCurrentStock() * p.getUnitPrice());
            if (p.getCurrentStock() <= p.getMinThreshold()) {
                criticalStockCount++;
            } else if (p.getCurrentStock() <= (p.getMinThreshold() * 1.5)) {
                lowStockCount++;
            }
        }

        double totalRevenue = 0.0;
        int totalItemsSold = 0;
        for (SalesTransaction tx : transactions) {
            totalItemsSold += tx.getQuantitySold();
            totalRevenue += (tx.getQuantitySold() * tx.getUnitPrice());
        }

        // Est. Gross Profit Margin ~ 32%
        double estGrossProfit = totalRevenue * 0.32;
        double inventoryTurnoverRatio = totalUnitsInStock > 0 ? (double) totalItemsSold / totalUnitsInStock : 0.0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalStockValuation", Math.round(totalStockValuation * 100.0) / 100.0);
        summary.put("totalUnitsInStock", totalUnitsInStock);
        summary.put("totalProductsCount", products.size());
        summary.put("lowStockCount", lowStockCount);
        summary.put("criticalStockCount", criticalStockCount);
        summary.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
        summary.put("estGrossProfit", Math.round(estGrossProfit * 100.0) / 100.0);
        summary.put("totalItemsSold", totalItemsSold);
        summary.put("inventoryTurnoverRatio", Math.round(inventoryTurnoverRatio * 100.0) / 100.0);

        return ResponseEntity.ok(summary);
    }
}
