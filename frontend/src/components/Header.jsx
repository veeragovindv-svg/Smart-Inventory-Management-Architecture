"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp, AlertTriangle, PackageCheck, Zap, BarChart3, Sparkles, Clock } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, criticalAlertCount, analyticsSummary, onOpenCriticalItems }) {
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'inventory', label: 'Live Inventory', icon: ShoppingCart },
    { id: 'forecast', label: 'AI ML Forecast', icon: TrendingUp },
    { id: 'analytics', label: 'Financial Analytics', icon: BarChart3 },
    { id: 'pos', label: 'POS Checkout', icon: Zap },
    { id: 'suppliers', label: 'Suppliers & PO', icon: PackageCheck },
  ];

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <Sparkles className="w-6 h-6 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                  SmartStore <span className="text-cyan-400 font-extrabold">MAX</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  v2.0 ML
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Demand Forecasting & Financial Analytics Engine</p>
            </div>
          </div>

          {/* Navigation Glass Pills */}
          <nav className="flex space-x-1 sm:space-x-2 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Status Pills */}
          <div className="flex items-center space-x-3">
            {currentTime && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 shadow-md shadow-cyan-500/10">
                <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })})
                </span>
              </div>
            )}

            {analyticsSummary && (
              <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-white/10 text-xs">
                <span className="text-slate-400">Inventory Valuation:</span>
                <span className="font-bold text-emerald-400">₹{analyticsSummary.totalStockValuation?.toLocaleString()}</span>
              </div>
            )}

            {criticalAlertCount > 0 ? (
              <button
                onClick={onOpenCriticalItems}
                title="Click to view all critical low stock items"
                className="flex items-center space-x-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-lg shadow-rose-500/10 animate-pulse transition-all cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{criticalAlertCount} Critical</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-xs font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Inventory Healthy</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
