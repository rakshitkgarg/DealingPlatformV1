import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import type { ViewType, User } from '../types';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'alert' | 'count' | 'live';
  dividerBefore?: boolean;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Command Center',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    badge: 'LIVE',
    badgeVariant: 'live',
  },
  {
    id: 'rates',
    label: 'Live Rates',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    badge: 'LIVE',
    badgeVariant: 'live',
  },
  {
    id: 'book-deal',
    label: 'Book Deal',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    id: 'deals',
    label: 'Deal Blotter',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    badge: '8',
    badgeVariant: 'count',
  },
  {
    id: 'approvals',
    label: 'Approvals',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    badge: '3',
    badgeVariant: 'alert',
  },
  {
    id: 'exposure',
    label: 'Exposure & P&L',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      </svg>
    ),
    dividerBefore: true,
  },
  {
    id: 'risk',
    label: 'Risk Engine',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    badge: '1',
    badgeVariant: 'alert',
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    badge: '5',
    badgeVariant: 'alert',
  },
  {
    id: 'clients',
    label: 'Client Intelligence',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    dividerBefore: true,
  },
  {
    id: 'analytics',
    label: 'Analytics & AI',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    dividerBefore: true,
  },
];

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  user: User;
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, user, collapsed, onToggle }) => {
  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 220 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="h-full bg-[#080c10] border-r border-slate-800/80 flex flex-col overflow-hidden flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 h-14 border-b border-slate-800/80 flex-shrink-0">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center flex-shrink-0 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.button>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="font-['Syne'] font-bold text-sm text-slate-100 leading-none tracking-tight whitespace-nowrap">
                PLUGZO
              </div>
              <div className="text-[9px] text-cyan-500 font-mono tracking-[0.2em] uppercase whitespace-nowrap">
                FX NEXUS
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <React.Fragment key={item.id}>
              {item.dividerBefore && (
                <div className="mx-3 my-2 border-t border-slate-800/60" />
              )}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 mx-0 my-0.5 rounded-none cursor-pointer transition-all duration-150 relative group',
                  isActive
                    ? 'text-cyan-300 bg-cyan-500/8'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1 bottom-1 w-0.5 bg-cyan-400 rounded-r"
                  />
                )}
                <span className={cn('flex-shrink-0 transition-colors', isActive && 'text-cyan-400')}>
                  {item.icon}
                </span>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-medium whitespace-nowrap flex-1 text-left"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {!collapsed && item.badge && (
                  <span className={cn(
                    'text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold',
                    item.badgeVariant === 'live' && 'bg-emerald-500/15 text-emerald-400 animate-pulse',
                    item.badgeVariant === 'alert' && 'bg-red-500/20 text-red-400',
                    item.badgeVariant === 'count' && 'bg-slate-700 text-slate-400',
                  )}>
                    {item.badge}
                  </span>
                )}
              </motion.button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-slate-800/80 p-3">
        <div className={cn('flex items-center gap-2.5', collapsed && 'justify-center')}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white">
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0"
              >
                <div className="text-xs font-medium text-slate-300 truncate leading-none">{user.name}</div>
                <div className="text-[9px] text-slate-600 mt-0.5 capitalize truncate">{user.role.replace('_', ' ')}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};
