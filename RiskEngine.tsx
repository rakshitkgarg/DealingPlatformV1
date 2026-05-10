import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MOCK_RISK_LIMITS, MOCK_DEALS } from '../data/mockData';
import { cn } from '../utils/cn';

const varData = Array.from({ length: 30 }, (_, i) => ({
  day: `D-${30 - i}`,
  var: 1200000 + Math.sin(i * 0.4) * 400000 + Math.random() * 200000,
  limit: 2500000,
}));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1117] border border-slate-700/80 rounded-lg px-3 py-2 shadow-xl">
      <div className="text-[10px] text-slate-500 font-mono mb-1">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="text-xs font-mono" style={{ color: p.color }}>
          {p.name}: ${(p.value / 1e6).toFixed(2)}M
        </div>
      ))}
    </div>
  );
};

const anomalies = [
  { id: 'A1', type: 'Velocity Anomaly', pair: 'USD/INR', detail: '3 deals >$5M within 45min from single dealer', severity: 'high', dealCount: 3, score: 78 },
  { id: 'A2', type: 'Rate Deviation', pair: 'GBP/INR', detail: 'Customer rate 180bps above market benchmark', severity: 'medium', dealCount: 1, score: 55 },
  { id: 'A3', type: 'Counterparty Clustering', pair: 'AED/INR', detail: 'Same counterparty in 5 opposite-direction deals today', severity: 'medium', dealCount: 5, score: 62 },
];

export const RiskEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'limits' | 'var' | 'anomaly'>('limits');
  const [dismissed, setDismissed] = useState<string[]>([]);

  const breachLimits = MOCK_RISK_LIMITS.filter(l => l.status === 'breach');
  const warningLimits = MOCK_RISK_LIMITS.filter(l => l.status === 'warning');

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Syne'] text-xl font-bold text-slate-100">Risk Engine</h1>
            <p className="text-xs text-slate-500 mt-0.5">Autonomous limit validation · AI anomaly detection · Real-time monitoring</p>
          </div>
          <div className="flex items-center gap-2">
            {breachLimits.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span className="text-xs font-mono text-red-400">{breachLimits.length} BREACH</span>
              </div>
            )}
            {warningLimits.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-mono text-amber-400">{warningLimits.length} WARNING</span>
              </div>
            )}
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Limits Breached', value: breachLimits.length.toString(), accent: 'text-red-400', bg: 'bg-red-500/5 border-red-500/20' },
            { label: 'Warnings Active', value: warningLimits.length.toString(), accent: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/20' },
            { label: 'AI Anomalies', value: anomalies.filter(a => !dismissed.includes(a.id)).length.toString(), accent: 'text-violet-400', bg: 'bg-violet-500/5 border-violet-500/20' },
            { label: 'VaR Utilization', value: '74%', accent: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/20' },
          ].map(m => (
            <div key={m.label} className={cn('border rounded-xl p-4', m.bg)}>
              <div className="text-[9px] text-slate-600 font-mono uppercase tracking-wider mb-1">{m.label}</div>
              <div className={cn('text-2xl font-mono font-bold', m.accent)}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-800 rounded-lg p-1 w-fit">
          {[
            { id: 'limits', label: 'Limit Monitor' },
            { id: 'var', label: 'VaR Analysis' },
            { id: 'anomaly', label: 'AI Anomalies' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'px-4 py-1.5 rounded text-xs font-medium cursor-pointer transition-all',
                activeTab === tab.id ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {activeTab === 'limits' && (
            <motion.div
              key="limits"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              <Panel title="Real-Time Limit Status" subtitle="All dealer and institutional limits">
                <div className="space-y-4">
                  {MOCK_RISK_LIMITS.map((limit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-300 font-medium">{limit.type}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-500">
                            ${(limit.used / 1e6).toFixed(1)}M / ${(limit.limit / 1e6).toFixed(0)}M
                          </span>
                          <Badge
                            variant={limit.status === 'breach' ? 'danger' : limit.status === 'warning' ? 'warning' : 'success'}
                            size="xs"
                            pulse={limit.status === 'breach'}
                          >
                            {limit.utilizationPct}%
                          </Badge>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(limit.utilizationPct, 100)}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className={cn(
                            'h-full rounded-full relative overflow-hidden',
                            limit.status === 'breach' ? 'bg-red-500' : limit.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-500'
                          )}
                        >
                          {limit.status === 'breach' && (
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          )}
                        </motion.div>
                      </div>
                      {limit.status === 'breach' && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-[9px] text-red-400 font-mono">⚠ LIMIT BREACH — Escalation triggered</span>
                          <Button variant="danger" size="xs">Override</Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </Panel>

              <Panel title="Risk Scorecard" subtitle="Counterparty risk distribution">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={MOCK_DEALS.map(d => ({ ref: d.dealRef.slice(-4), score: d.riskScore, status: d.status }))}
                    margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="ref" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 8, fontSize: 10 }}
                      formatter={(v: any) => [`${v}/100`, 'Risk Score']}
                    />
                    <Bar dataKey="score" radius={[3, 3, 0, 0]} fill="#22d3ee" opacity={0.7} name="Risk Score" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="text-[10px] text-slate-600 font-mono uppercase tracking-wider mb-2">Risk Thresholds</div>
                  <div className="flex items-center gap-4">
                    {[
                      { label: 'Low (0-30)', color: 'bg-emerald-500' },
                      { label: 'Medium (30-60)', color: 'bg-amber-400' },
                      { label: 'High (60+)', color: 'bg-red-500' },
                    ].map(t => (
                      <div key={t.label} className="flex items-center gap-1.5">
                        <div className={cn('w-2 h-2 rounded-full', t.color)} />
                        <span className="text-[9px] text-slate-500 font-mono">{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            </motion.div>
          )}

          {activeTab === 'var' && (
            <motion.div
              key="var"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Panel title="Value at Risk (VaR) — 30 Day History" subtitle="95% confidence · 1-day VaR">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={varData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} interval={4} />
                    <YAxis tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="limit" stroke="#f43f5e" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Limit" />
                    <Line type="monotone" dataKey="var" stroke="#22d3ee" strokeWidth={2} dot={false} name="VaR" />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Current VaR', value: '$1.85M' },
                    { label: 'VaR Limit', value: '$2.50M' },
                    { label: 'Utilization', value: '74%' },
                    { label: 'Expected Shortfall', value: '$2.41M' },
                  ].map(m => (
                    <div key={m.label} className="text-center">
                      <div className="text-[9px] text-slate-600 font-mono uppercase tracking-wider mb-1">{m.label}</div>
                      <div className="text-sm font-mono font-semibold text-slate-300">{m.value}</div>
                    </div>
                  ))}
                </div>
              </Panel>
            </motion.div>
          )}

          {activeTab === 'anomaly' && (
            <motion.div
              key="anomaly"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="info" size="xs" pulse>AI POWERED</Badge>
                <span className="text-xs text-slate-500">Machine learning anomaly detection · Real-time behavioral analysis</span>
              </div>

              {anomalies.filter(a => !dismissed.includes(a.id)).map((anomaly, i) => (
                <motion.div
                  key={anomaly.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    'bg-[#0d1117] border rounded-xl p-4',
                    anomaly.severity === 'high' ? 'border-red-500/25' : 'border-amber-500/20'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                          'w-6 h-6 rounded-lg flex items-center justify-center text-sm',
                          anomaly.severity === 'high' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'
                        )}>
                          ⚠
                        </div>
                        <span className="text-sm font-semibold text-slate-200">{anomaly.type}</span>
                        <Badge variant={anomaly.severity === 'high' ? 'danger' : 'warning'} size="xs">
                          {anomaly.severity}
                        </Badge>
                        <Badge variant="muted" size="xs">{anomaly.pair}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">{anomaly.detail}</p>
                      <div className="flex items-center gap-4">
                        <div className="text-[10px] text-slate-600 font-mono">
                          AI Score: <span className={cn(
                            'font-bold',
                            anomaly.score > 70 ? 'text-red-400' : 'text-amber-400'
                          )}>{anomaly.score}/100</span>
                        </div>
                        <div className="text-[10px] text-slate-600 font-mono">
                          Deals involved: <span className="text-slate-400">{anomaly.dealCount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => setDismissed(d => [...d, anomaly.id])}>
                        Dismiss
                      </Button>
                      <Button variant="danger" size="sm">Investigate</Button>
                    </div>
                  </div>

                  {/* AI score bar */}
                  <div className="mt-3 pt-3 border-t border-slate-800/60">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-slate-600 font-mono w-20">Anomaly Score</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', anomaly.score > 70 ? 'bg-red-500' : 'bg-amber-400')}
                          style={{ width: `${anomaly.score}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{anomaly.score}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {dismissed.length === anomalies.length && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <p className="text-sm text-slate-500">All anomalies reviewed</p>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
};
