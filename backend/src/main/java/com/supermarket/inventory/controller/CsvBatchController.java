package com.supermarket.inventory.controller;

import com.supermarket.inventory.entity.Product;
import com.supermarket.inventory.entity.Supplier;
import com.supermarket.inventory.repository.ProductRepository;
import com.supermarket.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/products/batch")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CsvBatchController {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    @GetMapping("/export-csv")
    public ResponseEntity<byte[]> exportProductsCsv() {
        List<Product> products = productRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("ProductID,Barcode,Name,Category,CurrentStock,MinThreshold,UnitPrice,SupplierName\n");

        for (Product p : products) {
            csv.append(String.format("%d,%s,\"%s\",%s,%d,%d,%.2f,\"%s\"\n",
                    p.getProductId(),
                    p.getBarcode(),
                    p.getName().replace("\"", "\"\""),
                    p.getCategory(),
                    p.getCurrentStock(),
                    p.getMinThreshold(),
                    p.getUnitPrice(),
                    p.getSupplier() != null ? p.getSupplier().getName() : "None"
            ));
        }

        byte[] bytes = csv.toString().getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=supermarket_inventory_export.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    @PostMapping("/import-csv")
    public ResponseEntity<?> importProductsCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("CSV file is empty.");
        }

        int importedCount = 0;
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean isHeader = true;
            Supplier defaultSupplier = supplierRepository.findAll().stream().findFirst().orElse(null);

            while ((line = reader.readLine()) != null) {
                if (isHeader) {
                    isHeader = false;
                    continue;
                }
                String[] cols = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
                if (cols.length >= 6) {
                    String barcode = cols[1].replace("\"", "").trim();
                    String name = cols[2].replace("\"", "").trim();
                    String category = cols[3].replace("\"", "").trim();
                    int stock = Integer.parseInt(cols[4].trim());
                    int minThreshold = Integer.parseInt(cols[5].trim());
                    double price = cols.length > 6 ? Double.parseDouble(cols[6].trim()) : 50.0;

                    Optional<Product> existing = productRepository.findByBarcode(barcode);
                    Product product;
                    if (existing.isPresent()) {
                        product = existing.get();
                        product.setCurrentStock(stock);
                        product.setMinThreshold(minThreshold);
                        product.setUnitPrice(price);
                    } else {
                        product = Product.builder()
                                .barcode(barcode)
                                .name(name)
                                .category(category)
                                .currentStock(stock)
                                .minThreshold(minThreshold)
                                .unitPrice(price)
                                .supplier(defaultSupplier)
                                .build();
                    }
                    productRepository.save(product);
                    importedCount++;
                }
            }
            return ResponseEntity.ok(Map.of(
                    "message", "CSV imported successfully",
                    "processedCount", importedCount
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error parsing CSV file: " + e.getMessage());
        }
    }
}
