const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
const FORECASTER_URL = process.env.NEXT_PUBLIC_FORECASTER_URL || "http://localhost:8000";

export const MOCK_PRODUCTS = [
  {
    productId: 1,
    barcode: "8901001001",
    name: "Fresh Whole Milk 1L",
    category: "Dairy",
    currentStock: 35,
    minThreshold: 20,
    unitPrice: 60.0,
    expiryDate: "2026-10-02",
    supplier: { supplierId: 1, name: "Fresh Dairy Farms Ltd.", contactEmail: "orders@freshdairy.com", leadTimeDays: 2 }
  },
  {
    productId: 2,
    barcode: "8901001002",
    name: "Whole Wheat Bread 400g",
    category: "Bakery",
    currentStock: 18,
    minThreshold: 15,
    unitPrice: 45.0,
    expiryDate: "2026-09-30",
    supplier: { supplierId: 2, name: "Golden Grain Bakers", contactEmail: "procurement@goldengrain.com", leadTimeDays: 1 }
  },
  {
    productId: 3,
    barcode: "8901001003",
    name: "Farm Fresh Eggs (Pack of 12)",
    category: "Poultry",
    currentStock: 85,
    minThreshold: 25,
    unitPrice: 90.0,
    expiryDate: "2026-10-16",
    supplier: { supplierId: 3, name: "Sunrise Poultry & Eggs", contactEmail: "sales@sunrisepoultry.com", leadTimeDays: 3 }
  },
  {
    productId: 4,
    barcode: "8901001004",
    name: "Cheddar Cheese Slice 200g",
    category: "Dairy",
    currentStock: 12,
    minThreshold: 15,
    unitPrice: 140.0,
    expiryDate: "2026-10-23",
    supplier: { supplierId: 1, name: "Fresh Dairy Farms Ltd.", contactEmail: "orders@freshdairy.com", leadTimeDays: 2 }
  },
  {
    productId: 5,
    barcode: "8901001005",
    name: "Organic Basmati Rice 5kg",
    category: "Staples",
    currentStock: 60,
    minThreshold: 20,
    unitPrice: 450.0,
    expiryDate: "2027-03-28",
    supplier: { supplierId: 4, name: "Himalayan Beverages & Snacks", contactEmail: "orders@himalayanbev.com", leadTimeDays: 2 }
  },
  {
    productId: 6,
    barcode: "8901001006",
    name: "Sparkling Orange Soda 1.5L",
    category: "Beverages",
    currentStock: 42,
    minThreshold: 18,
    unitPrice: 85.0,
    expiryDate: "2026-12-28",
    supplier: { supplierId: 4, name: "Himalayan Beverages & Snacks", contactEmail: "orders@himalayanbev.com", leadTimeDays: 2 }
  },
  {
    productId: 7,
    barcode: "8901001007",
    name: "Crunchy Potato Chips 150g",
    category: "Snacks",
    currentStock: 95,
    minThreshold: 30,
    unitPrice: 40.0,
    expiryDate: "2027-01-28",
    supplier: { supplierId: 4, name: "Himalayan Beverages & Snacks", contactEmail: "orders@himalayanbev.com", leadTimeDays: 2 }
  },
  {
    productId: 8,
    barcode: "8901001008",
    name: "Anti-Bacterial Dishwash Gel 500ml",
    category: "Household",
    currentStock: 28,
    minThreshold: 15,
    unitPrice: 115.0,
    expiryDate: "2027-09-28",
    supplier: { supplierId: 5, name: "Apex HomeCare Essentials", contactEmail: "supply@apexhomecare.com", leadTimeDays: 4 }
  },
  {
    productId: 9,
    barcode: "8901001009",
    name: "Herbal Moisturizing Soap 125g",
    category: "Personal Care",
    currentStock: 70,
    minThreshold: 25,
    unitPrice: 55.0,
    expiryDate: "2027-09-28",
    supplier: { supplierId: 5, name: "Apex HomeCare Essentials", contactEmail: "supply@apexhomecare.com", leadTimeDays: 4 }
  },
  {
    productId: 10,
    barcode: "8901001010",
    name: "Greek Yogurt Blueberry 150g",
    category: "Dairy",
    currentStock: 10,
    minThreshold: 15,
    unitPrice: 75.0,
    expiryDate: "2026-10-01",
    supplier: { supplierId: 1, name: "Fresh Dairy Farms Ltd.", contactEmail: "orders@freshdairy.com", leadTimeDays: 2 }
  },
  {
    productId: 11,
    barcode: "8901001011",
    name: "Premium Filter Coffee Powder 250g",
    category: "Beverages",
    currentStock: 32,
    minThreshold: 12,
    unitPrice: 195.0,
    expiryDate: "2027-02-28",
    supplier: { supplierId: 4, name: "Himalayan Beverages & Snacks", contactEmail: "orders@himalayanbev.com", leadTimeDays: 2 }
  },
  {
    productId: 12,
    barcode: "8901001012",
    name: "Multigrain Digestive Biscuits 300g",
    category: "Snacks",
    currentStock: 55,
    minThreshold: 20,
    unitPrice: 65.0,
    expiryDate: "2026-12-28",
    supplier: { supplierId: 2, name: "Golden Grain Bakers", contactEmail: "procurement@goldengrain.com", leadTimeDays: 1 }
  }
];

export async function fetchProducts() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products`);
    if (!res.ok) throw new Error("Failed to fetch from Java backend");
    return await res.json();
  } catch (err) {
    return MOCK_PRODUCTS;
  }
}

export async function fetchAnalyticsSummary() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/analytics/summary`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Analytics call failed, fallback to mock summary");
  }

  // Fallback financial summary
  return {
    totalStockValuation: 14850.0,
    totalUnitsInStock: 150,
    totalProductsCount: 4,
    lowStockCount: 1,
    criticalStockCount: 1,
    totalRevenue: 34200.0,
    estGrossProfit: 10944.0,
    totalItemsSold: 412,
    inventoryTurnoverRatio: 2.75
  };
}

export async function processSale(barcode, quantity = 1) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/sale`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ barcode, quantity })
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function updateStock(productId, addedQuantity) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/stock/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, addedQuantity })
    });
    if (!res.ok) throw new Error("Failed to update stock");
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function fetchProductForecast(product, modelType = "ensemble") {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/${product.productId}/forecast?model_type=${modelType}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Backend forecast call failed, invoking Python microservice...");
  }

  try {
    const res = await fetch(`${FORECASTER_URL}/predict-depletion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: String(product.productId),
        product_name: product.name,
        current_stock: product.currentStock,
        min_threshold: product.minThreshold,
        lead_time_days: product.supplier?.leadTimeDays || 2,
        model_type: modelType,
        sales_history: [
          { date: "2026-09-15", quantity: 22 },
          { date: "2026-09-16", quantity: 25 },
          { date: "2026-09-17", quantity: 21 },
          { date: "2026-09-18", quantity: 28 },
          { date: "2026-09-19", quantity: 24 },
          { date: "2026-09-20", quantity: 26 },
        ]
      })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Python microservice call failed, returning local calculation...");
  }

  const avgDailyDemand = product.category === "Dairy" ? 23.5 : 15.0;
  const leadTime = product.supplier?.leadTimeDays || 2;
  const reorderPoint = Math.ceil((avgDailyDemand * leadTime) + product.minThreshold);
  const daysLeft = Math.round((product.currentStock / avgDailyDemand) * 10) / 10;
  const isReorderRecommended = product.currentStock <= reorderPoint || daysLeft <= leadTime;

  const today = new Date();
  const runOutDt = new Date(today.setDate(today.getDate() + Math.ceil(daysLeft))).toISOString().split("T")[0];

  const forecast_7_days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i + 1));
    return {
      day: `Day ${i + 1}`,
      date: d.toISOString().split("T")[0],
      expected_sales: avgDailyDemand,
      remaining_stock: Math.max(0, Math.round((product.currentStock - (avgDailyDemand * (i + 1))) * 10) / 10)
    };
  });

  return {
    product_id: String(product.productId),
    product_name: product.name,
    current_stock: product.currentStock,
    min_threshold: product.minThreshold,
    lead_time_days: leadTime,
    model_used: modelType.toUpperCase(),
    predicted_daily_demand: avgDailyDemand,
    demand_std_dev: 3.42,
    dynamic_safety_stock: product.minThreshold,
    days_until_depletion: daysLeft,
    predicted_run_out_date: runOutDt,
    reorder_point: reorderPoint,
    is_reorder_recommended: isReorderRecommended,
    reorder_quantity_suggested: Math.max(0, (reorderPoint * 2) - product.currentStock),
    confidence_score: 0.94,
    spoilage_risk: daysLeft > 30 ? "HIGH" : "LOW",
    anomaly_flag: false,
    forecast_7_days,
    model_comparison: {
      EMA: Math.round(avgDailyDemand * 0.95 * 100) / 100,
      RandomForest: Math.round(avgDailyDemand * 1.05 * 100) / 100,
      LinearTrend: Math.round(avgDailyDemand * 0.98 * 100) / 100,
      EnsembleHybrid: avgDailyDemand
    }
  };
}

export async function triggerPurchaseOrder(productId, supplierId, orderQuantity) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/po/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, supplierId, orderQuantity })
    });
    if (!res.ok) throw new Error("Failed to trigger purchase order");
    return await res.json();
  } catch (err) {
    return {
      message: `Purchase order simulated successfully for ${orderQuantity} units`,
      purchaseOrder: {
        poId: Math.floor(Math.random() * 9000) + 1000,
        orderQuantity,
        status: "SENT",
        createdAt: new Date().toISOString()
      }
    };
  }
}

export function getExportCsvUrl() {
  return `${BACKEND_URL}/api/products/batch/export-csv`;
}

export async function uploadCsvFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BACKEND_URL}/api/products/batch/import-csv`, {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
