import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MOCK_DEALS } from '../data/mockData';
import type { Deal, ViewType } from '../types';
import { cn } from '../utils/cn';

const statusVariant = (s: string) => {
  switch (s) {
    case 'executed': return 'success';
    case 'approved': return 'info';
    case 'pending': return 'warning';
    case 'rejected': return 'danger';
    case 'cancelled': return 'muted';
    default: return 'muted';
  }
};

const fmt = (n: number) => {
  if (Math.abs(n) >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (Math.abs(n) >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
  return `₹${n.toLocaleString()}`;
};

const fmtUSD = (n: number) => {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
};

interface DealBlotterProps {
  onNavigate: (view: ViewType) => void;
}

export const DealBlotter: React.FC<DealBlotterProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<keyof Deal>('timestamp');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [search, setSearch] = useState('');

  const statuses = ['all', 'executed', 'approved', 'pending', 'rejected'];

  const filtered = MOCK_DEALS.filter(d => {
    const matchFilter = filter === 'all' || d.status === filter;
    const matchSearch = !search || d.client.toLowerCase().includes(search.toLowerCase()) ||
      d.dealRef.toLowerCase().includes(search.toLowerCase()) ||
      d.pair.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalRevenue = filtered.filter(d => d.status === 'executed').reduce((s, d) => s + (d.margin || 0), 0);
  const totalVolume = filtered.reduce((s, d) => s + d.notional, 0);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-[1400px] mx-auto space-y-4">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['Syne'] text-xl font-bold text-slate-100">Deal Blotter</h1>
              <p className="text-xs text-slate-500 mt-0.5">Real-time deal execution log · Today</p>
            </div>
            <Button variant="primary" size="sm" onClick={() => onNavigate('book-deal')}>
              + New Deal
            </Button>
          </div>

          {/* Summary bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Deals', value: filtered.length.toString(), accent: 'text-slate-200' },
              { label: 'Total Volume', value: fmtUSD(totalVolume), accent: 'text-cyan-400' },
              { label: 'Total Margin', value: fmt(totalRevenue), accent: 'text-emerald-400' },
              { label: 'Avg Margin (bps)', value: filtered.length ? `${Math.round(filtered.reduce((s, d) => s + d.marginBps, 0) / filtered.length)} bps` : '—', accent: 'text-slate-300' },
            ].map(m => (
              <div key={m.label} className="bg-[#0d1117] border border-slate-800/80 rounded-xl p-3">
                <div className="text-[9px] text-slate-600 font-mono uppercase tracking-wider mb-1">{m.label}</div>
                <div className={cn('text-lg font-mono font-bold', m.accent)}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search deals..."
                className="bg-slate-800/60 border border-slate-700/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-cyan-500/50 w-52"
              />
            </div>
            <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-800 rounded-lg p-1">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={cn(
                    'px-3 py-1 rounded text-[10px] font-medium capitalize cursor-pointer transition-all',
                    filter === s ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="ghost" size="sm"
                icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>}
              >
                Export
              </Button>
            </div>
          </div>

          {/* Table */}
          <Panel noPad>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/80">
                    {[
                      { k: 'dealRef', label: 'Deal Ref' },
                      { k: 'timestamp', label: 'Time' },
                      { k: 'client', label: 'Client' },
                      { k: 'pair', label: 'Pair' },
                      { k: 'type', label: 'Type' },
                      { k: 'direction', label: 'B/S' },
                      { k: 'notional', label: 'Notional' },
                      { k: 'rate', label: 'Rate' },
                      { k: 'marginBps', label: 'Margin (bps)' },
                      { k: 'margin', label: 'P&L' },
                      { k: 'status', label: 'Status' },
                      { k: 'complianceStatus', label: 'Compliance' },
                      { k: 'riskScore', label: 'Risk' },
                    ].map(col => (
                      <th
                        key={col.k}
                        className="text-left text-[9px] text-slate-600 uppercase tracking-wider font-medium px-4 py-3 cursor-pointer hover:text-slate-400 transition-colors whitespace-nowrap"
                        onClick={() => setSortBy(col.k as keyof Deal)}
                      >
                        {col.label}
                        {sortBy === col.k && <span className="ml-1 text-cyan-400">↓</span>}
                      </th>
                    ))}
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((deal, i) => (
                    <motion.tr
                      key={deal.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setSelectedDeal(deal === selectedDeal ? null : deal)}
                      className={cn(
                        'border-b border-slate-800/40 cursor-pointer transition-colors',
                        selectedDeal?.id === deal.id ? 'bg-cyan-500/5' : 'hover:bg-slate-800/20'
                      )}
                    >
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-mono text-cyan-400">{deal.dealRef.replace('PFN-2025-', '')}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(deal.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-slate-300 font-medium max-w-[140px] truncate">{deal.client}</div>
                        <div className="text-[9px] text-slate-600 mt-0.5">{deal.branch}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-mono text-slate-400">{deal.pair}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="muted" size="xs">{deal.type}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={deal.direction === 'buy' ? 'info' : 'success'}
                          size="xs"
                        >
                          {deal.direction === 'buy' ? '▲ BUY' : '▼ SELL'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-mono text-slate-300">{fmtUSD(deal.notional)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-mono text-slate-400">{deal.rate.toFixed(4)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[10px] font-mono', deal.marginBps >= 0 ? 'text-slate-300' : 'text-red-400')}>
                          {deal.marginBps} bps
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[10px] font-mono font-semibold', (deal.margin || 0) >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                          {(deal.margin || 0) >= 0 ? '+' : ''}{fmt(deal.margin || 0)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant(deal.status) as any} size="xs" pulse={deal.status === 'pending'}>
                          {deal.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={deal.complianceStatus === 'clear' ? 'success' : deal.complianceStatus === 'review' ? 'warning' : 'danger'}
                          size="xs"
                        >
                          {deal.complianceStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-8 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full rounded-full',
                                deal.riskScore > 60 ? 'bg-red-500' : deal.riskScore > 30 ? 'bg-amber-400' : 'bg-emerald-500'
                              )}
                              style={{ width: `${deal.riskScore}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-mono text-slate-600">{deal.riskScore}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                          </svg>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expanded detail */}
            {selectedDeal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-slate-800/80 bg-slate-900/40"
              >
                <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div>
                    <div className="text-[9px] text-slate-600 uppercase tracking-wider font-mono mb-2">Deal Details</div>
                    <div className="space-y-1.5">
                      {[
                        ['Ref', selectedDeal.dealRef],
                        ['Booked by', selectedDeal.bookedBy],
                        ['Branch', selectedDeal.branch],
                        ['Value Date', selectedDeal.valueDate],
                        ['Hedge Tag', selectedDeal.hedgeTag || '—'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-600 font-mono">{k}</span>
                          <span className="text-[10px] text-slate-300 font-mono">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-600 uppercase tracking-wider font-mono mb-2">Pricing</div>
                    <div className="space-y-1.5">
                      {[
                        ['Market Rate', selectedDeal.marketRate.toFixed(4)],
                        ['Customer Rate', selectedDeal.rate.toFixed(4)],
                        ['Spread', `${selectedDeal.marginBps} bps`],
                        ['Notional', fmtUSD(selectedDeal.notional)],
                        ['Margin', fmt(selectedDeal.margin || 0)],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-600 font-mono">{k}</span>
                          <span className="text-[10px] text-slate-300 font-mono">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-600 uppercase tracking-wider font-mono mb-2">Risk & Compliance</div>
                    <div className="space-y-1.5">
                      {[
                        ['Risk Score', `${selectedDeal.riskScore}/100`],
                        ['Risk Level', selectedDeal.riskScore > 60 ? 'High' : selectedDeal.riskScore > 30 ? 'Medium' : 'Low'],
                        ['Compliance', selectedDeal.complianceStatus],
                        ['Status', selectedDeal.status],
                        ['Approver', selectedDeal.approver || 'Auto'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-600 font-mono">{k}</span>
                          <span className="text-[10px] text-slate-300 font-mono capitalize">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-[9px] text-slate-600 uppercase tracking-wider font-mono mb-1">Actions</div>
                    <Button variant="secondary" size="sm">View Confirmation</Button>
                    <Button variant="ghost" size="sm">Audit Trail</Button>
                    <Button variant="ghost" size="sm">Download PDF</Button>
                    {selectedDeal.status === 'pending' && (
                      <Button variant="success" size="sm">Approve</Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
};
