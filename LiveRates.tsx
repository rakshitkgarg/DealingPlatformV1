import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { useFXRates } from '../components/FXTicker';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { RATE_HISTORY_DATA, MOCK_INSIGHTS } from '../data/mockData';
import { cn } from '../utils/cn';
import type { ViewType } from '../types';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1117] border border-slate-700/80 rounded-lg px-3 py-2 shadow-xl">
      <div className="text-[10px] text-slate-500 font-mono mb-1">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="text-xs font-mono" style={{ color: p.color }}>
          {p.name}: {p.value.toFixed(4)}
        </div>
      ))}
    </div>
  );
};

interface LiveRatesProps {
  onNavigate: (view: ViewType) => void;
}

export const LiveRates: React.FC<LiveRatesProps> = ({ onNavigate }) => {
  const rates = useFXRates();
  const [selectedPair, setSelectedPair] = useState('USD/INR');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

  const selectedRate = rates.find(r => r.pair === selectedPair);
  const chartKey = selectedPair === 'USD/INR' ? 'USD/INR' : selectedPair === 'EUR/USD' ? 'EUR/USD' : 'GBP/INR';

  const forwardPoints = [
    { tenor: 'ON', points: 1.2 },
    { tenor: 'TN', points: 2.4 },
    { tenor: '1W', points: 8.5 },
    { tenor: '1M', points: 36.2 },
    { tenor: '3M', points: 108.5 },
    { tenor: '6M', points: 218.0 },
    { tenor: '12M', points: 435.5 },
  ];

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Syne'] text-xl font-bold text-slate-100">Live Market Rates</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-500 font-mono">Real-time • Updates every 1.2s</span>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={() => onNavigate('book-deal')}>
            Book Deal
          </Button>
        </div>

        {/* Rate cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {rates.map(rate => (
            <motion.button
              key={rate.pair}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedPair(rate.pair)}
              className={cn(
                'relative text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden',
                selectedPair === rate.pair
                  ? 'bg-cyan-500/10 border-cyan-500/40'
                  : 'bg-[#0d1117] border-slate-800/80 hover:border-slate-700'
              )}
            >
              {selectedPair === rate.pair && (
                <div className="absolute top-0 left-0 right-0 h-px bg-cyan-400 opacity-60" />
              )}
              <div className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {rate.pair}
              </div>
              <motion.div
                key={rate.mid.toFixed(5)}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                className="text-lg font-mono font-bold text-slate-100 leading-none"
              >
                {rate.mid.toFixed(rate.pair.length === 6 ? 4 : 4)}
              </motion.div>
              <div className={cn(
                'text-[10px] font-mono mt-1 flex items-center gap-1',
                rate.changePct >= 0 ? 'text-emerald-400' : 'text-red-400'
              )}>
                {rate.changePct >= 0 ? '▲' : '▼'} {Math.abs(rate.changePct).toFixed(3)}%
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/60 grid grid-cols-2 gap-1">
                <div>
                  <div className="text-[8px] text-slate-600">BID</div>
                  <div className="text-[10px] font-mono text-slate-400">{rate.bid.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-[8px] text-slate-600">ASK</div>
                  <div className="text-[10px] font-mono text-slate-400">{rate.ask.toFixed(4)}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Main chart + detail */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

          {/* Chart */}
          <Panel
            className="xl:col-span-3"
            title={`${selectedPair} — 24H Chart`}
            subtitle={`Bid/Ask spread · Volatility: ${selectedRate?.volatility.toFixed(2)}%`}
            headerRight={
              <div className="flex items-center gap-2">
                {(['line', 'area'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setChartType(t)}
                    className={cn(
                      'px-2 py-1 rounded text-[10px] font-medium cursor-pointer transition-colors capitalize',
                      chartType === t ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                    )}
                  >
                    {t}
                  </button>
                ))}
                <Badge variant="success" pulse>LIVE</Badge>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={280}>
              {chartType === 'area' ? (
                <AreaChart data={RATE_HISTORY_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} interval={7} />
                  <YAxis domain={['auto', 'auto']} tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(2)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey={chartKey} stroke="#22d3ee" strokeWidth={1.5} fill="url(#rateGrad)" name={selectedPair} dot={false} />
                </AreaChart>
              ) : (
                <LineChart data={RATE_HISTORY_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} interval={7} />
                  <YAxis domain={['auto', 'auto']} tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(2)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey={chartKey} stroke="#22d3ee" strokeWidth={1.5} dot={false} name={selectedPair} />
                </LineChart>
              )}
            </ResponsiveContainer>

            {/* OHLC strip */}
            {selectedRate && (
              <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-5 gap-3">
                {[
                  { label: 'Open', value: (selectedRate.mid - selectedRate.change).toFixed(4) },
                  { label: 'High', value: selectedRate.high24h.toFixed(4) },
                  { label: 'Low', value: selectedRate.low24h.toFixed(4) },
                  { label: 'Spread', value: `${(selectedRate.spread * 10000).toFixed(1)} pip` },
                  { label: 'Volume', value: `$${(selectedRate.volume / 1e9).toFixed(2)}B` },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <div className="text-[9px] text-slate-600 uppercase tracking-wider font-mono">{m.label}</div>
                    <div className="text-sm font-mono text-slate-300 mt-0.5">{m.value}</div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {/* Forward curve & insights */}
          <div className="space-y-4">
            <Panel title="Forward Points" subtitle={`${selectedPair} term structure`} dense>
              <div className="space-y-1.5">
                {forwardPoints.map(fp => (
                  <div key={fp.tenor} className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 w-8">{fp.tenor}</span>
                    <div className="flex-1 mx-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500/60 rounded-full"
                        style={{ width: `${(fp.points / 450) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 w-10 text-right">
                      +{fp.points.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Market Signals" dense>
              <div className="space-y-2.5">
                {MOCK_INSIGHTS.map((insight, i) => (
                  <div key={i} className="border-b border-slate-800/50 last:border-0 pb-2.5 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-semibold text-slate-300">{insight.pair}</span>
                      <Badge
                        variant={insight.signal === 'bullish' ? 'success' : insight.signal === 'bearish' ? 'danger' : 'muted'}
                        size="xs"
                      >
                        {insight.signal}
                      </Badge>
                    </div>
                    <div className="text-[9px] text-slate-500 leading-relaxed line-clamp-2">
                      {insight.recommendation}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-0.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full',
                            insight.signal === 'bullish' ? 'bg-emerald-400' : 'bg-red-400')}
                          style={{ width: `${insight.confidence}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-600 font-mono">{insight.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Quick Actions" dense>
              <div className="space-y-1.5">
                <Button variant="primary" size="sm" className="w-full" onClick={() => onNavigate('book-deal')}>
                  Book Deal on {selectedPair}
                </Button>
                <Button variant="secondary" size="sm" className="w-full">
                  Set Rate Alert
                </Button>
                <Button variant="ghost" size="sm" className="w-full">
                  Export Rate Sheet
                </Button>
              </div>
            </Panel>
          </div>
        </div>

        {/* Rate matrix */}
        <Panel title="Cross Rate Matrix" subtitle="Mid rates — all pairs">
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr>
                  <th className="text-[9px] text-slate-600 font-mono px-3 py-2 text-left">CCY</th>
                  {['USD', 'EUR', 'GBP', 'AED', 'SGD', 'JPY', 'INR'].map(c => (
                    <th key={c} className="text-[9px] text-slate-600 font-mono px-3 py-2">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { base: 'USD', vals: ['—', '0.9224', '0.7901', '3.673', '1.352', '149.8', '83.23'] },
                  { base: 'EUR', vals: ['1.0843', '—', '0.8566', '3.982', '1.466', '162.4', '90.22'] },
                  { base: 'GBP', vals: ['1.2659', '1.1675', '—', '4.651', '1.711', '189.6', '105.47'] },
                  { base: 'AED', vals: ['0.2723', '0.2512', '0.2151', '—', '0.3680', '40.78', '22.66'] },
                  { base: 'SGD', vals: ['0.7395', '0.6823', '0.5846', '2.717', '—', '110.8', '61.37'] },
                  { base: 'JPY', vals: ['0.0067', '0.0062', '0.0053', '0.0245', '0.0090', '—', '0.5524'] },
                  { base: 'INR', vals: ['0.0120', '0.0111', '0.0095', '0.0441', '0.0163', '1.810', '—'] },
                ].map(row => (
                  <tr key={row.base} className="border-t border-slate-800/50">
                    <td className="text-[10px] font-mono font-bold text-slate-400 px-3 py-2 text-left">{row.base}</td>
                    {row.vals.map((v, i) => (
                      <td key={i} className={cn('text-[10px] font-mono px-3 py-2', v === '—' ? 'text-slate-700' : 'text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors')}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

      </div>
    </div>
  );
};
