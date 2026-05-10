import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { INITIAL_FX_RATES } from '../data/mockData';
import type { FXRate } from '../types';
import { cn } from '../utils/cn';

function perturbRate(rate: FXRate): FXRate {
  const delta = (Math.random() - 0.495) * rate.volatility * 0.001 * rate.mid;
  const newMid = rate.mid + delta;
  return { ...rate, mid: newMid, bid: newMid - rate.spread / 2, ask: newMid + rate.spread / 2, timestamp: Date.now() };
}

interface LandingProps {
  onEnter: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  const [rates, setRates] = useState(INITIAL_FX_RATES);
  const [prevRates, setPrevRates] = useState(INITIAL_FX_RATES);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevRates(rates);
      setRates(prev => prev.map(perturbRate));
    }, 800);
    return () => clearInterval(interval);
  }, [rates]);

  const features = [
    {
      label: 'Live FX Intelligence',
      desc: 'WebSocket-driven bid/ask rates across 50+ currency pairs with institutional-grade spread analytics and forward curve visualization.',
      icon: '◈',
      accent: 'cyan',
    },
    {
      label: 'AI-Powered Deal Execution',
      desc: 'One-click execution with ML-based margin optimization, RFQ workflows, smart templates, and real-time compliance validation.',
      icon: '⬡',
      accent: 'emerald',
    },
    {
      label: 'Autonomous Risk Engine',
      desc: 'Real-time limit monitoring, counterparty scoring, behavioral anomaly detection, and automated escalation workflows.',
      icon: '◉',
      accent: 'amber',
    },
    {
      label: 'Exposure & P&L Engine',
      desc: 'Auto-netting, maturity bucket analysis, hedge ratio optimization, and multi-currency unrealized P&L tracking.',
      icon: '⬢',
      accent: 'violet',
    },
    {
      label: 'Compliance Automation',
      desc: 'OFAC screening, AML monitoring, FEMA/RBI reporting, maker-checker workflows, and tamper-proof audit trails.',
      icon: '◎',
      accent: 'red',
    },
    {
      label: 'Client Profitability Analytics',
      desc: 'Margin history, price elasticity modeling, churn risk scoring, and AI-driven revenue optimization recommendations.',
      icon: '◇',
      accent: 'cyan',
    },
  ];

  const stats = [
    { val: '$2.4T', label: 'Daily Volume Processed' },
    { val: '148', label: 'Institutional Clients' },
    { val: '99.97%', label: 'System Uptime SLA' },
    { val: '<40ms', label: 'Rate Update Latency' },
  ];

  return (
    <div className="min-h-screen bg-[#050810] text-slate-100 overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 bg-[#050810]/90 backdrop-blur-xl border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
            <span className="text-cyan-400 text-xs font-bold">P</span>
          </div>
          <div>
            <div className="font-['Syne'] font-bold text-sm text-slate-100 leading-none">PLUGZO</div>
            <div className="text-[8px] text-cyan-500 font-mono tracking-[0.2em]">FX NEXUS</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {['Platform', 'Solutions', 'Compliance', 'Pricing', 'Docs'].map(item => (
            <button key={item} className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer font-medium">
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onEnter}>Sign in</Button>
          <Button variant="primary" size="sm" onClick={onEnter}>Request Demo</Button>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/4 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/4 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-800/10 rounded-full blur-3xl" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Floating rate panels */}
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          {/* Left rate card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute top-1/4 left-8 xl:left-24 w-52 bg-[#0d1117]/80 border border-slate-800/80 rounded-xl p-4 backdrop-blur-md"
          >
            <div className="text-[9px] text-slate-600 font-mono uppercase tracking-wider mb-3">Live Rates</div>
            {rates.slice(0, 4).map((r, i) => (
              <div key={r.pair} className="flex items-center justify-between py-1 border-b border-slate-800/40 last:border-0">
                <span className="text-[10px] font-mono text-slate-500">{r.pair}</span>
                <motion.span
                  key={r.timestamp}
                  initial={{ color: '#22d3ee' }}
                  animate={{ color: '#94a3b8' }}
                  transition={{ duration: 0.5 }}
                  className="text-[10px] font-mono text-slate-400"
                >
                  {r.mid.toFixed(4)}
                </motion.span>
              </div>
            ))}
          </motion.div>

          {/* Right AI signal */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="absolute top-1/3 right-8 xl:right-24 w-60 bg-[#0d1117]/80 border border-cyan-500/20 rounded-xl p-4 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[9px] text-cyan-500 font-mono uppercase tracking-wider">AI Signal</span>
            </div>
            <div className="text-xs font-semibold text-slate-200 mb-1">USD/INR — BULLISH</div>
            <div className="text-[10px] text-slate-500 mb-2">Target: 83.65 · 91% confidence</div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '91%' }} />
            </div>
          </motion.div>

          {/* Bottom deal confirmation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-72 bg-[#0d1117]/80 border border-emerald-500/20 rounded-xl p-3 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 text-xs">✓</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Deal Executed — PFN-2025-084521</span>
            </div>
            <div className="text-[9px] text-slate-500 font-mono">TCS · USD/INR SELL · $5M · ₹83.28 · +₹17.5L margin</div>
          </motion.div>
        </motion.div>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <Badge variant="info" size="sm" pulse>Enterprise FX · Treasury Intelligence · Institutional Grade</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-['Syne'] text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight mb-6"
          >
            <span className="text-slate-100">The Operating</span>
            <br />
            <span className="text-slate-100">System for</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
              Institutional FX
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-light"
          >
            Plugzo FX Nexus unifies live pricing, intelligent deal execution, autonomous risk controls,
            and AI-powered analytics into a single institutional-grade workspace for treasury desks,
            banks, and corporate treasury teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="primary" size="lg" onClick={onEnter}>
              Launch Platform
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Button>
            <Button variant="outline" size="lg">
              Watch Overview
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-800/60 bg-slate-900/20">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-['Syne'] text-3xl md:text-4xl font-bold text-cyan-400 mb-1">{stat.val}</div>
                <div className="text-xs text-slate-600 uppercase tracking-wider font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-[10px] text-cyan-500 font-mono uppercase tracking-[0.3em] mb-4">Platform Capabilities</div>
            <h2 className="font-['Syne'] text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              Built for Institutional Precision
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
              Every workflow engineered to institutional standards, from deal booking to regulatory reporting.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group p-6 bg-[#0d1117] border border-slate-800/80 rounded-2xl hover:border-slate-700/80 transition-all duration-200"
              >
                <div className={cn(
                  'text-2xl mb-4 transition-all duration-200 group-hover:scale-110 inline-block',
                  feat.accent === 'cyan' ? 'text-cyan-400' :
                  feat.accent === 'emerald' ? 'text-emerald-400' :
                  feat.accent === 'amber' ? 'text-amber-400' :
                  feat.accent === 'violet' ? 'text-violet-400' :
                  feat.accent === 'red' ? 'text-red-400' : 'text-cyan-400'
                )}>
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-slate-200 mb-2 text-sm">{feat.label}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role showcase */}
      <section className="py-20 px-6 border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[10px] text-cyan-500 font-mono uppercase tracking-[0.3em] mb-4">Role-Based Intelligence</div>
          <h2 className="font-['Syne'] text-2xl md:text-3xl font-bold text-slate-100 mb-8">
            Designed for Every Stakeholder
          </h2>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {['Treasury Dealers', 'FX Desk Heads', 'Risk Managers', 'Compliance Officers', 'Branch Users', 'Corporate Clients', 'Relationship Managers', 'Super Admins'].map(role => (
              <div key={role} className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg text-xs text-slate-400 font-medium">
                {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-slate-900/30">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-['Syne'] text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              Ready to reimagine your FX desk?
            </h2>
            <p className="text-slate-500 text-base mb-8 leading-relaxed">
              Join treasury teams at leading banks and corporates using Plugzo FX Nexus to drive precision, efficiency, and revenue.
            </p>
            <Button variant="primary" size="lg" onClick={onEnter}>
              Enter the Platform
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-['Syne'] text-sm font-bold text-slate-500">PLUGZO FX NEXUS</span>
            <span className="text-slate-700">·</span>
            <span className="text-xs text-slate-700">Institutional Treasury Intelligence</span>
          </div>
          <div className="text-xs text-slate-700 font-mono">© 2025 Plugzo Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};
