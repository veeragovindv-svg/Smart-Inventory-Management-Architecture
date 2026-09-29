"use client";

import React, { useState } from 'react';
import { processSale } from '../lib/api';
import { Zap, ShoppingBag, CheckCircle2, AlertTriangle, Barcode, Receipt } from 'lucide-react';

export default function PosSimulator({ products, onSaleProcessed, onOpenReceiptModal }) {
  const [selectedBarcode, setSelectedBarcode] = useState(products[0]?.barcode || '');
  const [quantity, setQuantity] = useState(1);
  const [taxRate, setTaxRate] = useState(12);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const selectedProduct = products.find((p) => p.barcode === selectedBarcode);

  const subtotal = (selectedProduct?.unitPrice || 0) * quantity;
  const taxableAmount = Math.max(0, subtotal - (Number(discount) || 0));
  const taxAmount = (taxableAmount * taxRate) / 100;
  const grandTotal = taxableAmount + taxAmount;

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setLastResult(null);

    try {
      const res = await processSale(selectedBarcode, parseInt(quantity));
      setLastResult(res);
      onSaleProcessed();
    } catch (err) {
      setErrorMsg(err.message || "Failed to process sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl">
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Supermarket POS Checkout & Receipt Generator</h2>
            <p className="text-xs text-slate-400">Scan barcode, apply GST tax & discount vouchers, print thermal receipt</p>
          </div>
        </div>

        <form onSubmit={handleSaleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Select Product / Scan Barcode
            </label>
            <div className="relative">
              <Barcode className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <select
                value={selectedBarcode}
                onChange={(e) => setSelectedBarcode(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/90 border border-white/15 rounded-2xl text-sm font-bold text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                {products.map((p) => (
                  <option key={p.productId} value={p.barcode} className="bg-slate-900 text-slate-100">
                    {p.name} (Stock: {p.currentStock} units) - {p.barcode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedProduct && (
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Unit Price</span>
                <span className="font-bold text-white text-sm">₹{selectedProduct.unitPrice?.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Subtotal</span>
                <span className="font-bold text-slate-200 text-sm">₹{subtotal.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">GST Tax ({taxRate}%)</span>
                <span className="font-bold text-amber-300 text-sm">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Grand Total</span>
                <span className="font-black text-cyan-300 text-base">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Quantity Sold
              </label>
              <input
                type="number"
                min="1"
                max={selectedProduct?.currentStock || 100}
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-white/15 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                GST Tax Rate
              </label>
              <select
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-white/15 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value={0}>0% (Exempt)</option>
                <option value={5}>5% GST</option>
                <option value={12}>12% GST</option>
                <option value={18}>18% GST</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Discount Voucher (₹)
              </label>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-white/15 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-black rounded-2xl text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{loading ? 'Processing POS Checkout...' : 'Process Checkout & Deduct Inventory'}</span>
          </button>

        </form>
      </div>

      {/* Output Feedback Card */}
      {lastResult && (
        <div className="p-5 bg-emerald-500/20 border border-emerald-500/40 rounded-3xl text-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Checkout Completed Successfully!</span>
            </div>
            <button
              onClick={() => onOpenReceiptModal(lastResult, taxRate, discount)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/20"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Print Thermal Receipt</span>
            </button>
          </div>

          <p className="text-xs opacity-90">
            Deducted {quantity} units. Remaining stock for {selectedProduct?.name} is now <strong>{lastResult.product?.currentStock} units</strong>.
          </p>

          {lastResult.forecast?.is_reorder_recommended && (
            <div className="p-3 bg-rose-500/30 border border-rose-500/50 rounded-2xl text-rose-200 text-xs font-semibold flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Low Stock Alert Triggered!</strong> Automated email sent to supplier: <em>{selectedProduct?.supplier?.name}</em> ({selectedProduct?.supplier?.contactEmail}).
              </div>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-500/20 border border-rose-500/40 rounded-3xl text-rose-200 text-xs font-semibold flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

    </div>
  );
}
