"use client";

import React, { useState } from 'react';
import { triggerPurchaseOrder } from '../lib/api';
import { PackageCheck, Mail, Clock, Send, CheckCircle2, Truck, RefreshCw } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function SupplierPoManager({ products, onStockUpdated }) {
  const [poSentMap, setPoSentMap] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [fulfilledMap, setFulfilledMap] = useState({});

  const lowStockItems = products.filter((p) => p.currentStock <= p.minThreshold * 1.5);
  const suppliers = Array.from(
    new Map(products.map((p) => [p.supplier?.supplierId || p.supplier?.name, p.supplier])).values()
  ).filter(Boolean);

  const handlePlaceOrder = async (product) => {
    setLoadingId(product.productId);
    try {
      const res = await triggerPurchaseOrder(
        product.productId,
        product.supplier?.supplierId,
        Math.max(40, product.minThreshold * 3)
      );
      const po = res.purchaseOrder;
      setPoSentMap((prev) => ({ ...prev, [product.productId]: po }));
    } catch (err) {
      alert("PO creation error: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleFulfillOrder = async (product, poId) => {
    try {
      if (poId) {
        await fetch(`${BACKEND_URL}/api/po/${poId}/fulfill`, { method: "POST" });
      }
      setFulfilledMap((prev) => ({ ...prev, [product.productId]: true }));
      onStockUpdated();
    } catch (err) {
      console.warn("Fulfill backend call failed, updating local state...");
      setFulfilledMap((prev) => ({ ...prev, [product.productId]: true }));
      onStockUpdated();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Low Stock Reorder Queue */}
      <div className="glass-panel rounded-3xl border border-white/10 p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-1 flex items-center space-x-2">
          <PackageCheck className="w-5 h-5 text-cyan-400" />
          <span>Low Stock Supplier Reorder Queue & Restock Workflow</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Items approaching reorder thresholds. Click 1-Click PO to dispatch order, then receive shipment to auto-restock database.
        </p>

        {lowStockItems.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-white/5">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-200">All inventory levels are healthy!</p>
            <p className="text-xs text-slate-400">No purchase orders required at this time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lowStockItems.map((p) => {
              const activePo = poSentMap[p.productId];
              const isFulfilled = fulfilledMap[p.productId];
              const isLoading = loadingId === p.productId;

              return (
                <div
                  key={p.productId}
                  className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{p.name}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold uppercase">
                        Stock: {p.currentStock} units
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Assigned Supplier: <strong className="text-cyan-300">{p.supplier?.name}</strong> ({p.supplier?.contactEmail}) • Lead Time: {p.supplier?.leadTimeDays} days
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isFulfilled ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Shipment Received & Restocked</span>
                      </span>
                    ) : activePo ? (
                      <button
                        onClick={() => handleFulfillOrder(p, activePo.poId)}
                        className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Receive Shipment & Auto-Restock</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePlaceOrder(p)}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl text-xs font-black bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 flex items-center space-x-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isLoading ? 'Dispatching...' : '1-Click Send Purchase Order'}</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Directory of Suppliers */}
      <div className="glass-panel rounded-3xl border border-white/10 p-6 shadow-2xl">
        <h3 className="text-base font-bold text-white mb-4">Supplier Directory & SLA Lead Times</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suppliers.map((s, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 space-y-2">
              <div className="font-bold text-white text-sm">{s.name}</div>
              <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>{s.contactEmail}</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Delivery Lead Time: <strong className="text-cyan-300">{s.leadTimeDays} Days</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
