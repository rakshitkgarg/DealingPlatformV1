import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useFXRates } from '../components/FXTicker';
import { MOCK_CLIENTS } from '../data/mockData';
import { cn } from '../utils/cn';
import type { ViewType } from '../types';

type DealStep = 'details' | 'pricing' | 'review' | 'confirm';

const STEPS: { id: DealStep; label: string }[] = [
  { id: 'details', label: 'Deal Details' },
  { id: 'pricing', label: 'AI Pricing' },
  { id: 'review', label: 'Review & Risk' },
  { id: 'confirm', label: 'Confirm' },
];

const PAIRS = ['USD/INR', 'EUR/USD', 'GBP/INR', 'AED/INR', 'SGD/INR', 'JPY/INR'];
const DEAL_TYPES = ['Spot', 'Forward', 'Swap', 'NDF'];

function formatRate(r: number, pair: string) {
  return r.toFixed(pair.includes('JPY') && pair.length === 7 ? 3 : 4);
}

interface BookDealProps {
  onNavigate: (view: ViewType) => void;
}

export const BookDeal: React.FC<BookDealProps> = ({ onNavigate }) => {
  const rates = useFXRates();
  const [step, setStep] = useState<DealStep>('details');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [form, setForm] = useState({
    client: '',
    pair: 'USD/INR',
    direction: 'sell' as 'buy' | 'sell',
    type: 'Spot',
    notional: '',
    valueDate: new Date().toISOString().split('T')[0],
    maturityDate: '',
    hedgeTag: '',
    notes: '',
    customerRate: '',
    spreadBps: '25',
    approvalRequired: false,
  });

  const [aiSuggestion, setAiSuggestion] = useState<{
    suggestedSpread: number;
    confidence: number;
    rationale: string;
    conversionProb: number;
    benchmarkSpread: number;
  } | null>(null);

  const selectedRate = rates.find(r => r.pair === form.pair);
  const marketRate = selectedRate?.mid || 83.23;
  const spreadPct = parseFloat(form.spreadBps) / 10000;
  const customerRate = form.direction === 'sell'
    ? marketRate + marketRate * spreadPct
    : marketRate - marketRate * spreadPct;
  const notionalNum = parseFloat(form.notional.replace(/,/g, '')) || 0;
  const marginAmount = notionalNum * Math.abs(spreadPct) * marketRate;

  const riskScore = (() => {
    if (notionalNum > 10000000) return 45;
    if (notionalNum > 5000000) return 28;
    if (notionalNum > 1000000) return 15;
    return 8;
  })();

  const generateAI = () => {
    setLoading(true);
    setTimeout(() => {
      setAiSuggestion({
        suggestedSpread: 22,
        confidence: 84,
        rationale: 'Based on historical margin analysis for this client segment (Gold), current USD/INR volatility (0.42%), and competitive market positioning. Recommend 22bps to optimize conversion probability while maintaining target margin.',
        conversionProb: 87,
        benchmarkSpread: 28,
      });
      setLoading(false);
      setStep('pricing');
    }, 1400);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  const stepIndex = STEPS.findIndex(s => s.id === step);
  const dealRef = `PFN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(6, '0')}`;

  if (submitted) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-10 h-10 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <motion.polyline points="20 6 9 17 4 12" />
            </motion.svg>
          </div>
          <h2 className="font-['Syne'] text-2xl font-bold text-slate-100 mb-2">Deal Booked Successfully</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Deal reference <span className="font-mono text-cyan-400">{dealRef}</span> has been submitted and is pending compliance clearance.
          </p>
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 text-left mb-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Pair', form.pair],
                ['Direction', form.direction.toUpperCase()],
                ['Notional', `${parseFloat(form.notional.replace(/,/g, '')).toLocaleString()}`],
                ['Rate', formatRate(customerRate, form.pair)],
                ['Margin', `₹${marginAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`],
                ['Status', form.approvalRequired ? 'Pending Approval' : 'Sent to Compliance'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[9px] text-slate-600 uppercase tracking-wider font-mono">{k}</div>
                  <div className="text-xs text-slate-300 font-mono mt-0.5">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => { setSubmitted(false); setStep('details'); setForm(f => ({ ...f, notional: '', hedgeTag: '', notes: '' })); }}>
              Book Another
            </Button>
            <Button variant="primary" onClick={() => onNavigate('deals')}>
              View Blotter
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-['Syne'] text-xl font-bold text-slate-100">Book New Deal</h1>
            <p className="text-xs text-slate-500 mt-0.5">AI-assisted FX deal execution with real-time pricing</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-600 font-mono">Market Rate</div>
            <motion.div
              key={marketRate.toFixed(4)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-mono font-bold text-cyan-400"
            >
              {formatRate(marketRate, form.pair)}
            </motion.div>
            <div className="text-[9px] text-slate-600 font-mono">{form.pair}</div>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300',
                  i < stepIndex ? 'border-emerald-500 bg-emerald-500 text-white' :
                  i === stepIndex ? 'border-cyan-400 bg-cyan-400/15 text-cyan-400' :
                  'border-slate-700 bg-transparent text-slate-600'
                )}>
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                <span className={cn(
                  'text-xs font-medium hidden sm:block',
                  i === stepIndex ? 'text-slate-200' : i < stepIndex ? 'text-emerald-400' : 'text-slate-600'
                )}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('flex-1 h-px mx-3 transition-colors duration-300', i < stepIndex ? 'bg-emerald-500/50' : 'bg-slate-800')} />
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* Step 1: Details */}
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              <Panel title="Deal Parameters" className="lg:col-span-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* Client */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1.5">Client</label>
                    <select
                      value={form.client}
                      onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                      className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60 cursor-pointer transition-colors"
                    >
                      <option value="">Select client...</option>
                      {MOCK_CLIENTS.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {form.client && (
                      <div className="mt-1.5 flex items-center gap-2">
                        {(() => {
                          const c = MOCK_CLIENTS.find(x => x.id === form.client);
                          return c ? (
                            <>
                              <Badge variant="info" size="xs">{c.segment}</Badge>
                              <span className="text-[9px] text-slate-600 font-mono">
                                Credit: ${((c.creditLimit - c.creditUsed) / 1e6).toFixed(1)}M avail.
                              </span>
                            </>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Deal Type */}
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1.5">Deal Type</label>
                    <div className="grid grid-cols-2 gap-1">
                      {DEAL_TYPES.map(t => (
                        <button
                          key={t}
                          onClick={() => setForm(f => ({ ...f, type: t }))}
                          className={cn(
                            'px-2 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 cursor-pointer',
                            form.type === t
                              ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
                              : 'bg-slate-800/50 border-slate-700/60 text-slate-500 hover:text-slate-300 hover:border-slate-600'
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Currency Pair */}
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1.5">Currency Pair</label>
                    <div className="space-y-1">
                      {PAIRS.map(p => (
                        <button
                          key={p}
                          onClick={() => setForm(f => ({ ...f, pair: p }))}
                          className={cn(
                            'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-mono border transition-all duration-150 cursor-pointer',
                            form.pair === p
                              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                              : 'bg-slate-800/40 border-slate-700/40 text-slate-500 hover:text-slate-300 hover:border-slate-600'
                          )}
                        >
                          <span>{p}</span>
                          <span className={cn(form.pair === p ? 'text-cyan-400' : 'text-slate-600')}>
                            {formatRate(rates.find(r => r.pair === p)?.mid || 0, p)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Direction & Notional */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1.5">Direction</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['buy', 'sell'] as const).map(d => (
                          <button
                            key={d}
                            onClick={() => setForm(f => ({ ...f, direction: d }))}
                            className={cn(
                              'py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 cursor-pointer',
                              form.direction === d && d === 'buy' ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400' :
                              form.direction === d && d === 'sell' ? 'bg-red-500/15 border-red-500 text-red-400' :
                              'bg-slate-800/40 border-slate-700 text-slate-600 hover:border-slate-500'
                            )}
                          >
                            {d === 'buy' ? '▲ BUY' : '▼ SELL'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1.5">Notional Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">$</span>
                        <input
                          type="text"
                          value={form.notional}
                          onChange={e => setForm(f => ({ ...f, notional: e.target.value }))}
                          placeholder="1,000,000"
                          className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg pl-7 pr-3 py-2 text-sm font-mono text-slate-200 outline-none focus:border-cyan-500/60 placeholder-slate-700"
                        />
                      </div>
                      <div className="flex gap-2 mt-1.5">
                        {['100K', '500K', '1M', '5M', '10M'].map(preset => (
                          <button
                            key={preset}
                            onClick={() => setForm(f => ({ ...f, notional: preset === '100K' ? '100000' : preset === '500K' ? '500000' : preset === '1M' ? '1000000' : preset === '5M' ? '5000000' : '10000000' }))}
                            className="text-[9px] text-slate-600 hover:text-cyan-400 font-mono cursor-pointer transition-colors"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1.5">Value Date</label>
                      <input
                        type="date"
                        value={form.valueDate}
                        onChange={e => setForm(f => ({ ...f, valueDate: e.target.value }))}
                        className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 outline-none focus:border-cyan-500/60"
                      />
                    </div>

                    {(form.type === 'Forward' || form.type === 'Swap') && (
                      <div>
                        <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1.5">Maturity Date</label>
                        <input
                          type="date"
                          value={form.maturityDate}
                          onChange={e => setForm(f => ({ ...f, maturityDate: e.target.value }))}
                          className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 outline-none focus:border-cyan-500/60"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1.5">Hedge Tag (Optional)</label>
                      <input
                        type="text"
                        value={form.hedgeTag}
                        onChange={e => setForm(f => ({ ...f, hedgeTag: e.target.value }))}
                        placeholder="e.g. HDG-2025-Q1"
                        className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 outline-none focus:border-cyan-500/60 placeholder-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => onNavigate('deals')}>Cancel</Button>
                <Button
                  variant="primary"
                  loading={loading}
                  onClick={generateAI}
                  disabled={!form.client || !form.notional}
                  icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>}
                >
                  Get AI Pricing
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: AI Pricing */}
          {step === 'pricing' && aiSuggestion && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* AI Suggestion */}
                <Panel className="lg:col-span-2" title="AI Margin Recommendation" headerRight={<Badge variant="info" pulse>AI GENERATED</Badge>}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: 'Suggested Spread', value: `${aiSuggestion.suggestedSpread} bps`, accent: 'text-cyan-400' },
                      { label: 'Confidence', value: `${aiSuggestion.confidence}%`, accent: 'text-emerald-400' },
                      { label: 'Conversion Prob.', value: `${aiSuggestion.conversionProb}%`, accent: 'text-emerald-400' },
                      { label: 'Benchmark', value: `${aiSuggestion.benchmarkSpread} bps`, accent: 'text-slate-400' },
                    ].map(m => (
                      <div key={m.label} className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/40">
                        <div className="text-[9px] text-slate-600 uppercase tracking-wider font-mono mb-1">{m.label}</div>
                        <div className={cn('text-lg font-mono font-bold', m.accent)}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-3 mb-4">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1.5">AI Rationale</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{aiSuggestion.rationale}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1.5">
                      Final Spread (bps) — AI Suggested: {aiSuggestion.suggestedSpread}
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={form.spreadBps}
                        onChange={e => setForm(f => ({ ...f, spreadBps: e.target.value }))}
                        className="flex-1 accent-cyan-400"
                      />
                      <div className="w-16 text-center">
                        <div className="text-lg font-mono font-bold text-cyan-400">{form.spreadBps}</div>
                        <div className="text-[9px] text-slate-600">bps</div>
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center gap-3">
                      <button onClick={() => setForm(f => ({ ...f, spreadBps: String(aiSuggestion.suggestedSpread) }))}
                        className="text-[10px] text-cyan-500 hover:text-cyan-400 font-mono cursor-pointer">
                        Use AI suggestion
                      </button>
                    </div>
                  </div>
                </Panel>

                {/* Deal preview */}
                <Panel title="Deal Preview" accent>
                  <div className="space-y-3">
                    {[
                      { k: 'Client', v: MOCK_CLIENTS.find(c => c.id === form.client)?.name || '—' },
                      { k: 'Pair', v: form.pair },
                      { k: 'Direction', v: form.direction.toUpperCase() },
                      { k: 'Type', v: form.type },
                      { k: 'Notional', v: `$${parseFloat(form.notional.replace(/,/g, '')).toLocaleString()}` },
                      { k: 'Market Rate', v: formatRate(marketRate, form.pair) },
                      { k: 'Customer Rate', v: formatRate(customerRate, form.pair) },
                      { k: 'Spread', v: `${form.spreadBps} bps` },
                      { k: 'Est. Margin', v: `₹${marginAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
                      { k: 'Value Date', v: form.valueDate },
                    ].map(({ k, v }) => (
                      <div key={k} className="flex items-center justify-between py-1 border-b border-slate-800/50 last:border-0">
                        <span className="text-[10px] text-slate-600 uppercase tracking-wider font-mono">{k}</span>
                        <span className="text-xs font-mono text-slate-300">{v}</span>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep('details')}>← Back</Button>
                <Button variant="primary" onClick={() => setStep('review')}>Review Deal →</Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review & Risk */}
          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Panel title="Risk Assessment" headerRight={
                  <Badge variant={riskScore > 40 ? 'warning' : 'success'} size="xs">
                    Score: {riskScore}
                  </Badge>
                }>
                  <div className="space-y-4">
                    {[
                      { label: 'Counterparty Risk', status: 'clear', detail: 'No sanctions or embargo flags' },
                      { label: 'Credit Limit Check', status: 'clear', detail: 'Utilization within 80% threshold' },
                      { label: 'Deal Limit Check', status: notionalNum > 10000000 ? 'warning' : 'clear', detail: notionalNum > 10000000 ? 'Exceeds single deal limit — approval required' : 'Within authorized deal limits' },
                      { label: 'Compliance Screening', status: 'clear', detail: 'AML, FEMA, RBI checks passed' },
                      { label: 'Rate Deviation', status: parseFloat(form.spreadBps) > 50 ? 'warning' : 'clear', detail: parseFloat(form.spreadBps) > 50 ? 'Spread above 50bps — requires justification' : 'Rate within market norms' },
                    ].map(check => (
                      <div key={check.label} className="flex items-start gap-3">
                        <div className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                          check.status === 'clear' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        )}>
                          {check.status === 'clear' ? '✓' : '!'}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-slate-300">{check.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{check.detail}</div>
                        </div>
                        <Badge variant={check.status === 'clear' ? 'success' : 'warning'} size="xs" className="ml-auto mt-0.5">
                          {check.status}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.approvalRequired}
                        onChange={e => setForm(f => ({ ...f, approvalRequired: e.target.checked }))}
                        className="w-4 h-4 accent-cyan-400 cursor-pointer"
                      />
                      <span className="text-xs text-slate-400">Request desk head approval before execution</span>
                    </label>
                  </div>
                </Panel>

                <Panel title="Final Deal Summary" accent>
                  <div className="space-y-2">
                    {[
                      { k: 'Deal Reference', v: dealRef, mono: true, accent: true },
                      { k: 'Client', v: MOCK_CLIENTS.find(c => c.id === form.client)?.name || '—', mono: false },
                      { k: 'Currency Pair', v: form.pair, mono: true },
                      { k: 'Direction', v: form.direction.toUpperCase(), mono: true },
                      { k: 'Deal Type', v: form.type, mono: true },
                      { k: 'Notional', v: `USD ${parseFloat(form.notional.replace(/,/g, '')).toLocaleString()}`, mono: true },
                      { k: 'Market Rate', v: formatRate(marketRate, form.pair), mono: true },
                      { k: 'Customer Rate', v: formatRate(customerRate, form.pair), mono: true },
                      { k: 'Spread Applied', v: `${form.spreadBps} bps`, mono: true },
                      { k: 'Gross Margin', v: `₹${marginAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, mono: true, green: true },
                      { k: 'Value Date', v: form.valueDate, mono: true },
                      { k: 'Workflow', v: form.approvalRequired ? 'Maker-Checker (Approval Required)' : 'Auto-Execute (Compliance Only)', mono: false },
                    ].map(({ k, v, mono, accent: isAccent, green }) => (
                      <div key={k} className="flex items-center justify-between py-1 border-b border-slate-800/40 last:border-0">
                        <span className="text-[10px] text-slate-600 uppercase tracking-wider font-mono">{k}</span>
                        <span className={cn('text-xs', mono ? 'font-mono' : 'font-medium', isAccent ? 'text-cyan-400' : green ? 'text-emerald-400' : 'text-slate-300')}>
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1.5">Internal Notes</label>
                    <textarea
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Add deal notes, client instructions..."
                      rows={3}
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500/50 resize-none placeholder-slate-700"
                    />
                  </div>
                </Panel>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep('pricing')}>← Back</Button>
                <Button variant="primary" onClick={() => setStep('confirm')}>Proceed to Confirm →</Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirm */}
          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-xl mx-auto"
            >
              <Panel title="Confirm Deal Execution" accent>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h3 className="font-['Syne'] text-lg font-bold text-slate-100 mb-1">Final Confirmation Required</h3>
                  <p className="text-xs text-slate-400">
                    You are about to book a {form.direction.toUpperCase()} {form.pair} {form.type} deal for{' '}
                    <span className="font-mono text-cyan-400">${parseFloat(form.notional.replace(/,/g, '')).toLocaleString()}</span>{' '}
                    at rate <span className="font-mono text-cyan-400">{formatRate(customerRate, form.pair)}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { k: 'Gross Margin', v: `₹${marginAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, green: true },
                    { k: 'Margin (bps)', v: `${form.spreadBps} bps`, green: false },
                    { k: 'Risk Score', v: `${riskScore}/100`, green: riskScore < 30 },
                    { k: 'Workflow', v: form.approvalRequired ? 'Approval' : 'Auto', green: false },
                  ].map(m => (
                    <div key={m.k} className="bg-slate-800/40 rounded-lg p-3 text-center border border-slate-700/40">
                      <div className="text-[9px] text-slate-600 font-mono uppercase tracking-wider mb-1">{m.k}</div>
                      <div className={cn('text-sm font-mono font-bold', m.green ? 'text-emerald-400' : 'text-slate-300')}>{m.v}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 mb-6">
                  <p className="text-[10px] text-amber-400/80 leading-relaxed">
                    ⚠ By confirming, you certify this deal complies with applicable RBI/FEMA guidelines, your institution's risk policy, and that the customer rate reflects fair market pricing. This action will be logged with your credentials and timestamp.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep('review')}>← Revise</Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    loading={loading}
                    onClick={handleSubmit}
                  >
                    ✓ Execute Deal
                  </Button>
                </div>
              </Panel>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
