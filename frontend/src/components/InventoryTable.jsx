"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, TrendingUp, Package, Download, Upload, FileSpreadsheet, CheckCircle2, Barcode, CalendarDays, AlertTriangle } from 'lucide-react';
import { updateStock, getExportCsvUrl, uploadCsvFile } from '../lib/api';

export default function InventoryTable({ products, onProductSelect, onStockUpdated, onOpenBarcodeModal, filterCriticalOnly }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showOnlyCritical, setShowOnlyCritical] = useState(false);
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [addedQty, setAddedQty] = useState(50);
  const [loading, setLoading] = useState(false);

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (filterCriticalOnly) {
      setShowOnlyCritical(true);
    }
  }, [filterCriticalOnly]);

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesCritical = !showOnlyCritical || (p.currentStock <= p.minThreshold);
    return matchesSearch && matchesCategory && matchesCritical;
  });

  const getStockStatus = (stock, minThreshold) => {
    if (stock <= minThreshold) {
      return { label: 'CRITICAL', color: 'bg-rose-500', bg: 'bg-rose-950/90 text-rose-200 border-2 border-rose-500 font-extrabold shadow-md shadow-rose-500/20' };
    }
    if (stock <= minThreshold * 1.5) {
      return { label: 'NEAR REORDER', color: 'bg-amber-400', bg: 'bg-amber-950/90 text-amber-200 border-2 border-amber-400 font-extrabold shadow-md shadow-amber-500/20' };
    }
    return { label: 'SAFE', color: 'bg-emerald-400', bg: 'bg-emerald-950/90 text-emerald-200 border-2 border-emerald-500 font-extrabold shadow-md shadow-emerald-500/20' };
  };

  const handleStockAddSubmit = async (e) => {
    e.preventDefault();
    if (!stockModalProduct || addedQty <= 0) return;
    setLoading(true);
    try {
      await updateStock(stockModalProduct.productId, parseInt(addedQty));
      onStockUpdated();
      setStockModalProduct(null);
    } catch (err) {
      alert("Failed to update stock: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUploadSubmit = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadSuccessMsg(null);
    try {
      const res = await uploadCsvFile(file);
      setUploadSuccessMsg(res.message || "CSV Imported!");
      onStockUpdated();
      setTimeout(() => {
        setImportModalOpen(false);
        setUploadSuccessMsg(null);
      }, 1500);
    } catch (err) {
      alert("CSV Import error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden">

      {/* Search & Action Toolbar */}
      <div className="p-6 border-b border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div className="flex-1 flex flex-wrap items-center gap-3">
          {/* Unified Search Input */}
          <div className="relative min-w-[260px] flex-1 max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
            <input
              type="text"
              placeholder="Search by product name or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-900/90 border border-white/15 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            />
          </div>

          {/* Unified Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setShowOnlyCritical(!showOnlyCritical)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center space-x-1.5 ${
                showOnlyCritical
                  ? 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/30 animate-pulse'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{showOnlyCritical ? 'Showing Critical Only' : '1-Click Critical Items'}</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowOnlyCritical(false);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  selectedCategory === cat && !showOnlyCritical
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Batch Operations */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <a
            href={getExportCsvUrl()}
            download
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-white/10 text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 hover:scale-105"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={() => setImportModalOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black hover:brightness-110 text-xs shadow-lg shadow-cyan-500/20 transition-all duration-200 flex items-center space-x-1.5 hover:scale-105"
          >
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </button>
        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/90 border-b border-white/10 text-[11px] font-black uppercase tracking-wider text-slate-400">
              <th className="py-4 px-6">Product & Barcode</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6">Stock Level & Expiry</th>
              <th className="py-4 px-6">Supplier SLA</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {filteredProducts.map((p) => {
              const status = getStockStatus(p.currentStock, p.minThreshold);
              const maxGauge = Math.max(100, p.minThreshold * 3);
              const percent = Math.min(100, (p.currentStock / maxGauge) * 100);

              return (
                <tr key={p.productId} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-100 flex items-center space-x-2">
                      <span>{p.name}</span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono flex items-center space-x-2 mt-0.5">
                      <span>Barcode: {p.barcode}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 rounded-xl text-xs font-bold bg-slate-800/80 text-cyan-300 border border-cyan-500/20">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-200">
                    ₹{p.unitPrice?.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 min-w-[220px]">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-200">{p.currentStock} units</span>
                      <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-black uppercase ${status.bg}`}>
                        {status.label}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden p-0.5 border border-white/5">
                      <div
                        className={`h-full ${status.color} transition-all duration-300 rounded-full shadow-sm`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    {p.expiryDate && (
                      <div className="text-[11px] text-amber-300/90 flex items-center space-x-1 mt-1 font-semibold">
                        <CalendarDays className="w-3 h-3 text-amber-400" />
                        <span>Expiry: {p.expiryDate}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-300">{p.supplier?.name || "Direct Supplier"}</div>
                    <div className="text-xs text-slate-500">Lead Time: {p.supplier?.leadTimeDays || 2} days</div>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => onOpenBarcodeModal(p)}
                      title="Generate Printable Barcode Sticker"
                      className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all duration-200 border border-white/10 hover:scale-105 shadow-sm"
                    >
                      <Barcode className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Label</span>
                    </button>
                    <button
                      onClick={() => onProductSelect(p)}
                      title="View AI ML Forecast"
                      className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-extrabold transition-all duration-200 border border-cyan-500/40 hover:scale-105 shadow-sm"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Forecast</span>
                    </button>
                    <button
                      onClick={() => setStockModalProduct(p)}
                      title="Load New Stock Shipment"
                      className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-black text-xs transition-all duration-200 hover:scale-105 shadow-md shadow-cyan-500/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Stock</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stock Add Modal */}
      {stockModalProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
              <Package className="w-5 h-5 text-cyan-400" />
              <span>Load Inventory Shipment</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Adding new stock to <strong>{stockModalProduct.name}</strong>
            </p>

            <form onSubmit={handleStockAddSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Current Stock
                </label>
                <input
                  type="text"
                  disabled
                  value={`${stockModalProduct.currentStock} units`}
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-white/10 rounded-xl text-sm font-semibold text-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Quantity Received
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={addedQty}
                  onChange={(e) => setAddedQty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/20 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStockModalProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black hover:bg-cyan-400 text-xs shadow-lg shadow-cyan-500/20"
                >
                  {loading ? 'Updating...' : 'Confirm Stock Addition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
              <span>Import Inventory CSV Batch</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upload a CSV file containing barcodes, product names, categories, and stock thresholds.
            </p>

            <form onSubmit={handleCsvUploadSubmit} className="mt-5 space-y-4">
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center hover:border-cyan-500/50 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  required
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30"
                />
              </div>

              {uploadSuccessMsg && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{uploadSuccessMsg}</span>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20"
                >
                  {uploading ? 'Processing CSV...' : 'Start Batch Import'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
