from forecaster import DepletionRequest, DailySalesRecord, ForecastingEngine

def test_forecasting_calculation():
    req = DepletionRequest(
        product_id="PROD-001",
        product_name="Fresh Whole Milk 1L",
        current_stock=35,
        min_threshold=15,
        lead_time_days=2,
        sales_history=[
            DailySalesRecord(date="2026-09-15", quantity=20),
            DailySalesRecord(date="2026-09-16", quantity=22),
            DailySalesRecord(date="2026-09-17", quantity=25),
            DailySalesRecord(date="2026-09-18", quantity=21),
            DailySalesRecord(date="2026-09-19", quantity=24),
            DailySalesRecord(date="2026-09-20", quantity=28),
        ]
    )
    res = ForecastingEngine.calculate_forecast(req)

    assert res.product_id == "PROD-001"
    assert res.predicted_daily_demand > 0
    assert res.days_until_depletion > 0
    assert res.reorder_point > 0
    assert len(res.forecast_7_days) == 7
    print(f"Test Passed! Daily Demand: {res.predicted_daily_demand}, Days left: {res.days_until_depletion}, Reorder Point: {res.reorder_point}, Reorder Recommended: {res.is_reorder_recommended}")

if __name__ == "__main__":
    test_forecasting_calculation()
