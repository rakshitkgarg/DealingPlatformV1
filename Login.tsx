import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MOCK_USERS } from '../data/mockData';
import type { User, UserRole } from '../types';
import { cn } from '../utils/cn';

interface LoginProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  super_admin: 'Full system access, configuration, and administration',
  treasury_dealer: 'Deal execution, rate streaming, and position management',
  fx_desk_head: 'Desk oversight, approvals, and performance management',
  risk_manager: 'Risk limits, exposure monitoring, and VaR analysis',
  compliance_officer: 'AML, sanctions, audit trails, and regulatory reporting',
  branch_user: 'Guided deal initiation and escalation workflows',
  corporate_client: 'Self-service rates, deal history, and hedging tools',
  relationship_manager: 'Client portfolio, revenue analytics, and deal support',
};

const ROLE_ICONS: Record<UserRole, string> = {
  super_admin: '◈',
  treasury_dealer: '⚡',
  fx_desk_head: '◉',
  risk_manager: '⬡',
  compliance_officer: '◎',
  branch_user: '◇',
  corporate_client: '⬢',
  relationship_manager: '◈',
};

export const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [step, setStep] = useState<'select' | 'credentials' | 'mfa'>('select');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter email and password'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email) || MOCK_USERS[0];
      setSelectedUser(user);
      setLoading(false);
      if (user.mfaEnabled) setStep('mfa');
      else onLogin(user);
    }, 1000);
  };

  const handleMFA = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) { setError('Enter 6-digit OTP'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (selectedUser) onLogin(selectedUser);
    }, 800);
  };

  const quickLogin = (user: User) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(user);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div className="font-['Syne'] font-extrabold text-2xl text-slate-100 tracking-tight">PLUGZO FX NEXUS</div>
          <div className="text-[10px] text-slate-600 font-mono mt-1 uppercase tracking-[0.3em]">Institutional Treasury Intelligence</div>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* Quick Role Select */}
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800/80">
                  <h2 className="text-sm font-semibold text-slate-200">Sign in to your workspace</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Select your role to continue</p>
                </div>

                <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
                  {MOCK_USERS.map((user) => (
                    <motion.button
                      key={user.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => quickLogin(user)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800/50 hover:border-slate-700 transition-all duration-150 cursor-pointer text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-slate-700/50 flex items-center justify-center flex-shrink-0 text-base">
                        {ROLE_ICONS[user.role]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-200 leading-none mb-1">{user.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{ROLE_DESCRIPTIONS[user.role]}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <Badge variant="muted" size="xs">{user.branch}</Badge>
                        {user.mfaEnabled && <span className="text-[8px] text-emerald-600 font-mono">MFA</span>}
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="px-6 py-4 border-t border-slate-800/80">
                  <button
                    onClick={() => setStep('credentials')}
                    className="text-xs text-cyan-500 hover:text-cyan-400 font-medium cursor-pointer transition-colors"
                  >
                    Sign in with credentials →
                  </button>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button onClick={onBack} className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">
                  ← Back to home
                </button>
              </div>
            </motion.div>
          )}

          {/* Credentials */}
          {step === 'credentials' && (
            <motion.div
              key="credentials"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-slate-200 mb-1">Enter credentials</h2>
                <p className="text-xs text-slate-500 mb-6">Tip: use any email from the role selector</p>

                <form onSubmit={handleCredentials} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="arjun.mehta@plugzo.com"
                      className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none focus:border-cyan-500/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1.5">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none focus:border-cyan-500/60 transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      {error}
                    </div>
                  )}

                  <Button variant="primary" size="md" loading={loading} className="w-full">
                    Continue
                  </Button>
                </form>

                <button
                  onClick={() => setStep('select')}
                  className="mt-4 text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors"
                >
                  ← Choose role instead
                </button>
              </div>
            </motion.div>
          )}

          {/* MFA */}
          {step === 'mfa' && (
            <motion.div
              key="mfa"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">Multi-Factor Authentication</div>
                    <div className="text-xs text-slate-500">Enter the 6-digit OTP from your authenticator</div>
                  </div>
                </div>

                <form onSubmit={handleMFA} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1.5">OTP Code</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      autoFocus
                      className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-xl font-mono text-center tracking-[0.5em] text-slate-200 placeholder-slate-700 outline-none focus:border-cyan-500/60 transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      {error}
                    </div>
                  )}

                  <div className="bg-slate-800/30 rounded-lg px-3 py-2 text-center">
                    <p className="text-[10px] text-slate-600">Demo: Enter any 6 digits to proceed</p>
                  </div>

                  <Button variant="primary" size="md" loading={loading} className="w-full">
                    Verify & Sign In
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
