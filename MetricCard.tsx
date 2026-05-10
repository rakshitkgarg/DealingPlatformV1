import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface MetricCardProps {
  label: string;
  value: string | React.ReactNode;
  sub?: string;
  change?: number;
  changeSuffix?: string;
  icon?: React.ReactNode;
  accent?: 'cyan' | 'emerald' | 'amber' | 'red' | 'violet' | 'slate';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const accents = {
  cyan: { border: 'border-cyan-500/25', indicator: 'bg-cyan-500', icon: 'text-cyan-400 bg-cyan-500/10' },
  emerald: { border: 'border-emerald-500/25', indicator: 'bg-emerald-500', icon: 'text-emerald-400 bg-emerald-500/10' },
  amber: { border: 'border-amber-500/25', indicator: 'bg-amber-500', icon: 'text-amber-400 bg-amber-500/10' },
  red: { border: 'border-red-500/25', indicator: 'bg-red-500', icon: 'text-red-400 bg-red-500/10' },
  violet: { border: 'border-violet-500/25', indicator: 'bg-violet-500', icon: 'text-violet-400 bg-violet-500/10' },
  slate: { border: 'border-slate-600/40', indicator: 'bg-slate-500', icon: 'text-slate-400 bg-slate-700/50' },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  label, value, sub, change, changeSuffix = '%', icon, accent = 'slate', size = 'md', className, onClick
}) => {
  const a = accents[accent];
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      whileHover={onClick ? { y: -2, scale: 1.005 } : {}}
      onClick={onClick}
      className={cn(
        'relative bg-[#0d1117] border rounded-xl overflow-hidden group transition-all duration-200',
        a.border,
        onClick && 'cursor-pointer hover:border-opacity-50',
        className
      )}
    >
      {/* Top accent line */}
      <div className={cn('absolute top-0 left-0 right-0 h-px', a.indicator, 'opacity-60')} />

      <div className={cn('p-4', size === 'lg' && 'p-6', size === 'sm' && 'p-3')}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {icon && (
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', a.icon)}>
                  {icon}
                </div>
              )}
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.12em] truncate">{label}</span>
            </div>
            <div className={cn('font-mono font-semibold text-slate-100 leading-none', size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl')}>
              {value}
            </div>
            {sub && <div className="mt-1.5 text-xs text-slate-500 font-medium">{sub}</div>}
          </div>

          {change !== undefined && (
            <div className={cn(
              'flex-shrink-0 text-right',
              isPositive ? 'text-emerald-400' : 'text-red-400'
            )}>
              <div className="text-sm font-mono font-semibold">
                {isPositive ? '+' : ''}{change}{changeSuffix}
              </div>
              <div className="text-[9px] text-slate-600 uppercase tracking-wider mt-0.5">vs prior</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
