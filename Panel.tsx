import React from 'react';
import { cn } from '../../utils/cn';

interface PanelProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
  accent?: boolean;
  dense?: boolean;
  noPad?: boolean;
}

export const Panel: React.FC<PanelProps> = ({
  title, subtitle, children, className, headerRight, accent, dense, noPad
}) => {
  return (
    <div className={cn(
      'bg-[#0d1117] border border-slate-800/80 rounded-xl overflow-hidden',
      accent && 'border-cyan-500/20',
      className
    )}>
      {(title || headerRight) && (
        <div className={cn(
          'flex items-center justify-between border-b border-slate-800/80',
          dense ? 'px-4 py-2.5' : 'px-5 py-4'
        )}>
          <div>
            {title && (
              <h3 className={cn('font-semibold text-slate-200 leading-none', dense ? 'text-sm' : 'text-sm')}>
                {title}
              </h3>
            )}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerRight && <div className="flex items-center gap-2">{headerRight}</div>}
        </div>
      )}
      <div className={cn(!noPad && (dense ? 'p-4' : 'p-5'))}>
        {children}
      </div>
    </div>
  );
};
