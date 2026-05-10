import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, LineChart, Line
} from 'recharts';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { REVENUE_CHART_DATA, BRANCH_PERFORMANCE, MOCK_INSIGHTS, MOCK_CLIENTS } from '../data/mockData';
import { cn } from '../utils/cn';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1117] border border-slate-700/80 rounded-lg px-3 py-2">
      <div className="text-[10px] text-slate-500 font-mono mb-1">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="text-xs font-mono" style={{ color: p.color }}>
          {p.name}: {p.value > 1000 ? `₹${(p.value / 1e6).toFixed(2)}M` : p.value}
        </div>
      ))}
    </div>
  );
};

const scatterData = MOCK_CLIENTS.map(c => ({
  name: c.name.split(' ')[0],
  volume: c.ytdVolume / 1e8,
  margin: c.avgMarginBps,
  revenue: c.ytdRevenue / 1e5,
}));

const marginTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  'USD/INR': 18 + Math.sin(i * 0.3) * 5 + Math.random() * 3,
  'EUR/USD': 14 + Math.cos(i * 0.25) * 4 + Math.random() * 2,
  'GBP/INR': 28 + Math.sin(i * 0.4) * 8 + Math.random() * 4,
}));

const aiRecommendations = [
  {
    type: 'Revenue Opportunity',
    priority: 'high',
    impact: '₹48L',
    title: 'Spread Optimization — USD/INR Spot',
    description: 'Analysis of 842 USD/INR spot deals shows average dealer spread of 22bps vs market best of 28bps. Incremental 6bps across projected monthly volume of ₹8,000Cr yields estimated uplift.',
    confidence: 91,
  },
  {
    type: 'Client Engagement',
    priority: 'medium',
    impact: '₹12L',
    title: 'Forward Sales Push — Infosys',
    description: 'Infosys has ₹400Cr in Q2 receivables without hedge coverage. Current EUR/USD at 1.0865 represents attractive entry for export hedge. Proactive outreach recommended within 48 hours.',
    confidence: 76,
  },
  {
    type: 'Product Upsell',
    priority: 'medium',
    impact: '₹8L',
    title: 'NDF Introduction — JPY/INR',
    description: 'Bajaj Auto has recurring JPY exposure (automotive imports) managed via spot. NDF products at current term premium could provide superior hedge with lower roll cost. Introduce via Relationship Manager.',
    confidence: 68,
  },
  {
    type: 'Risk Alert',
    priority: 'high',
    impact: '−₹35L',
    title: 'TCS Credit Limit Imminent Breach',
    description: 'TCS credit utilization at 96%. Three pending deals totaling $8M would trigger breach. Recommend requesting temporary credit enhancement or requiring collateral top-up before processing.',
    confidence: 98,
  },
];

export const Analytics: React.FC = () => {
  const [activeInsight, setActiveInsight] = useState(0);

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="max-w-[1400px] mx-auto space-y-5">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Syne'] text-xl font-bold text-slate-100">Analytics & AI Intelligence</h1>
            <p className="text-xs text-slate-500 mt-0.5">Revenue analytics · Margin intelligence · AI recommendations · Predictive insights</p>
          </div>
          <Badge variant="info" pulse>AI ENGINE LIVE</Badge>
        </div>

        {/* AI Recommendations */}
        <Panel title="AI Business Recommendations" subtitle="Confidence-weighted · Actionable insights" headerRight={<Badge variant="info" size="xs">4 insights</Badge>}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {aiRecommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setActiveInsight(i)}
                className={cn(
                  'p-4 rounded-xl border cursor-pointer transition-all duration-200',
                  activeInsight === i ? 'bg-cyan-500/5 border-cyan-500/30' : 'bg-slate-800/20 border-slate-800/60 hover:border-slate-700'
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={rec.priority === 'high' ? (rec.type === 'Risk Alert' ? 'danger' : 'success') : 'warning'}
                      size="xs"
                    >
                      {rec.priority}
                    </Badge>
                    <span className="text-[9px] text-slate-600 font-mono uppercase">{rec.type}</span>
                  </div>
                  <div className={cn(
                    'text-sm font-mono font-bold',
                    rec.impact.startsWith('−') ? 'text-red-400' : 'text-emerald-400'
                  )}>
                    {rec.impact}
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-200 mb-1.5">{rec.title}</div>
                <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{rec.description}</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full',
                        rec.confidence >= 90 ? 'bg-emerald-400' : rec.confidence >= 70 ? 'bg-cyan-400' : 'bg-amber-400'
                      )}
                      style={{ width: `${rec.confidence}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-600 font-mono">{rec.confidence}% conf.</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Panel>

        {/* Charts grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          <Panel title="Revenue Trend" subtitle="Monthly performance vs target">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={REVENUE_CHART_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="aRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1e6).toFixed(0)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="target" stroke="#334155" fill="none" strokeDasharray="4 4" strokeWidth={1.5} name="Target" />
                <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fill="url(#aRev)" strokeWidth={2} dot={false} name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Margin by Pair" subtitle="30-day rolling average (bps)">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={marginTrend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 8, fontSize: 10 }} />
                <Line type="monotone" dataKey="USD/INR" stroke="#22d3ee" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="EUR/USD" stroke="#a3e635" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="GBP/INR" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Client Volume vs Margin" subtitle="Bubble = revenue contribution">
            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="volume" name="Volume ($B)" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} label={{ value: 'Volume', fill: '#475569', fontSize: 9, dy: 10 }} />
                <YAxis dataKey="margin" name="Margin (bps)" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
                <ZAxis dataKey="revenue" range={[40, 400]} name="Revenue" />
                <Tooltip
                  contentStyle={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 8, fontSize: 10 }}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Scatter data={scatterData} fill="#22d3ee" opacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Branch Performance" subtitle="YTD revenue vs target">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={BRANCH_PERFORMANCE} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="branch" tick={{ fill: '#475569', fontSize: 8, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1e6).toFixed(0)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="target" fill="#1e293b" radius={[2, 2, 0, 0]} name="Target" />
                <Bar dataKey="revenue" fill="#22d3ee" radius={[2, 2, 0, 0]} opacity={0.85} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        {/* Market signals */}
        <Panel title="AI Market Signals" subtitle="Forward-looking pair intelligence">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_INSIGHTS.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className="bg-slate-800/30 rounded-xl p-4 border border-slate-800/60"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-base font-mono font-bold text-slate-200">{insight.pair}</div>
                    <div className="text-[9px] text-slate-600 font-mono">{insight.horizon} outlook</div>
                  </div>
                  <Badge
                    variant={insight.signal === 'bullish' ? 'success' : insight.signal === 'bearish' ? 'danger' : 'muted'}
                    size="xs"
                  >
                    {insight.signal}
                  </Badge>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-slate-600 font-mono">AI Confidence</span>
                    <span className="text-[10px] font-mono text-slate-400">{insight.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full',
                        insight.signal === 'bullish' ? 'bg-emerald-400' : insight.signal === 'bearish' ? 'bg-red-400' : 'bg-slate-500'
                      )}
                      style={{ width: `${insight.confidence}%` }}
                    />
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed">{insight.recommendation}</p>

                {insight.targetRate && (
                  <div className="mt-2 pt-2 border-t border-slate-800/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-600 font-mono">Target Rate</span>
                      <span className="text-xs font-mono text-cyan-400">{insight.targetRate}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Panel>

      </div>
    </div>
  );
};
