import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MOCK_COMPLIANCE_ALERTS, MOCK_DEALS } from '../data/mockData';
import type { ComplianceAlert } from '../types';
import { cn } from '../utils/cn';

const severityVariant = (s: string) => {
  switch (s) {
    case 'critical': return 'danger';
    case 'high': return 'danger';
    case 'medium': return 'warning';
    default: return 'muted';
  }
};

const auditLog = [
  { action: 'Deal Executed', user: 'Arjun Mehta', target: 'PFN-2025-084521', time: '09:14:22', ip: '10.0.1.24' },
  { action: 'Approval Granted', user: 'Priya Sharma', target: 'PFN-2025-084520', time: '09:05:10', ip: '10.0.1.18' },
  { action: 'Deal Rejected', user: 'System (Auto-Risk)', target: 'PFN-2025-084516', time: '07:58:30', ip: 'System' },
  { action: 'Compliance Alert Created', user: 'Compliance Engine', target: 'CA-0001', time: '07:58:30', ip: 'System' },
  { action: 'Login Success (MFA)', user: 'Anita Desai', target: 'Session #8421', time: '07:45:00', ip: '10.0.1.32' },
  { action: 'Rate Sheet Exported', user: 'Vikram Singh', target: 'Branch: Bangalore', time: '07:30:15', ip: '10.0.2.14' },
  { action: 'Client Profile Updated', user: 'Amit Nair', target: 'TCS (c1)', time: '07:15:44', ip: '10.0.1.20' },
];

export const Compliance: React.FC = () => {
  const [alerts, setAlerts] = useState<(ComplianceAlert & { reviewing?: boolean })[]>(
    MOCK_COMPLIANCE_ALERTS.map(a => ({ ...a }))
  );
  const [activeTab, setActiveTab] = useState<'alerts' | 'audit' | 'screening' | 'reports'>('alerts');

  const updateStatus = (id: string, status: ComplianceAlert['status']) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Syne'] text-xl font-bold text-slate-100">Compliance Center</h1>
            <p className="text-xs text-slate-500 mt-0.5">AML · Sanction Screening · FEMA · Audit Trail · Regulatory Reporting</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm"
              icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>}
            >
              Export Report
            </Button>
            <Button variant="ghost" size="sm">Schedule Submission</Button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Open Alerts', value: alerts.filter(a => a.status === 'open').length, accent: 'text-red-400' },
            { label: 'Under Review', value: alerts.filter(a => a.status === 'reviewing').length, accent: 'text-amber-400' },
            { label: 'Escalated', value: alerts.filter(a => a.status === 'escalated').length, accent: 'text-violet-400' },
            { label: 'Cleared Today', value: 12, accent: 'text-emerald-400' },
            { label: 'FEMA Pending', value: 12, accent: 'text-cyan-400' },
          ].map(m => (
            <div key={m.label} className="bg-[#0d1117] border border-slate-800/80 rounded-xl p-3 text-center">
              <div className="text-[9px] text-slate-600 font-mono uppercase tracking-wider mb-1">{m.label}</div>
              <div className={cn('text-2xl font-mono font-bold', m.accent)}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-800 rounded-lg p-1 w-fit">
          {[
            { id: 'alerts', label: 'Alerts' },
            { id: 'audit', label: 'Audit Trail' },
            { id: 'screening', label: 'Sanction Screening' },
            { id: 'reports', label: 'Reports' },
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

          {activeTab === 'alerts' && (
            <motion.div key="alerts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              {alerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className={cn(
                    'bg-[#0d1117] border rounded-xl p-4',
                    alert.severity === 'critical' ? 'border-red-500/30' :
                    alert.severity === 'high' ? 'border-red-500/20' :
                    alert.severity === 'medium' ? 'border-amber-500/20' :
                    'border-slate-800/80'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant={severityVariant(alert.severity) as any} size="xs" pulse={alert.severity === 'critical'}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="muted" size="xs">{alert.type.toUpperCase()}</Badge>
                        {alert.dealRef && (
                          <span className="text-[9px] font-mono text-cyan-400">{alert.dealRef.replace('PFN-2025-', '')}</span>
                        )}
                        <Badge
                          variant={alert.status === 'open' ? 'danger' : alert.status === 'reviewing' ? 'warning' : alert.status === 'escalated' ? 'amber' : 'success'}
                          size="xs"
                        >
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-300 mb-1">{alert.message}</p>
                      {alert.client && (
                        <div className="text-[10px] text-slate-600 font-mono">
                          Client: <span className="text-slate-400">{alert.client}</span>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex gap-1.5 flex-col flex-shrink-0">
                      {alert.status === 'open' && (
                        <>
                          <Button size="xs" variant="ghost" onClick={() => updateStatus(alert.id, 'reviewing')}>
                            Review
                          </Button>
                          <Button size="xs" variant="success" onClick={() => updateStatus(alert.id, 'cleared')}>
                            Clear
                          </Button>
                          <Button size="xs" variant="danger" onClick={() => updateStatus(alert.id, 'escalated')}>
                            Escalate
                          </Button>
                        </>
                      )}
                      {alert.status === 'reviewing' && (
                        <>
                          <Button size="xs" variant="success" onClick={() => updateStatus(alert.id, 'cleared')}>
                            Clear
                          </Button>
                          <Button size="xs" variant="danger" onClick={() => updateStatus(alert.id, 'escalated')}>
                            Escalate
                          </Button>
                        </>
                      )}
                      {(alert.status === 'cleared' || alert.status === 'escalated') && (
                        <Badge variant={alert.status === 'cleared' ? 'success' : 'warning'} size="xs">
                          {alert.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div key="audit" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Panel title="System Audit Log" subtitle="Immutable tamper-proof trail" noPad>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800/80">
                      {['Time', 'User', 'Action', 'Target', 'IP Address', 'Status'].map(h => (
                        <th key={h} className="text-left text-[9px] text-slate-600 uppercase tracking-wider font-medium px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {auditLog.map((log, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-slate-800/40 hover:bg-slate-800/20 cursor-pointer"
                      >
                        <td className="px-4 py-3 text-[10px] font-mono text-slate-500">{log.time}</td>
                        <td className="px-4 py-3 text-xs text-slate-300">{log.user}</td>
                        <td className="px-4 py-3 text-xs text-slate-400">{log.action}</td>
                        <td className="px-4 py-3 text-[10px] font-mono text-cyan-400">{log.target}</td>
                        <td className="px-4 py-3 text-[10px] font-mono text-slate-600">{log.ip}</td>
                        <td className="px-4 py-3">
                          <Badge variant="success" size="xs">Logged</Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
            </motion.div>
          )}

          {activeTab === 'screening' && (
            <motion.div key="screening" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Panel title="Sanction & AML Screening" subtitle="OFAC · UN · EU · FATF integration">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { label: 'OFAC Screened Today', value: 148, status: 'clear', icon: '🛡' },
                      { label: 'PEP Matches (Review)', value: 1, status: 'review', icon: '⚠' },
                      { label: 'FATF Countries Watch', value: 3, status: 'watch', icon: '🌍' },
                    ].map(s => (
                      <div key={s.label} className={cn(
                        'border rounded-xl p-4',
                        s.status === 'clear' ? 'bg-emerald-500/5 border-emerald-500/20' :
                        s.status === 'review' ? 'bg-amber-500/5 border-amber-500/20' :
                        'bg-slate-800/30 border-slate-700/40'
                      )}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{s.icon}</span>
                          <span className="text-[9px] text-slate-600 font-mono uppercase tracking-wider">{s.label}</span>
                        </div>
                        <div className="text-2xl font-mono font-bold text-slate-200">{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#0d1117] border border-amber-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 flex-shrink-0">⚠</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-200">OFAC Partial Match Detected</span>
                          <Badge variant="danger" size="xs" pulse>CRITICAL</Badge>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">
                          Client "GenTrading LLC" returns 73% match against OFAC SDN list entry. Manual review required before any FX transactions can be processed.
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="text-[10px] font-mono text-slate-600">
                            Match Score: <span className="text-amber-400">73%</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-600">
                            SDN Entry: <span className="text-slate-400">SDN-2024-01847</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button size="sm" variant="danger">Block Client</Button>
                        <Button size="sm" variant="ghost">False Positive</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Panel title="Regulatory Reports" subtitle="Downloadable submissions">
                <div className="space-y-3">
                  {[
                    { name: 'FEMA Report — January 2025', type: 'FEMA', due: '2025-01-31', status: 'pending', deals: 148 },
                    { name: 'RBI FX Return Q3 FY25', type: 'RBI', due: '2025-01-15', status: 'submitted', deals: 1247 },
                    { name: 'AML Monthly Report — Dec 2024', type: 'AML', due: '2025-01-10', status: 'submitted', deals: 892 },
                    { name: 'STR — Suspicious Activity Dec 24', type: 'STR', due: '2025-01-07', status: 'submitted', deals: 3 },
                    { name: 'CTR Threshold Report — Jan 25', type: 'CTR', due: '2025-01-24', status: 'pending', deals: 12 },
                  ].map(report => (
                    <div key={report.name} className="flex items-center justify-between p-4 bg-slate-800/20 border border-slate-800/50 rounded-lg hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-300">{report.name}</div>
                          <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                            Due: {report.due} · {report.deals} deals
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={report.status === 'pending' ? 'warning' : 'success'} size="xs">
                          {report.status}
                        </Badge>
                        <Badge variant="muted" size="xs">{report.type}</Badge>
                        <Button variant="ghost" size="xs">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
};
