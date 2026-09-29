package com.supermarket.inventory.service;

import com.supermarket.inventory.dto.PredictionResponseDTO;
import com.supermarket.inventory.entity.Product;
import com.supermarket.inventory.entity.SalesTransaction;
import com.supermarket.inventory.repository.SalesTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PredictionService {

    private final RestTemplate restTemplate;
    private final SalesTransactionRepository salesTransactionRepository;

    @Value("${python.forecaster.url:http://localhost:8000/predict-depletion}")
    private String forecasterUrl;

    public PredictionResponseDTO getForecastForProduct(Product product) {
        // Fetch last 14 days of sales history
        LocalDateTime fourteenDaysAgo = LocalDateTime.now().minusDays(14);
        List<SalesTransaction> sales = salesTransactionRepository.findRecentSalesForProduct(product, fourteenDaysAgo);

        List<Map<String, Object>> salesHistoryList = sales.stream().map(tx -> {
            Map<String, Object> record = new HashMap<>();
            record.put("date", tx.getTransactionDate().format(DateTimeFormatter.ISO_LOCAL_DATE));
            record.put("quantity", tx.getQuantitySold());
            return record;
        }).collect(Collectors.toList());

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("product_id", String.valueOf(product.getProductId()));
        requestBody.put("product_name", product.getName());
        requestBody.put("current_stock", product.getCurrentStock());
        requestBody.put("min_threshold", product.getMinThreshold());
        requestBody.put("lead_time_days", product.getSupplier() != null ? product.getSupplier().getLeadTimeDays() : 2);
        requestBody.put("sales_history", salesHistoryList);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<PredictionResponseDTO> response = restTemplate.postForEntity(forecasterUrl, entity, PredictionResponseDTO.class);
            return response.getBody();
        } catch (Exception e) {
            // Spring Boot Fallback if Python service is offline
            double avgDaily = 15.0;
            double daysLeft = product.getCurrentStock() / avgDaily;
            int reorderPoint = (int) Math.ceil((avgDaily * (product.getSupplier() != null ? product.getSupplier().getLeadTimeDays() : 2)) + product.getMinThreshold());

            PredictionResponseDTO fallback = new PredictionResponseDTO();
            fallback.setProductId(String.valueOf(product.getProductId()));
            fallback.setProductName(product.getName());
            fallback.setCurrentStock(product.getCurrentStock());
            fallback.setMinThreshold(product.getMinThreshold());
            fallback.setLeadTimeDays(product.getSupplier() != null ? product.getSupplier().getLeadTimeDays() : 2);
            fallback.setPredictedDailyDemand(avgDaily);
            fallback.setDaysUntilDepletion(Math.round(daysLeft * 10.0) / 10.0);
            fallback.setPredictedRunOutDate(LocalDateTime.now().plusDays((long) daysLeft).format(DateTimeFormatter.ISO_LOCAL_DATE));
            fallback.setReorderPoint(reorderPoint);
            fallback.setIsReorderRecommended(product.getCurrentStock() <= reorderPoint);
            fallback.setReorderQuantitySuggested(Math.max(0, (reorderPoint * 2) - product.getCurrentStock()));
            fallback.setConfidenceScore(0.75);
            fallback.setForecast7Days(Collections.emptyList());
            return fallback;
        }
    }
}
