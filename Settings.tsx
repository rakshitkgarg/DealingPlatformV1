import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import type { User } from '../types';
import { cn } from '../utils/cn';

interface SettingsProps {
  user: User;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: 'Profile & Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'display', label: 'Display & Layout' },
    { id: 'system', label: 'System Configuration' },
    { id: 'api', label: 'API & Integrations' },
  ];

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="max-w-4xl mx-auto space-y-5">

        <div>
          <h1 className="font-['Syne'] text-xl font-bold text-slate-100">Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Platform preferences · Security · System configuration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Panel dense noPad>
              <div className="p-2">
                {sections.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all',
                      activeSection === s.id ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </Panel>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'profile' && (
                <Panel title="Profile & Security">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="info" size="xs">{user.role.replace('_', ' ')}</Badge>
                          <Badge variant="muted" size="xs">{user.branch}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Full Name', value: user.name },
                        { label: 'Email Address', value: user.email },
                        { label: 'Branch', value: user.branch || '—' },
                        { label: 'Role', value: user.role.replace(/_/g, ' ') },
                      ].map(f => (
                        <div key={f.label}>
                          <label className="block text-[10px] text-slate-600 uppercase tracking-wider font-mono mb-1.5">{f.label}</label>
                          <input
                            defaultValue={f.value}
                            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-cyan-500/40"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <h3 className="text-xs font-semibold text-slate-400 mb-4">Security</h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Multi-Factor Authentication', enabled: user.mfaEnabled, desc: 'TOTP via Google Authenticator' },
                          { label: 'Session Timeout', enabled: true, desc: 'Auto-logout after 30 minutes of inactivity' },
                          { label: 'Device Trust', enabled: false, desc: 'Trusted devices for faster login' },
                          { label: 'Login Notifications', enabled: true, desc: 'Email on new device login' },
                        ].map(setting => (
                          <div key={setting.label} className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-medium text-slate-300">{setting.label}</div>
                              <div className="text-[10px] text-slate-600">{setting.desc}</div>
                            </div>
                            <div className={cn(
                              'w-9 h-5 rounded-full border cursor-pointer transition-colors relative',
                              setting.enabled ? 'bg-cyan-500/20 border-cyan-500/40' : 'bg-slate-800 border-slate-700'
                            )}>
                              <div className={cn(
                                'absolute top-0.5 w-4 h-4 rounded-full transition-all',
                                setting.enabled ? 'left-4 bg-cyan-400' : 'left-0.5 bg-slate-600'
                              )} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-800">
                      <Button variant="primary" size="sm">Save Changes</Button>
                      <Button variant="danger" size="sm" onClick={onLogout}>Sign Out</Button>
                    </div>
                  </div>
                </Panel>
              )}

              {activeSection === 'notifications' && (
                <Panel title="Notification Preferences">
                  <div className="space-y-4">
                    {[
                      { group: 'Risk Alerts', items: ['Limit Breaches', 'VaR Warnings', 'Anomaly Detections', 'Counterparty Alerts'] },
                      { group: 'Deal Notifications', items: ['Deal Executed', 'Pending Approvals', 'Deal Rejected', 'Rate Expiry'] },
                      { group: 'Compliance', items: ['New Alerts', 'FEMA Deadlines', 'Audit Activities', 'Sanction Matches'] },
                    ].map(group => (
                      <div key={group.group}>
                        <h3 className="text-xs font-semibold text-slate-400 mb-3">{group.group}</h3>
                        <div className="space-y-2.5">
                          {group.items.map(item => (
                            <div key={item} className="flex items-center justify-between">
                              <span className="text-xs text-slate-400">{item}</span>
                              <div className="flex gap-3">
                                {['App', 'Email', 'SMS'].map(ch => (
                                  <label key={ch} className="flex items-center gap-1.5 cursor-pointer">
                                    <input type="checkbox" defaultChecked={ch !== 'SMS'} className="w-3 h-3 accent-cyan-400 cursor-pointer" />
                                    <span className="text-[9px] text-slate-600 font-mono">{ch}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button variant="primary" size="sm" className="mt-2">Save Preferences</Button>
                  </div>
                </Panel>
              )}

              {activeSection === 'display' && (
                <Panel title="Display & Layout">
                  <div className="space-y-5">
                    {[
                      { label: 'Color Theme', options: ['Dark (Default)', 'Midnight', 'Slate'] },
                      { label: 'Data Density', options: ['Comfortable', 'Compact', 'Ultra-Dense'] },
                      { label: 'Chart Theme', options: ['Cyan/Dark', 'Institutional', 'Monochrome'] },
                      { label: 'Default Dashboard', options: ['Command Center', 'Live Rates', 'Deal Blotter'] },
                    ].map(pref => (
                      <div key={pref.label}>
                        <label className="block text-[10px] text-slate-600 uppercase tracking-wider font-mono mb-2">{pref.label}</label>
                        <div className="flex gap-2">
                          {pref.options.map((opt, i) => (
                            <button
                              key={opt}
                              className={cn(
                                'px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-all',
                                i === 0 ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400' : 'bg-slate-800/50 border-slate-700/60 text-slate-500 hover:text-slate-300'
                              )}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button variant="primary" size="sm">Apply Settings</Button>
                  </div>
                </Panel>
              )}

              {activeSection === 'system' && (
                <Panel title="System Configuration">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Rate Refresh Interval', value: '1.2s' },
                        { label: 'Session Timeout', value: '30 min' },
                        { label: 'Default Currency', value: 'INR' },
                        { label: 'Rate Decimal Places', value: '4' },
                        { label: 'Max Deal Size (Auto)', value: '$10M' },
                        { label: 'Approval Threshold', value: '$5M' },
                      ].map(c => (
                        <div key={c.label}>
                          <label className="block text-[10px] text-slate-600 uppercase tracking-wider font-mono mb-1.5">{c.label}</label>
                          <input
                            defaultValue={c.value}
                            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm font-mono text-slate-300 outline-none focus:border-cyan-500/40"
                          />
                        </div>
                      ))}
                    </div>
                    <Button variant="primary" size="sm">Save Configuration</Button>
                  </div>
                </Panel>
              )}

              {activeSection === 'api' && (
                <Panel title="API & Integrations">
                  <div className="space-y-4">
                    {[
                      { name: 'Bloomberg Data Feed', status: 'connected', desc: 'Real-time rate streaming via Bloomberg B-PIPE' },
                      { name: 'Reuters Eikon', status: 'connected', desc: 'FX analytics and news integration' },
                      { name: 'SWIFT gpi', status: 'connected', desc: 'Cross-border payment tracking' },
                      { name: 'RBI Reporting API', status: 'pending', desc: 'Automated FEMA/RBI submission' },
                      { name: 'Core Banking System', status: 'connected', desc: 'Real-time GL and account integration' },
                      { name: 'SFMS / NDS-OM', status: 'disconnected', desc: 'Government securities and money market' },
                    ].map(api => (
                      <div key={api.name} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-800/60 rounded-xl">
                        <div>
                          <div className="text-xs font-semibold text-slate-300">{api.name}</div>
                          <div className="text-[10px] text-slate-600 mt-0.5">{api.desc}</div>
                        </div>
                        <Badge
                          variant={api.status === 'connected' ? 'success' : api.status === 'pending' ? 'warning' : 'danger'}
                          size="xs"
                          pulse={api.status === 'connected'}
                        >
                          {api.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Panel>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
