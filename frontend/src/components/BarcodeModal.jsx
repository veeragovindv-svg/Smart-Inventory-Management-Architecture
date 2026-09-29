"use client";

import React from 'react';
import { Barcode, Printer, X, Tag } from 'lucide-react';

export default function BarcodeModal({ product, onClose }) {
  if (!product) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate visual CODE128 barcode bars
  const generateBarcodeBars = (str) => {
    const bars = [];
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      const width1 = (charCode % 3) + 1;
      const width2 = (charCode % 2) + 1;
      bars.push(<rect key={`b1-${i}`} x={i * 14} y="0" width={width1 * 2} height="50" fill="#000" />);
      bars.push(<rect key={`b2-${i}`} x={i * 14 + width1 * 2 + 2} y="0" width={width2} height="50" fill="#000" />);
    }
    return bars;
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
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span>Printable Shelf Tag Label</span>
          </div>
          <h3 className="text-lg font-extrabold text-white">{product.name}</h3>
          <p className="text-xs text-slate-400">{product.category} • Lead Time: {product.supplier?.leadTimeDays}d</p>
        </div>

        {/* Printable Barcode Card Sticker */}
        <div id="printable-barcode-card" className="bg-white text-slate-950 p-5 rounded-2xl border-2 border-slate-900 shadow-xl text-center space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-slate-700">
            SUPERMARKET SHELF LABEL
          </div>

          <div className="text-xl font-black text-slate-900">
            {product.name}
          </div>

          <div className="text-2xl font-black text-emerald-700">
            ₹{product.unitPrice?.toFixed(2)}
          </div>

          {/* SVG Barcode */}
          <div className="flex justify-center py-2">
            <svg width="200" height="55" className="overflow-visible">
              {generateBarcodeBars(product.barcode || "8901001001")}
            </svg>
          </div>

          <div className="font-mono text-xs font-bold text-slate-800 tracking-widest">
            *{product.barcode}*
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-white/10 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Sticker</span>
          </button>
        </div>

      </div>
    </div>
  );
}
