"use client";

import React, { useState, useEffect } from 'react';
import { fetchProductForecast, triggerPurchaseOrder } from '../lib/api';
import { TrendingUp, AlertOctagon, CheckCircle2, Calendar, ShieldAlert, Send, Cpu, Sparkles, Activity, Layers } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ForecastView({ product }) {
  const [modelType, setModelType] = useState('ensemble');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [poSent, setPoSent] = useState(false);

  const modelOptions = [
    { id: 'ensemble', label: 'Ensemble Hybrid (RF + EMA + Trend)', desc: '95% Confidence' },
    { id: 'random_forest', label: 'Random Forest ML', desc: 'Lag Pattern Learning' },
    { id: 'ema', label: 'Exponential Moving Avg', desc: 'Recent Weighting' },
    { id: 'trend', label: 'Linear Trend Regression', desc: 'Linear Trajectory' },
  ];

  useEffect(() => {
    if (!product) return;
    setLoading(true);
    fetchProductForecast(product, modelType)
      .then((data) => {
        setForecast(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Forecast fetch error:", err);
        setLoading(false);
      });
  }, [product, modelType]);

  if (!product) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 shadow-2xl">
        <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Product Selected for AI ML Analysis</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          Select any product from the Live Inventory screen to test Machine Learning trendlines and depletion forecasts.
        </p>
      </div>
    );
  }

  const handleSendPO = async () => {
    if (!forecast) return;
    try {
      await triggerPurchaseOrder(
        product.productId,
        product.supplier?.supplierId,
        forecast.reorder_quantity_suggested || 50
      );
      setPoSent(true);
    } catch (err) {
      alert("PO Trigger error: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Product Banner */}
      <div className="glass-panel rounded-3xl p-6 text-white shadow-2xl border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider border border-cyan-500/30">
              {product.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">Barcode: {product.barcode}</span>
          </div>
          <h2 className="text-2xl font-black mt-1.5 tracking-tight text-white">{product.name}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Supplier: <strong className="text-cyan-300">{product.supplier?.name}</strong> (Lead Time: {product.supplier?.leadTimeDays} days)
          </p>
        </div>

        {/* Model Selector Pills */}
        <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 flex flex-wrap gap-1.5">
          {modelOptions.map((m) => (
            <button
              key={m.id}
              onClick={() => setModelType(m.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                modelType === m.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 shadow-2xl">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-cyan-300">Evaluating ML Model Projections...</p>
        </div>
      ) : forecast ? (
        <>
          {/* Key Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Daily Demand */}
            <div className="glass-card p-5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Expected Daily Demand</span>
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white">
                {forecast.predicted_daily_demand} <span className="text-xs font-semibold text-slate-400">units/day</span>
              </div>
              <div className="text-[11px] text-cyan-300 mt-1 flex items-center space-x-1 font-bold">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Model: {forecast.model_used} ({Math.round(forecast.confidence_score * 100)}% Conf)</span>
              </div>
            </div>

            {/* Days Until Runout */}
            <div className={`p-5 rounded-2xl border backdrop-blur-md ${
              forecast.days_until_depletion <= (product.supplier?.leadTimeDays || 2)
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-200'
                : 'glass-card text-white'
            }`}>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Depletion Window</span>
                <Calendar className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-3xl font-black">
                {forecast.days_until_depletion} <span className="text-xs font-semibold">days left</span>
              </div>
              <div className="text-[11px] mt-1 opacity-80 font-semibold">
                Estimated Zero Date: <strong>{forecast.predicted_run_out_date}</strong>
              </div>
            </div>

            {/* Reorder Point Calculation */}
            <div className="glass-card p-5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Reorder Point Threshold</span>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white">
                {forecast.reorder_point} <span className="text-xs font-semibold text-slate-400">units</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Dynamic Volatility Buffer: <strong>{forecast.dynamic_safety_stock} units</strong>
              </div>
            </div>

            {/* Action Trigger Card */}
            <div className={`p-5 rounded-2xl border backdrop-blur-md flex flex-col justify-between ${
              forecast.is_reorder_recommended
                ? 'bg-gradient-to-br from-rose-500/30 to-rose-700/40 border-rose-500/50 text-white'
                : 'bg-gradient-to-br from-emerald-500/20 to-teal-700/30 border-emerald-500/40 text-white'
            }`}>
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider">
                  {forecast.is_reorder_recommended ? (
                    <>
                      <AlertOctagon className="w-4 h-4 text-rose-400" />
                      <span>Reorder Recommended</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Stock Status Healthy</span>
                    </>
                  )}
                </div>
                <div className="text-xs mt-2 opacity-90 font-medium">
                  {forecast.is_reorder_recommended
                    ? `Stock depleting rapidly! Suggested PO: ${forecast.reorder_quantity_suggested} units`
                    : `Sufficient stock for current lead time.`}
                </div>
              </div>

              {forecast.is_reorder_recommended && (
                <button
                  onClick={handleSendPO}
                  disabled={poSent}
                  className="mt-3 w-full py-2.5 px-3 bg-white text-slate-950 hover:bg-slate-200 rounded-xl text-xs font-black shadow-lg transition-all flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{poSent ? 'PO Email Dispatched!' : '1-Click Send PO to Supplier'}</span>
                </button>
              )}
            </div>

          </div>

          {/* Model Comparison Breakdown Cards */}
          {forecast.model_comparison && (
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                <span className="flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>ML Model Comparison Matrix (Daily Demand Output)</span>
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(forecast.model_comparison).map(([modelKey, val]) => (
                  <div key={modelKey} className="p-3 bg-slate-900/60 rounded-xl border border-white/5 text-center">
                    <div className="text-[11px] text-slate-400 font-bold">{modelKey}</div>
                    <div className="text-lg font-black text-cyan-300 mt-0.5">{val} units/d</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anomaly Warning Banner */}
          {forecast.anomaly_flag && (
            <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-amber-200 text-xs font-bold flex items-center space-x-2">
              <Activity className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>{forecast.anomaly_message}</span>
            </div>
          )}

          {/* Chart Section */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>7-Day Projected Stock Depletion Trajectory ({forecast.model_used})</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              AI forecast model projecting daily stock consumption and depletion trajectory based on historical sales.
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecast.forecast_7_days || []}>
                  <defs>
                    <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="remaining_stock"
                    name="Projected Stock"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#stockGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : null}

    </div>
  );
}
