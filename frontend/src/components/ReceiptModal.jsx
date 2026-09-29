"use client";

import React from 'react';
import { Printer, X, Receipt, CheckCircle2 } from 'lucide-react';

export default function ReceiptModal({ saleData, taxRate = 12, discountAmount = 0, onClose }) {
  if (!saleData) return null;

  const product = saleData.product;
  const qty = saleData.quantity || 1;
  const unitPrice = product?.unitPrice || 50;
  const subtotal = unitPrice * qty;
  const discount = Number(discountAmount) || 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxAmount = (taxableAmount * taxRate) / 100;
  const grandTotal = taxableAmount + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-panel rounded-3xl p-6 max-w-sm w-full border border-white/20 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-xl bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 mb-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
            <span>POS Checkout Invoice Receipt</span>
          </div>
          <h3 className="text-lg font-extrabold text-white">Transaction Success</h3>
        </div>

        {/* Printable Thermal Receipt Card */}
        <div id="printable-receipt-card" className="bg-amber-50/90 text-slate-900 p-5 rounded-2xl font-mono text-xs shadow-2xl space-y-3 border border-amber-200">
          
          <div className="text-center border-b border-dashed border-slate-400 pb-3">
            <div className="font-black text-sm text-slate-900 uppercase">SMARTSTORE SUPERMARKET</div>
            <div className="text-[10px] text-slate-600">GSTIN: 36AAAAA0000A1Z5</div>
            <div className="text-[10px] text-slate-600">Date: {new Date().toLocaleString()}</div>
            <div className="text-[10px] font-bold text-slate-800 mt-1">TxID: #{saleData.transactionId || "TX-9941"}</div>
          </div>

          <div className="space-y-1.5 border-b border-dashed border-slate-400 pb-3">
            <div className="flex justify-between font-bold text-slate-800">
              <span>ITEM</span>
              <span>QTY × RATE = TOTAL</span>
            </div>
            <div className="flex justify-between text-slate-900">
              <span className="font-bold">{product?.name}</span>
              <span>{qty} × ₹{unitPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-1 text-slate-800 text-right">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold">₹{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount:</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST ({taxRate}%):</span>
              <span className="font-bold">₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-950 pt-1 border-t border-slate-400">
              <span>GRAND TOTAL:</span>
              <span className="text-emerald-800">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center border-t border-dashed border-slate-400 pt-3 text-[10px] text-slate-600">
            Thank you for shopping at SmartStore!
            <div className="font-mono text-slate-800 mt-1 font-bold">*{product?.barcode}*</div>
          </div>

        </div>

        <div className="flex space-x-3 pt-4 border-t border-white/10 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
          >
            Done
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
}
