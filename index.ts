export type UserRole = 'super_admin' | 'treasury_dealer' | 'branch_user' | 'risk_manager' | 'compliance_officer' | 'corporate_client' | 'relationship_manager' | 'fx_desk_head';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  branch?: string;
  avatar?: string;
  lastLogin?: string;
  mfaEnabled: boolean;
}

export interface FXRate {
  pair: string;
  bid: number;
  ask: number;
  mid: number;
  change: number;
  changePct: number;
  high24h: number;
  low24h: number;
  volume: number;
  spread: number;
  timestamp: number;
  volatility: number;
}

export interface Deal {
  id: string;
  dealRef: string;
  client: string;
  clientId: string;
  pair: string;
  type: 'spot' | 'forward' | 'swap' | 'ndf';
  direction: 'buy' | 'sell';
  notional: number;
  rate: number;
  marketRate: number;
  margin: number;
  marginBps: number;
  valueDate: string;
  maturityDate?: string;
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'cancelled' | 'expired';
  approver?: string;
  bookedBy: string;
  branch: string;
  timestamp: string;
  pnl?: number;
  hedgeTag?: string;
  complianceStatus: 'clear' | 'review' | 'flagged';
  riskScore: number;
}

export interface ExposurePosition {
  currency: string;
  longPosition: number;
  shortPosition: number;
  netExposure: number;
  hedgeRatio: number;
  unrealizedPnl: number;
  maturityBucket: string;
  branch: string;
}

export interface RiskLimit {
  type: string;
  used: number;
  limit: number;
  utilizationPct: number;
  status: 'normal' | 'warning' | 'breach';
}

export interface ComplianceAlert {
  id: string;
  type: 'sanction' | 'aml' | 'threshold' | 'pattern' | 'regulatory';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  dealRef?: string;
  client?: string;
  timestamp: string;
  status: 'open' | 'reviewing' | 'cleared' | 'escalated';
}

export interface Client {
  id: string;
  name: string;
  type: 'corporate' | 'bank' | 'institutional' | 'sme';
  segment: 'platinum' | 'gold' | 'silver' | 'standard';
  relationship_manager: string;
  branch: string;
  ytdRevenue: number;
  ytdVolume: number;
  avgMarginBps: number;
  dealsCount: number;
  creditLimit: number;
  creditUsed: number;
  riskRating: 'A' | 'B' | 'C' | 'D';
  onboardDate: string;
}

export interface ApprovalRequest {
  id: string;
  dealRef: string;
  client: string;
  pair: string;
  notional: number;
  rate: number;
  type: string;
  urgency: 'standard' | 'urgent' | 'critical';
  requestedBy: string;
  requestedAt: string;
  reason?: string;
  overrideType?: string;
}

export interface MarketInsight {
  pair: string;
  signal: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  recommendation: string;
  targetRate?: number;
  horizon: string;
  aiGenerated: boolean;
}

export type ViewType = 'landing' | 'login' | 'dashboard' | 'deals' | 'book-deal' | 'exposure' | 'risk' | 'compliance' | 'clients' | 'analytics' | 'settings' | 'approvals' | 'rates';
