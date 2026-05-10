import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FXTicker } from './FXTicker';
import type { User, ViewType } from '../types';
import { cn } from '../utils/cn';

const VIEW_LABELS: Partial<Record<ViewType, string>> = {
  dashboard: 'Command Center',
  rates: 'Live Market Rates',
  'book-deal': 'Book New Deal',
  deals: 'Deal Blotter',
  approvals: 'Pending Approvals',
  exposure: 'Exposure & P&L',
  risk: 'Risk Engine',
  compliance: 'Compliance Center',
  clients: 'Client Intelligence',
  analytics: 'Analytics & AI Insights',
  settings: 'System Settings',
};

interface TopBarProps {
  currentView: ViewType;
  user: User;
  onLogout: () => void;
  onNavigate: (view: ViewType) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentView, user, onLogout, onNavigate }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [query, setQuery] = useState('');

  const searchResults = [
    { label: 'Book New Deal', view: 'book-deal' as ViewType, icon: '⚡' },
    { label: 'Deal Blotter', view: 'deals' as ViewType, icon: '📋' },
    { label: 'Risk Engine', view: 'risk' as ViewType, icon: '⚠️' },
    { label: 'Client: TCS', view: 'clients' as ViewType, icon: '🏢' },
    { label: 'Pending Approvals (3)', view: 'approvals' as ViewType, icon: '✅' },
  ].filter(r => !query || r.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col flex-shrink-0">
      {/* Main topbar */}
      <div className="h-14 bg-[#080c10] border-b border-slate-800/80 flex items-center px-4 gap-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">Plugzo FX</span>
          <span className="text-slate-700">/</span>
          <span className="text-[10px] text-slate-400 font-medium truncate">
            {VIEW_LABELS[currentView] || currentView}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center gap-2 h-7 px-3 bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-500 hover:text-slate-300 hover:border-slate-600 transition-all duration-150 cursor-pointer"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span className="text-[11px] font-medium">Search</span>
            <kbd className="text-[9px] bg-slate-700 px-1 rounded font-mono">⌘K</kbd>
          </motion.button>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-10 w-72 bg-[#0d1117] border border-slate-700/80 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden"
              >
                <div className="p-2">
                  <input
                    autoFocus
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search deals, clients, rates..."
                    className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="px-2 pb-2">
                  {searchResults.map(r => (
                    <button
                      key={r.view}
                      onClick={() => { onNavigate(r.view); setSearchOpen(false); setQuery(''); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/60 text-left cursor-pointer transition-colors"
                    >
                      <span>{r.icon}</span>
                      <span className="text-xs text-slate-300">{r.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-7 h-7 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center">8</span>
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-10 w-80 bg-[#0d1117] border border-slate-700/80 rounded-xl shadow-2xl shadow-black/60 z-50"
              >
                <div className="px-4 py-3 border-b border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-300">Notifications</h4>
                </div>
                <div className="py-2">
                  {[
                    { msg: 'TCS credit limit at 96% utilization', time: '2m', type: 'warning' },
                    { msg: 'OFAC match detected - GenTrading LLC', time: '5m', type: 'critical' },
                    { msg: 'Dealer limit breach: Daily limit at 84%', time: '12m', type: 'warning' },
                    { msg: 'Deal PFN-084519 awaiting approval', time: '18m', type: 'info' },
                    { msg: 'USD/INR volatility spike detected', time: '24m', type: 'info' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-800/30 cursor-pointer">
                      <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0',
                        n.type === 'critical' ? 'bg-red-400' : n.type === 'warning' ? 'bg-amber-400' : 'bg-cyan-400'
                      )} />
                      <div>
                        <div className="text-xs text-slate-300 leading-snug">{n.msg}</div>
                        <div className="text-[9px] text-slate-600 mt-0.5 font-mono">{n.time} ago</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-[11px] font-medium text-slate-300 leading-none">{user.name}</div>
            <div className="text-[9px] text-slate-600 mt-0.5 capitalize">{user.role.replace('_', ' ')}</div>
          </div>
        </button>
      </div>

      {/* FX Ticker strip */}
      <div className="h-10 bg-[#080c10] border-b border-slate-800/60 overflow-hidden">
        <FXTicker compact />
      </div>
    </div>
  );
};
