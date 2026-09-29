package com.supermarket.inventory.controller;

import com.supermarket.inventory.dto.PredictionResponseDTO;
import com.supermarket.inventory.entity.Product;
import com.supermarket.inventory.repository.ProductRepository;
import com.supermarket.inventory.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final PredictionService predictionService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<Product> getProductByBarcode(@PathVariable String barcode) {
        return productRepository.findByBarcode(barcode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/forecast")
    public ResponseEntity<PredictionResponseDTO> getProductForecast(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> ResponseEntity.ok(predictionService.getForecastForProduct(product)))
                .orElse(ResponseEntity.notFound().build());
    }
}
