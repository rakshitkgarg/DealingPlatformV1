import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MOCK_APPROVALS } from '../data/mockData';
import type { ApprovalRequest } from '../types';
import { cn } from '../utils/cn';

export const Approvals: React.FC = () => {
  const [approvals, setApprovals] = useState<(ApprovalRequest & { status?: 'approved' | 'rejected' })[]>(
    MOCK_APPROVALS.map(a => ({ ...a }))
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setProcessing(id);
    setTimeout(() => {
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
      setProcessing(null);
      setSelected(null);
    }, 1200);
  };

  const handleReject = (id: string) => {
    setProcessing(id);
    setTimeout(() => {
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
      setProcessing(null);
      setSelected(null);
    }, 1000);
  };

  const pending = approvals.filter(a => !a.status);
  const actioned = approvals.filter(a => a.status);

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="max-w-[1200px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Syne'] text-xl font-bold text-slate-100">Pending Approvals</h1>
            <p className="text-xs text-slate-500 mt-0.5">Maker-Checker · Desk Head Authorization Queue</p>
          </div>
          <div className="flex items-center gap-3">
            {pending.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-mono text-amber-400">{pending.length} pending</span>
              </div>
            )}
          </div>
        </div>

        {/* Pending queue */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Action Required</h2>

          <AnimatePresence>
            {pending.map((req, i) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className={cn(
                  'bg-[#0d1117] border rounded-xl overflow-hidden transition-all duration-200',
                  req.urgency === 'critical' ? 'border-red-500/30' : req.urgency === 'urgent' ? 'border-amber-500/25' : 'border-slate-800/80',
                  selected === req.id && 'border-cyan-500/30'
                )}>
                  {/* Top accent */}
                  <div className={cn(
                    'h-px',
                    req.urgency === 'critical' ? 'bg-red-500' : req.urgency === 'urgent' ? 'bg-amber-400' : 'bg-slate-700'
                  )} />

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-mono text-cyan-400">{req.dealRef.replace('PFN-2025-', 'PFN-')}</span>
                          <Badge
                            variant={req.urgency === 'critical' ? 'danger' : req.urgency === 'urgent' ? 'warning' : 'muted'}
                            size="xs"
                            pulse={req.urgency === 'critical'}
                          >
                            {req.urgency}
                          </Badge>
                          {req.overrideType && (
                            <Badge variant="amber" size="xs">LIMIT OVERRIDE</Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                          {[
                            { k: 'Client', v: req.client },
                            { k: 'Pair', v: req.pair },
                            { k: 'Notional', v: `$${req.notional.toLocaleString()}` },
                            { k: 'Rate', v: req.rate.toFixed(4) },
                          ].map(({ k, v }) => (
                            <div key={k}>
                              <div className="text-[9px] text-slate-600 uppercase tracking-wider font-mono">{k}</div>
                              <div className="text-xs font-mono text-slate-300 mt-0.5">{v}</div>
                            </div>
                          ))}
                        </div>

                        {req.reason && (
                          <div className="bg-slate-800/40 rounded-lg px-3 py-2 mb-3 text-[10px] text-slate-400">
                            <span className="text-slate-600">Reason: </span>{req.reason}
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-[10px] text-slate-600 font-mono">
                          <span>Requested by: <span className="text-slate-400">{req.requestedBy}</span></span>
                          <span>·</span>
                          <span>{new Date(req.requestedAt).toLocaleTimeString()}</span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex gap-2">
                        {selected !== req.id ? (
                          <>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setSelected(req.id)}
                            >
                              Reject
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              loading={processing === req.id}
                              onClick={() => handleApprove(req.id)}
                            >
                              ✓ Approve
                            </Button>
                          </>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>Cancel</Button>
                        )}
                      </div>
                    </div>

                    {/* Reject reason form */}
                    <AnimatePresence>
                      {selected === req.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-slate-800/60"
                        >
                          <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1.5">Rejection Reason</label>
                          <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Provide mandatory rejection reason for audit trail..."
                            rows={2}
                            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-red-500/40 resize-none placeholder-slate-600 mb-2"
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            loading={processing === req.id}
                            onClick={() => handleReject(req.id)}
                            disabled={!rejectReason.trim()}
                          >
                            Confirm Rejection
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {pending.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-400 mb-1">All caught up!</h3>
              <p className="text-xs text-slate-600">No pending approvals at this time</p>
            </motion.div>
          )}
        </div>

        {/* Actioned */}
        {actioned.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Recently Actioned</h2>
            <Panel noPad>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/80">
                    {['Deal Ref', 'Client', 'Pair', 'Notional', 'Type', 'Action', 'By', 'Time'].map(h => (
                      <th key={h} className="text-left text-[9px] text-slate-600 uppercase tracking-wider font-medium px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {actioned.map(req => (
                    <tr key={req.id} className="border-b border-slate-800/40">
                      <td className="px-4 py-3 text-[10px] font-mono text-cyan-400">{req.dealRef.replace('PFN-2025-', '')}</td>
                      <td className="px-4 py-3 text-xs text-slate-400 truncate max-w-[120px]">{req.client}</td>
                      <td className="px-4 py-3 text-[10px] font-mono text-slate-400">{req.pair}</td>
                      <td className="px-4 py-3 text-[10px] font-mono text-slate-400">${req.notional.toLocaleString()}</td>
                      <td className="px-4 py-3"><Badge variant="muted" size="xs">{req.type}</Badge></td>
                      <td className="px-4 py-3">
                        <Badge variant={req.status === 'approved' ? 'success' : 'danger'} size="xs">
                          {req.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[10px] text-slate-500">Priya Sharma</td>
                      <td className="px-4 py-3 text-[10px] font-mono text-slate-600">Just now</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </div>
        )}

      </div>
    </div>
  );
};
