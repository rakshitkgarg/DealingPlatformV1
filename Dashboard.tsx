import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';
import { MetricCard } from '../components/ui/MetricCard';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useFXRates } from '../components/FXTicker';
import {
  MOCK_DEALS, REVENUE_CHART_DATA, VOLUME_BY_PAIR, BRANCH_PERFORMANCE,
  MOCK_RISK_LIMITS, MOCK_COMPLIANCE_ALERTS, MOCK_INSIGHTS, RATE_HISTORY_DATA, DEAL_FLOW_DATA
} from '../data/mockData';
import type { ViewType } from '../types';
import { cn } from '../utils/cn';

const fmt = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`;
  return `₹${n.toLocaleString()}`;
};

const fmtUSD = (n: number) => {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1117] border border-slate-700/80 rounded-lg px-3 py-2 shadow-xl">
      <div className="text-[10px] text-slate-500 font-mono mb-1">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="text-xs font-mono" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.value > 1000000 ? fmtUSD(p.value) : p.value}
        </div>
      ))}
    </div>
  );
};

interface DashboardProps {
  onNavigate: (view: ViewType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const rates = useFXRates();

  const todayDeals = MOCK_DEALS.filter(d => d.status === 'executed');
  const todayRevenue = todayDeals.reduce((s, d) => s + (d.margin || 0), 0);
  const totalVolume = todayDeals.reduce((s, d) => s + d.notional, 0);
  const pendingApprovals = MOCK_DEALS.filter(d => d.status === 'pending').length;

  const stagger = {
    container: { transition: { staggerChildren: 0.06 } },
    item: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-5 max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-['Syne'] text-xl font-bold text-slate-100 leading-none">Command Center</h1>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              {new Date().toLocaleString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} IST
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-mono font-medium">MARKET OPEN</span>
            </div>
            <Button variant="primary" size="sm" onClick={() => onNavigate('book-deal')}
              icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>}
            >
              Book Deal
            </Button>
          </div>
        </div>

        {/* KPI Row */}
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3"
        >
          {[
            { label: "Today's Revenue", value: fmt(todayRevenue + 318000), change: 14.2, accent: 'cyan' as const,
              icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg> },
            { label: 'Deal Volume', value: fmtUSD(totalVolume + 185000000), change: 8.7, accent: 'emerald' as const,
              icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg> },
            { label: 'Deals Today', value: '148', change: 5.1, accent: 'slate' as const,
              icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg> },
            { label: 'Pending Approvals', value: String(pendingApprovals + 2), accent: pendingApprovals > 0 ? 'amber' as const : 'slate' as const,
              icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg> },
            { label: 'Avg Spread (bps)', value: '28', change: -3.2, accent: 'violet' as const,
              icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg> },
            { label: 'Risk Alerts', value: '2', accent: 'red' as const,
              icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg> },
          ].map((m, i) => (
            <motion.div key={i} variants={stagger.item as any}>
              <MetricCard {...m} />
            </motion.div>
          ))}
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Revenue chart - 2 cols */}
          <Panel title="Revenue vs Target" subtitle="Last 7 months"
            className="xl:col-span-2"
            headerRight={
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cyan-400" /><span className="text-[10px] text-slate-500">Revenue</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-600" /><span className="text-[10px] text-slate-500">Target</span></div>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={REVENUE_CHART_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1e6).toFixed(0)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="target" stroke="#334155" strokeWidth={1.5} fill="none" strokeDasharray="4 4" name="Target" />
                <Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          {/* Volume by pair */}
          <Panel title="Volume by Pair" subtitle="Today's distribution">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={VOLUME_BY_PAIR} dataKey="volume" nameKey="pair" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2}>
                  {VOLUME_BY_PAIR.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1">
              {VOLUME_BY_PAIR.slice(0, 4).map(p => (
                <div key={p.pair} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                    <span className="text-[10px] text-slate-400 font-mono">{p.pair}</span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-mono">{p.volume}%</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Mid section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Rate chart */}
          <Panel title="USD/INR Rate Chart" subtitle="Last 24h (30-min intervals)"
            className="xl:col-span-2"
            headerRight={
              <div className="flex items-center gap-1.5 px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded">
                <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] text-cyan-400 font-mono">{rates[0]?.mid.toFixed(4)}</span>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={RATE_HISTORY_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} interval={7} />
                <YAxis domain={['auto', 'auto']} tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(2)} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="USD/INR" stroke="#22d3ee" strokeWidth={1.5} dot={false} name="USD/INR" />
              </LineChart>
            </ResponsiveContainer>
          </Panel>

          {/* Risk limits */}
          <Panel title="Risk Limits" subtitle="Live utilization"
            headerRight={<Badge variant="warning" pulse>MONITORED</Badge>}
          >
            <div className="space-y-3">
              {MOCK_RISK_LIMITS.map((limit, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-400 truncate pr-2">{limit.type}</span>
                    <span className={cn(
                      'text-[10px] font-mono font-semibold',
                      limit.status === 'breach' ? 'text-red-400' : limit.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                    )}>
                      {limit.utilizationPct}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${limit.utilizationPct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={cn(
                        'h-full rounded-full',
                        limit.status === 'breach' ? 'bg-red-500' : limit.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-500'
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Recent deals */}
          <Panel title="Recent Deals" subtitle="Last 8 transactions" className="xl:col-span-2"
            headerRight={
              <Button variant="ghost" size="xs" onClick={() => onNavigate('deals')}>View all</Button>
            }
            noPad
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/80">
                    <th className="text-left text-[9px] text-slate-600 uppercase tracking-wider font-medium px-5 py-2.5">Ref</th>
                    <th className="text-left text-[9px] text-slate-600 uppercase tracking-wider font-medium px-3 py-2.5">Client</th>
                    <th className="text-left text-[9px] text-slate-600 uppercase tracking-wider font-medium px-3 py-2.5">Pair</th>
                    <th className="text-right text-[9px] text-slate-600 uppercase tracking-wider font-medium px-3 py-2.5">Notional</th>
                    <th className="text-right text-[9px] text-slate-600 uppercase tracking-wider font-medium px-3 py-2.5">Margin</th>
                    <th className="text-center text-[9px] text-slate-600 uppercase tracking-wider font-medium px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_DEALS.map((deal, i) => (
                    <motion.tr
                      key={deal.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-2.5">
                        <span className="text-[10px] font-mono text-cyan-400">{deal.dealRef.replace('PFN-2025-', '')}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs text-slate-300 truncate max-w-[120px] block">{deal.client}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <Badge variant={deal.direction === 'buy' ? 'info' : 'success'} size="xs">
                            {deal.direction === 'buy' ? 'B' : 'S'}
                          </Badge>
                          <span className="text-[10px] font-mono text-slate-400">{deal.pair}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <span className="text-[10px] font-mono text-slate-300">{fmtUSD(deal.notional)}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <span className={cn('text-[10px] font-mono', (deal.margin || 0) >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                          {(deal.margin || 0) >= 0 ? '+' : ''}{fmt(deal.margin || 0)}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <Badge
                          variant={deal.status === 'executed' ? 'success' : deal.status === 'approved' ? 'info' : deal.status === 'pending' ? 'warning' : deal.status === 'rejected' ? 'danger' : 'muted'}
                          size="xs"
                        >
                          {deal.status}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* AI Insights panel */}
          <div className="space-y-3">
            <Panel title="AI Market Intelligence" subtitle="Confidence-weighted signals"
              headerRight={<Badge variant="info" pulse>AI LIVE</Badge>}
            >
              <div className="space-y-3">
                {MOCK_INSIGHTS.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/40"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-200">{insight.pair}</span>
                        <Badge
                          variant={insight.signal === 'bullish' ? 'success' : insight.signal === 'bearish' ? 'danger' : 'muted'}
                          size="xs"
                        >
                          {insight.signal}
                        </Badge>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{insight.confidence}% conf.</div>
                    </div>
                    <div className="h-1 bg-slate-700 rounded-full mb-2 overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', insight.signal === 'bullish' ? 'bg-emerald-400' : insight.signal === 'bearish' ? 'bg-red-400' : 'bg-slate-400')}
                        style={{ width: `${insight.confidence}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{insight.recommendation}</p>
                    {insight.targetRate && (
                      <div className="mt-1.5 text-[9px] text-slate-600 font-mono">Target: {insight.targetRate} · {insight.horizon}</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Panel>

            {/* Compliance alerts */}
            <Panel title="Compliance Alerts" dense
              headerRight={<Button size="xs" variant="ghost" onClick={() => onNavigate('compliance')}>View all</Button>}
            >
              <div className="space-y-2">
                {MOCK_COMPLIANCE_ALERTS.slice(0, 3).map((alert, i) => (
                  <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-slate-800/50 last:border-0">
                    <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0',
                      alert.severity === 'critical' ? 'bg-red-400 animate-pulse' :
                      alert.severity === 'high' ? 'bg-red-400' :
                      alert.severity === 'medium' ? 'bg-amber-400' : 'bg-slate-500'
                    )} />
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 leading-snug truncate">{alert.message}</p>
                      <div className="text-[9px] text-slate-600 mt-0.5 font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                    </div>
                    <Badge variant={alert.severity === 'critical' ? 'danger' : alert.severity === 'high' ? 'danger' : 'warning'} size="xs">
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        {/* Branch performance */}
        <Panel title="Branch Performance" subtitle="YTD revenue vs target">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={BRANCH_PERFORMANCE} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="branch" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1e6).toFixed(0)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="target" fill="#1e293b" radius={[2, 2, 0, 0]} name="Target" />
              <Bar dataKey="revenue" fill="#22d3ee" radius={[2, 2, 0, 0]} opacity={0.85} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

      </div>
    </div>
  );
};
