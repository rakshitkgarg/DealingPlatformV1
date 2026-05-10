import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MOCK_CLIENTS } from '../data/mockData';
import type { Client } from '../types';
import { cn } from '../utils/cn';

const fmt = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
  return `₹${n.toLocaleString()}`;
};

const fmtUSD = (n: number) => {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
};

const segmentVariant = (s: string) => {
  switch (s) {
    case 'platinum': return 'info';
    case 'gold': return 'amber';
    case 'silver': return 'muted';
    default: return 'muted';
  }
};

const ratingColor = (r: string) => {
  switch (r) {
    case 'A': return 'text-emerald-400';
    case 'B': return 'text-amber-400';
    case 'C': return 'text-red-400';
    default: return 'text-slate-400';
  }
};

const clientRevData = (client: Client) => Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  revenue: Math.floor(client.ytdRevenue / 12 * (0.7 + Math.random() * 0.6)),
  deals: Math.floor(client.dealsCount / 12 * (0.7 + Math.random() * 0.6)),
}));

export const Clients: React.FC = () => {
  const [selected, setSelected] = useState<Client | null>(null);
  const [search, setSearch] = useState('');
  const [segFilter, setSegFilter] = useState<string>('all');

  const filtered = MOCK_CLIENTS.filter(c => {
    const matchSeg = segFilter === 'all' || c.segment === segFilter;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    return matchSeg && matchSearch;
  });

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Syne'] text-xl font-bold text-slate-100">Client Intelligence</h1>
            <p className="text-xs text-slate-500 mt-0.5">Profitability analytics · Margin history · AI-driven insights</p>
          </div>
          <Button variant="primary" size="sm">+ Onboard Client</Button>
        </div>

        {/* Portfolio summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Clients', value: MOCK_CLIENTS.length.toString(), accent: 'text-slate-200' },
            { label: 'YTD Revenue', value: fmt(MOCK_CLIENTS.reduce((s, c) => s + c.ytdRevenue, 0)), accent: 'text-emerald-400' },
            { label: 'YTD Volume', value: fmtUSD(MOCK_CLIENTS.reduce((s, c) => s + c.ytdVolume, 0)), accent: 'text-cyan-400' },
            { label: 'Avg Margin (bps)', value: `${Math.round(MOCK_CLIENTS.reduce((s, c) => s + c.avgMarginBps, 0) / MOCK_CLIENTS.length)} bps`, accent: 'text-slate-300' },
          ].map(m => (
            <div key={m.label} className="bg-[#0d1117] border border-slate-800/80 rounded-xl p-4">
              <div className="text-[9px] text-slate-600 font-mono uppercase tracking-wider mb-1">{m.label}</div>
              <div className={cn('text-xl font-mono font-bold', m.accent)}>{m.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Client list */}
          <div className="xl:col-span-1 space-y-3">
            {/* Filters */}
            <div className="flex flex-col gap-2">
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search clients..."
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-cyan-500/50"
                />
              </div>
              <div className="flex gap-1">
                {['all', 'platinum', 'gold', 'silver'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSegFilter(s)}
                    className={cn(
                      'flex-1 py-1 rounded text-[9px] font-medium capitalize cursor-pointer transition-all',
                      segFilter === s ? 'bg-slate-700 text-slate-200' : 'text-slate-600 hover:text-slate-400'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filtered.map((client, i) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(client)}
                  className={cn(
                    'p-3 bg-[#0d1117] border rounded-xl cursor-pointer transition-all duration-200',
                    selected?.id === client.id ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-slate-800/80 hover:border-slate-700'
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-200 truncate">{client.name}</div>
                      <div className="text-[9px] text-slate-600 mt-0.5 font-mono">{client.branch} · {client.relationship_manager}</div>
                    </div>
                    <div className="flex flex-col gap-1 items-end flex-shrink-0">
                      <Badge variant={segmentVariant(client.segment) as any} size="xs">{client.segment}</Badge>
                      <span className={cn('text-[10px] font-mono font-bold', ratingColor(client.riskRating))}>{client.riskRating}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[8px] text-slate-700 uppercase font-mono">YTD Rev</div>
                      <div className="text-[10px] font-mono text-emerald-400">{fmt(client.ytdRevenue)}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-slate-700 uppercase font-mono">Volume</div>
                      <div className="text-[10px] font-mono text-slate-400">{fmtUSD(client.ytdVolume)}</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[8px] text-slate-700 font-mono">Credit</span>
                      <span className="text-[8px] text-slate-600 font-mono">{Math.round(client.creditUsed / client.creditLimit * 100)}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full',
                          client.creditUsed / client.creditLimit > 0.9 ? 'bg-red-500' :
                          client.creditUsed / client.creditLimit > 0.7 ? 'bg-amber-400' : 'bg-emerald-500'
                        )}
                        style={{ width: `${(client.creditUsed / client.creditLimit) * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Client detail */}
          <div className="xl:col-span-2">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Header */}
                <Panel accent>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-['Syne'] text-lg font-bold text-slate-100">{selected.name}</h2>
                        <Badge variant={segmentVariant(selected.segment) as any} size="xs">{selected.segment}</Badge>
                        <span className={cn('text-sm font-mono font-bold', ratingColor(selected.riskRating))}>{selected.riskRating}</span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {selected.type} · {selected.branch} · RM: {selected.relationship_manager} · Since {selected.onboardDate}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">View Deals</Button>
                      <Button variant="primary" size="sm">Book Deal</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-800/60">
                    {[
                      { k: 'YTD Revenue', v: fmt(selected.ytdRevenue), color: 'text-emerald-400' },
                      { k: 'YTD Volume', v: fmtUSD(selected.ytdVolume), color: 'text-cyan-400' },
                      { k: 'Avg Spread', v: `${selected.avgMarginBps} bps`, color: 'text-slate-300' },
                      { k: 'Total Deals', v: selected.dealsCount.toString(), color: 'text-slate-300' },
                    ].map(m => (
                      <div key={m.k}>
                        <div className="text-[9px] text-slate-600 font-mono uppercase tracking-wider mb-1">{m.k}</div>
                        <div className={cn('text-lg font-mono font-bold', m.color)}>{m.v}</div>
                      </div>
                    ))}
                  </div>
                </Panel>

                {/* Revenue history chart */}
                <Panel title="Revenue History" subtitle="Monthly · Last 12 months">
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={clientRevData(selected)} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="clientRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                      <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 8, fontSize: 10 }} />
                      <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fill="url(#clientRev)" strokeWidth={2} dot={false} name="Revenue" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Panel>

                {/* AI Insights for client */}
                <Panel title="AI Client Intelligence" headerRight={<Badge variant="info" pulse size="xs">AI</Badge>}>
                  <div className="space-y-3">
                    {[
                      {
                        type: 'Margin Opportunity',
                        color: 'emerald',
                        insight: `${selected.name} has demonstrated low price sensitivity (elasticity -0.3). Current spread of ${selected.avgMarginBps}bps can be optimized to ${selected.avgMarginBps + 4}bps without conversion risk. Est. incremental revenue: ${fmt((selected.ytdVolume * 0.00004) / 12)}/mo.`,
                      },
                      {
                        type: 'Volume Pattern',
                        color: 'cyan',
                        insight: `Highest FX activity observed in Q4 (Oct-Dec). Pre-position inventory recommended from September. Client typically hedges 60-75% of export receivables within 30 days of invoice.`,
                      },
                      {
                        type: 'Churn Risk',
                        color: selected.riskRating === 'A' ? 'emerald' : 'amber',
                        insight: `Client health score: ${selected.riskRating === 'A' ? '87/100 (Strong)' : '72/100 (Moderate)'}. Last RM interaction: 12 days ago. Recommend scheduling Q1 review meeting to retain premium status.`,
                      },
                    ].map(insight => (
                      <div key={insight.type} className="bg-slate-800/25 border border-slate-800/50 rounded-lg p-3">
                        <div className={cn(
                          'text-[9px] font-mono uppercase tracking-wider mb-1.5',
                          insight.color === 'emerald' ? 'text-emerald-500' : insight.color === 'cyan' ? 'text-cyan-500' : 'text-amber-500'
                        )}>
                          {insight.type}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{insight.insight}</p>
                      </div>
                    ))}
                  </div>
                </Panel>

                {/* Credit utilization */}
                <Panel title="Credit Facility" dense>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-[9px] text-slate-600 font-mono uppercase">Limit</div>
                      <div className="text-lg font-mono font-semibold text-slate-300">{fmtUSD(selected.creditLimit)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-slate-600 font-mono uppercase">Used</div>
                      <div className={cn('text-lg font-mono font-semibold',
                        selected.creditUsed / selected.creditLimit > 0.9 ? 'text-red-400' : 'text-slate-300'
                      )}>
                        {fmtUSD(selected.creditUsed)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-slate-600 font-mono uppercase">Available</div>
                      <div className="text-lg font-mono font-semibold text-emerald-400">{fmtUSD(selected.creditLimit - selected.creditUsed)}</div>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(selected.creditUsed / selected.creditLimit) * 100}%` }}
                      transition={{ duration: 0.8 }}
                      className={cn('h-full rounded-full',
                        selected.creditUsed / selected.creditLimit > 0.9 ? 'bg-red-500' :
                        selected.creditUsed / selected.creditLimit > 0.7 ? 'bg-amber-400' : 'bg-emerald-500'
                      )}
                    />
                  </div>
                  <div className="text-right text-[10px] text-slate-600 font-mono mt-1">
                    {Math.round((selected.creditUsed / selected.creditLimit) * 100)}% utilized
                  </div>
                </Panel>

              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-600">Select a client to view intelligence</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
