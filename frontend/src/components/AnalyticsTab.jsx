"use client";

import React, { useState, useEffect } from 'react';
import { fetchAnalyticsSummary } from '../lib/api';
import { DollarSign, TrendingUp, PieChart, ShoppingCart, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AnalyticsTab({ products }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsSummary()
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Analytics fetch error:", err);
        setLoading(false);
      });
  }, [products]);

  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 shadow-2xl">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-cyan-300">Calculating Inventory Valuations & Profitability Metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Supermarket Financial & Inventory Analytics</h2>
          <p className="text-xs text-slate-400">Profit margins, stock valuations, turnover ratios, and spoilage risk monitoring</p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Total Stock Valuation */}
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Stock Valuation</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">
            ₹{summary?.totalStockValuation?.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {summary?.totalUnitsInStock} units across {summary?.totalProductsCount} SKUs
          </div>
        </div>

        {/* Gross Revenue */}
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales Revenue</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white">
            ₹{summary?.totalRevenue?.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {summary?.totalItemsSold} items sold total
          </div>
        </div>

        {/* Est Gross Profit Margin */}
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Est. Gross Profit (~32%)</span>
            <PieChart className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-300">
            ₹{summary?.estGrossProfit?.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Net Margin Allocation
          </div>
        </div>

        {/* Inventory Turnover Ratio */}
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Inventory Turnover Ratio</span>
            <RefreshCw className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300">
            {summary?.inventoryTurnoverRatio}x
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Sales to stock movement index
          </div>
        </div>

      </div>

      {/* Product Spoilage & Risk Breakdown */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
        <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Product Valuation & Perishable Spoilage Risk Table</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-white/10 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">SKU / Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Stock Qty</th>
                <th className="py-3.5 px-4">Total Asset Value</th>
                <th className="py-3.5 px-4">Estimated Gross Margin</th>
                <th className="py-3.5 px-4 text-right">Perishable Spoilage Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {products.map((p) => {
                const assetVal = p.currentStock * p.unitPrice;
                const estMargin = assetVal * 0.32;
                const daysLeft = Math.round((p.currentStock / 20) * 10) / 10;
                const risk = daysLeft > 30 ? 'HIGH (Slow Movement)' : daysLeft > 15 ? 'MEDIUM' : 'LOW (Optimal Turn)';

                return (
                  <tr key={p.productId} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{p.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{p.category}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{p.currentStock} units</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">₹{assetVal.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-purple-300 font-semibold">₹{estMargin.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border ${
                        risk.includes('HIGH')
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : risk.includes('MEDIUM')
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {risk}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
