from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from forecaster import DepletionRequest, DepletionResponse, ForecastingEngine
import random
from datetime import datetime, timedelta

app = FastAPI(
    title="SmartStore AI - Supermarket Demand Forecasting ML Engine (MAX Edition)",
    description="Python Microservice for Time-Series Depletion, Random Forest ML Ensemble, & Spoilage Anomaly Detection",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "service": "SmartStore ML Forecasting Engine (MAX)",
        "models_available": ["ENSEMBLE", "EMA", "RANDOM_FOREST", "TREND"],
        "status": "UP",
        "version": "2.0.0"
    }

@app.post("/predict-depletion", response_model=DepletionResponse)
def predict_depletion(req: DepletionRequest):
    """
    Calculates expected daily demand using Ensemble ML (Random Forest + EMA + Linear Trend),
    dynamic volatility buffer, and spoilage / anomaly detection.
    """
    try:
        response = ForecastingEngine.calculate_forecast(req)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/generate-mock-sales/{days}")
def generate_mock_sales(days: int = 14):
    sales = []
    base_qty = random.randint(15, 45)
    today = datetime.now()
    for i in range(days, 0, -1):
        dt = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        variation = random.randint(-5, 12)
        sales.append({
            "date": dt,
            "quantity": max(2, base_qty + variation)
        })
    return {"sales_history": sales}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
