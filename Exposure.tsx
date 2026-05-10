import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { MOCK_EXPOSURE } from '../data/mockData';
import { cn } from '../utils/cn';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1117] border border-slate-700/80 rounded-lg px-3 py-2 shadow-xl">
      <div className="text-[10px] text-slate-500 font-mono mb-1">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="text-xs font-mono" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? `$${Math.abs(p.value).toLocaleString()}` : p.value}
        </div>
      ))}
    </div>
  );
};

const fmt = (n: number) => {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`;
  return `${sign}$${abs.toLocaleString()}`;
};

const fmtINR = (n: number) => {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '+';
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)}Cr`;
  return `${sign}₹${abs.toLocaleString()}`;
};

const maturityBuckets = [
  { bucket: '0-7D', long: 145, short: 98, net: 47 },
  { bucket: '7-30D', long: 89, short: 72, net: 17 },
  { bucket: '30-90D', long: 64, short: 58, net: 6 },
  { bucket: '90-180D', long: 42, short: 38, net: 4 },
  { bucket: '180D+', long: 28, short: 25, net: 3 },
];

const hedgeRadar = [
  { currency: 'USD', value: 68 },
  { currency: 'EUR', value: 88 },
  { currency: 'GBP', value: 65 },
  { currency: 'AED', value: 87 },
  { currency: 'SGD', value: 79 },
  { currency: 'JPY', value: 74 },
];

export const Exposure: React.FC = () => {
  const [view, setView] = useState<'net' | 'gross'>('net');

  const totalUnrealizedPnl = MOCK_EXPOSURE.reduce((s, e) => s + e.unrealizedPnl, 0);
  const totalLong = MOCK_EXPOSURE.reduce((s, e) => s + e.longPosition, 0);
  const totalShort = MOCK_EXPOSURE.reduce((s, e) => s + e.shortPosition, 0);

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="max-w-[1400px] mx-auto space-y-5">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Syne'] text-xl font-bold text-slate-100">Exposure & P&L Engine</h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-time position tracking · Auto-netting · Multi-currency</p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 rounded-lg p-1">
            {(['net', 'gross'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-3 py-1 rounded text-[10px] font-medium uppercase tracking-wider cursor-pointer transition-all',
                  view === v ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Long', value: fmt(totalLong), accent: 'text-emerald-400' },
            { label: 'Total Short', value: fmt(totalShort), accent: 'text-red-400' },
            { label: 'Net Exposure', value: fmt(totalLong - totalShort), accent: 'text-cyan-400' },
            { label: 'Unrealized P&L', value: fmtINR(totalUnrealizedPnl), accent: totalUnrealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400' },
          ].map(m => (
            <div key={m.label} className="bg-[#0d1117] border border-slate-800/80 rounded-xl p-4">
              <div className="text-[9px] text-slate-600 font-mono uppercase tracking-wider mb-1">{m.label}</div>
              <div className={cn('text-xl font-mono font-bold', m.accent)}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Exposure table + chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          <Panel title="Currency Exposure Summary" subtitle="Live positions by CCY">
            <div className="space-y-3">
              {MOCK_EXPOSURE.map((pos, i) => (
                <motion.div
                  key={pos.currency}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-slate-800/25 rounded-lg p-3 border border-slate-800/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center">
                        <span className="text-[10px] font-mono font-bold text-slate-300">{pos.currency}</span>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{pos.currency}/INR</div>
                        <div className="text-[9px] text-slate-600 font-mono">{pos.maturityBucket} · {pos.branch}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn('text-sm font-mono font-bold', pos.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                        {fmtINR(pos.unrealizedPnl)}
                      </div>
                      <div className="text-[9px] text-slate-600 font-mono">Unrealized P&L</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-center">
                      <div className="text-[9px] text-slate-600 font-mono">Long</div>
                      <div className="text-[10px] font-mono text-emerald-400">{fmt(pos.longPosition)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[9px] text-slate-600 font-mono">Short</div>
                      <div className="text-[10px] font-mono text-red-400">{fmt(pos.shortPosition)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[9px] text-slate-600 font-mono">Net</div>
                      <div className="text-[10px] font-mono text-cyan-400">{fmt(pos.netExposure)}</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] text-slate-600 font-mono">Hedge Ratio</span>
                      <span className={cn('text-[9px] font-mono',
                        pos.hedgeRatio >= 0.8 ? 'text-emerald-400' : pos.hedgeRatio >= 0.6 ? 'text-amber-400' : 'text-red-400'
                      )}>
                        {(pos.hedgeRatio * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pos.hedgeRatio * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={cn('h-full rounded-full',
                          pos.hedgeRatio >= 0.8 ? 'bg-emerald-500' : pos.hedgeRatio >= 0.6 ? 'bg-amber-400' : 'bg-red-500'
                        )}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Panel>

          <div className="space-y-4">
            {/* Maturity bucket chart */}
            <Panel title="Maturity Bucket Analysis" subtitle="Long vs Short by tenor">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={maturityBuckets} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="bucket" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="long" fill="#10b981" radius={[2, 2, 0, 0]} opacity={0.75} name="Long" />
                  <Bar dataKey="short" fill="#f43f5e" radius={[2, 2, 0, 0]} opacity={0.75} name="Short" />
                  <Bar dataKey="net" fill="#22d3ee" radius={[2, 2, 0, 0]} opacity={0.9} name="Net" />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            {/* Hedge radar */}
            <Panel title="Hedge Coverage" subtitle="By currency pair">
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={hedgeRadar}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="currency" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                  <Radar name="Hedge %" dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.15} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        </div>

        {/* P&L Attribution */}
        <Panel title="P&L Attribution" subtitle="By currency · Today">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {MOCK_EXPOSURE.map(pos => (
              <div key={pos.currency} className="bg-slate-800/30 rounded-lg p-3 border border-slate-800/50 text-center">
                <div className="text-[10px] font-mono font-bold text-slate-400 mb-1.5">{pos.currency}</div>
                <div className={cn('text-sm font-mono font-bold', pos.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                  {fmtINR(pos.unrealizedPnl)}
                </div>
                <div className="text-[9px] text-slate-600 mt-1">Unrealized</div>
                <div className="mt-2 pt-2 border-t border-slate-800/60">
                  <Badge
                    variant={pos.hedgeRatio >= 0.8 ? 'success' : pos.hedgeRatio >= 0.6 ? 'warning' : 'danger'}
                    size="xs"
                  >
                    {(pos.hedgeRatio * 100).toFixed(0)}% hedged
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Panel>

      </div>
    </div>
  );
};
