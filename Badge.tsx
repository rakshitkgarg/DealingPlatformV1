import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'amber';
  size?: 'xs' | 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', size = 'sm', children, className, pulse }) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    danger: 'bg-red-500/15 text-red-400 border border-red-500/30',
    info: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    muted: 'bg-slate-700/50 text-slate-400 border border-slate-600/50',
    amber: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[9px] tracking-wide',
    sm: 'px-2 py-0.5 text-[10px] tracking-wide',
    md: 'px-2.5 py-1 text-xs tracking-wide',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 font-mono font-medium uppercase rounded', variants[variant], sizes[size], className)}>
      {pulse && <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', {
        'bg-emerald-400': variant === 'success',
        'bg-amber-400': variant === 'warning' || variant === 'amber',
        'bg-red-400': variant === 'danger',
        'bg-cyan-400': variant === 'info',
        'bg-slate-400': variant === 'default' || variant === 'muted',
      })} />}
      {children}
    </span>
  );
};
