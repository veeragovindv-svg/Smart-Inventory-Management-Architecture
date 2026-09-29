package com.supermarket.inventory.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class PredictionResponseDTO {
    @JsonProperty("product_id")
    private String productId;
    
    @JsonProperty("product_name")
    private String productName;
    
    @JsonProperty("current_stock")
    private Integer currentStock;
    
    @JsonProperty("min_threshold")
    private Integer minThreshold;
    
    @JsonProperty("lead_time_days")
    private Integer leadTimeDays;
    
    @JsonProperty("predicted_daily_demand")
    private Double predictedDailyDemand;
    
    @JsonProperty("days_until_depletion")
    private Double daysUntilDepletion;
    
    @JsonProperty("predicted_run_out_date")
    private String predictedRunOutDate;
    
    @JsonProperty("reorder_point")
    private Integer reorderPoint;
    
    @JsonProperty("is_reorder_recommended")
    private Boolean isReorderRecommended;
    
    @JsonProperty("reorder_quantity_suggested")
    private Integer reorderQuantitySuggested;
    
    @JsonProperty("confidence_score")
    private Double confidenceScore;
    
    @JsonProperty("forecast_7_days")
    private List<Map<String, Object>> forecast7Days;
}
