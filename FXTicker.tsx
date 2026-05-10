import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_FX_RATES } from '../data/mockData';
import type { FXRate } from '../types';
import { cn } from '../utils/cn';

function perturbRate(rate: FXRate): FXRate {
  const spread = rate.spread;
  const volatilityFactor = rate.volatility * 0.001;
  const delta = (Math.random() - 0.495) * volatilityFactor * rate.mid;
  const newMid = rate.mid + delta;
  const newBid = newMid - spread / 2;
  const newAsk = newMid + spread / 2;
  const newChange = newMid - (rate.mid - rate.change) + delta;

  return {
    ...rate,
    mid: newMid,
    bid: newBid,
    ask: newAsk,
    change: newChange,
    changePct: (newChange / (newMid - newChange)) * 100,
    timestamp: Date.now(),
  };
}

const FXTickerItem: React.FC<{ rate: FXRate; prev?: FXRate; compact?: boolean }> = ({ rate, prev, compact }) => {
  const isUp = rate.mid >= (prev?.mid ?? rate.mid);
  const changed = prev && Math.abs(rate.mid - prev.mid) > 0.00001;

  const formatRate = (val: number, pair: string) => {
    const decimals = pair.includes('JPY') && !pair.includes('INR') ? 3 : pair === 'USD/INR' || pair === 'GBP/INR' || pair === 'AED/INR' || pair === 'SGD/INR' ? 4 : 4;
    return val.toFixed(decimals);
  };

  return (
    <div className={cn(
      'flex items-center gap-3 px-4 py-2.5 border-r border-slate-800/60 last:border-r-0 cursor-pointer group',
      'hover:bg-slate-800/30 transition-colors duration-150',
      compact && 'px-3 py-1.5'
    )}>
      <div className="flex-shrink-0">
        <div className={cn(
          'text-[10px] font-mono font-semibold uppercase tracking-wider',
          isUp ? 'text-emerald-400' : 'text-red-400'
        )}>
          {rate.pair}
        </div>
        {!compact && (
          <div className="text-[9px] text-slate-600 mt-0.5">
            Vol: {(rate.volume / 1e9).toFixed(2)}B
          </div>
        )}
      </div>

      <div className="text-right">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${rate.pair}-${rate.timestamp}`}
            initial={changed ? { y: isUp ? 4 : -4, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'font-mono font-semibold text-sm leading-none',
              changed ? (isUp ? 'text-emerald-300' : 'text-red-300') : 'text-slate-200'
            )}
          >
            {formatRate(rate.mid, rate.pair)}
          </motion.div>
        </AnimatePresence>

        <div className={cn(
          'text-[9px] font-mono mt-0.5 flex items-center gap-1',
          rate.changePct >= 0 ? 'text-emerald-500' : 'text-red-500'
        )}>
          {rate.changePct >= 0 ? '▲' : '▼'}
          {Math.abs(rate.changePct).toFixed(2)}%
        </div>
      </div>

      {!compact && (
        <div className="hidden lg:block text-right">
          <div className="text-[9px] text-slate-600 font-mono">B {formatRate(rate.bid, rate.pair)}</div>
          <div className="text-[9px] text-slate-600 font-mono">A {formatRate(rate.ask, rate.pair)}</div>
        </div>
      )}
    </div>
  );
};

interface FXTickerProps {
  compact?: boolean;
}

export const FXTicker: React.FC<FXTickerProps> = ({ compact }) => {
  const [rates, setRates] = useState<FXRate[]>(INITIAL_FX_RATES);
  const [prevRates, setPrevRates] = useState<FXRate[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevRates(rates);
      setRates(prev => prev.map(perturbRate));
      setLastUpdate(Date.now());
    }, 1200);
    return () => clearInterval(interval);
  }, [rates]);

  return (
    <div className="flex items-center overflow-x-auto scrollbar-hide">
      {rates.map((rate, i) => (
        <FXTickerItem
          key={rate.pair}
          rate={rate}
          prev={prevRates[i]}
          compact={compact}
        />
      ))}
      <div className="px-3 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] text-slate-600 font-mono">
            LIVE {new Date(lastUpdate).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export const useFXRates = () => {
  const [rates, setRates] = useState<FXRate[]>(INITIAL_FX_RATES);

  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prev => prev.map(perturbRate));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return rates;
};
