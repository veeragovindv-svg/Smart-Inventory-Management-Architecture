"use client";

import React, { useState } from 'react';
import { Bot, Sparkles, ChevronDown, ChevronUp, Zap, ShieldCheck } from 'lucide-react';

export default function AiAdvisorWidget({ products }) {
  const [expanded, setExpanded] = useState(true);

  const criticalItems = products.filter((p) => p.currentStock <= p.minThreshold);
  const dairyItems = products.filter((p) => p.category === 'Dairy');

  return (
    <div className="glass-panel rounded-3xl p-5 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center space-x-1.5">
              <span>Smart AI Procurement Advisor</span>
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-400">Live demand velocity & supplier SLA optimization</p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-white p-1 rounded-xl bg-white/5">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3 text-xs">
          
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-200 flex items-start space-x-2">
            <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Weekend Demand Velocity:</strong> Dairy items ({dairyItems.map(d=>d.name).join(', ')}) sell <strong>28% faster on weekends</strong>. Place Friday PO by 2:00 PM to avoid stockouts.
            </div>
          </div>

          {criticalItems.length > 0 ? (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-rose-200 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Critical Action Required:</strong> {criticalItems.length} SKUs ({criticalItems.map(i=>i.name).join(', ')}) are below safety buffers. Click <strong>1-Click PO</strong> to trigger supplier dispatch.
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-200 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Inventory Health Optimal:</strong> All SKUs currently maintain safe buffers for supplier SLA lead times.
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
