"use client";

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import InventoryTable from '../components/InventoryTable';
import ForecastView from '../components/ForecastView';
import AnalyticsTab from '../components/AnalyticsTab';
import PosSimulator from '../components/PosSimulator';
import SupplierPoManager from '../components/SupplierPoManager';
import AiAdvisorWidget from '../components/AiAdvisorWidget';
import BarcodeModal from '../components/BarcodeModal';
import ReceiptModal from '../components/ReceiptModal';
import { fetchProducts, fetchAnalyticsSummary } from '../lib/api';

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [products, setProducts] = useState([]);
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeBarcodeProduct, setActiveBarcodeProduct] = useState(null);
  const [activeReceiptData, setActiveReceiptData] = useState(null);
  const [receiptTaxRate, setReceiptTaxRate] = useState(0);
  const [receiptDiscount, setReceiptDiscount] = useState(0);

  const [filterCriticalOnly, setFilterCriticalOnly] = useState(false);

  const handleOpenCriticalItems = () => {
    setActiveTab('inventory');
    setFilterCriticalOnly(true);
  };

  const loadData = () => {
    Promise.all([fetchProducts(), fetchAnalyticsSummary()]).then(([prods, summary]) => {
      setProducts(prods);
      setAnalyticsSummary(summary);
      if (prods.length > 0 && !selectedProduct) {
        setSelectedProduct(prods[0]);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const criticalAlertCount = products.filter((p) => p.currentStock <= p.minThreshold).length;

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setActiveTab('forecast');
  };

  const handleOpenReceiptModal = (saleResult, taxRate, discount) => {
    setActiveReceiptData(saleResult);
    setReceiptTaxRate(taxRate);
    setReceiptDiscount(discount);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        criticalAlertCount={criticalAlertCount}
        analyticsSummary={analyticsSummary}
        onOpenCriticalItems={handleOpenCriticalItems}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Smart AI Procurement Advisor Header Widget */}
        {products.length > 0 && (
          <AiAdvisorWidget products={products} />
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'inventory' && (
              <InventoryTable
                products={products}
                onProductSelect={handleProductSelect}
                onStockUpdated={loadData}
                onOpenBarcodeModal={(prod) => setActiveBarcodeProduct(prod)}
                filterCriticalOnly={filterCriticalOnly}
              />
            )}

            {activeTab === 'forecast' && (
              <ForecastView
                product={selectedProduct}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsTab
                products={products}
              />
            )}

            {activeTab === 'pos' && (
              <PosSimulator
                products={products}
                onSaleProcessed={loadData}
                onOpenReceiptModal={handleOpenReceiptModal}
              />
            )}

            {activeTab === 'suppliers' && (
              <SupplierPoManager
                products={products}
                onStockUpdated={loadData}
              />
            )}
          </>
        )}

      </main>

      {/* Barcode Modal */}
      {activeBarcodeProduct && (
        <BarcodeModal
          product={activeBarcodeProduct}
          onClose={() => setActiveBarcodeProduct(null)}
        />
      )}

      {/* POS Receipt Modal */}
      {activeReceiptData && (
        <ReceiptModal
          saleData={activeReceiptData}
          taxRate={receiptTaxRate}
          discountAmount={receiptDiscount}
          onClose={() => setActiveReceiptData(null)}
        />
      )}

      <footer className="glass-panel border-t border-white/10 py-5 text-center text-xs text-slate-500">
        SmartStore AI MAX PRO MAX • Spring Boot Enterprise + Scikit-Learn ML Ensemble + Next.js Dark Glassmorphic UI
      </footer>
    </div>
  );
}
