import type { User, FXRate, Deal, ExposurePosition, RiskLimit, ComplianceAlert, Client, ApprovalRequest, MarketInsight } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Arjun Mehta', role: 'treasury_dealer', email: 'arjun.mehta@plugzo.com', branch: 'Mumbai HQ', mfaEnabled: true, lastLogin: '2 min ago' },
  { id: 'u2', name: 'Priya Sharma', role: 'fx_desk_head', email: 'priya.sharma@plugzo.com', branch: 'Mumbai HQ', mfaEnabled: true, lastLogin: '15 min ago' },
  { id: 'u3', name: 'Rahul Kapoor', role: 'risk_manager', email: 'rahul.kapoor@plugzo.com', branch: 'Delhi', mfaEnabled: true, lastLogin: '1 hr ago' },
  { id: 'u4', name: 'Anita Desai', role: 'compliance_officer', email: 'anita.desai@plugzo.com', branch: 'Mumbai HQ', mfaEnabled: true, lastLogin: '30 min ago' },
  { id: 'u5', name: 'Vikram Singh', role: 'branch_user', email: 'vikram.singh@plugzo.com', branch: 'Bangalore', mfaEnabled: false, lastLogin: '3 hr ago' },
  { id: 'u6', name: 'Sarah Chen', role: 'corporate_client', email: 'sarah.chen@techcorp.com', branch: 'External', mfaEnabled: true, lastLogin: '1 day ago' },
  { id: 'u7', name: 'Amit Nair', role: 'relationship_manager', email: 'amit.nair@plugzo.com', branch: 'Chennai', mfaEnabled: true, lastLogin: '45 min ago' },
  { id: 'u8', name: 'Deepak Verma', role: 'super_admin', email: 'deepak.verma@plugzo.com', branch: 'Mumbai HQ', mfaEnabled: true, lastLogin: 'Just now' },
];

export const INITIAL_FX_RATES: FXRate[] = [
  { pair: 'USD/INR', bid: 83.2150, ask: 83.2450, mid: 83.2300, change: 0.1250, changePct: 0.15, high24h: 83.4200, low24h: 83.0800, volume: 2847000000, spread: 0.0300, timestamp: Date.now(), volatility: 0.42 },
  { pair: 'EUR/USD', bid: 1.0842, ask: 1.0845, mid: 1.0843, change: -0.0031, changePct: -0.28, high24h: 1.0891, low24h: 1.0821, volume: 4120000000, spread: 0.0003, timestamp: Date.now(), volatility: 0.38 },
  { pair: 'GBP/INR', bid: 105.4200, ask: 105.5100, mid: 105.4650, change: 0.3400, changePct: 0.32, high24h: 105.8900, low24h: 104.9200, volume: 892000000, spread: 0.0900, timestamp: Date.now(), volatility: 0.56 },
  { pair: 'AED/INR', bid: 22.6480, ask: 22.6710, mid: 22.6595, change: 0.0340, changePct: 0.15, high24h: 22.7100, low24h: 22.5900, volume: 445000000, spread: 0.0230, timestamp: Date.now(), volatility: 0.21 },
  { pair: 'SGD/INR', bid: 61.3420, ask: 61.3980, mid: 61.3700, change: 0.2100, changePct: 0.34, high24h: 61.5400, low24h: 61.0800, volume: 328000000, spread: 0.0560, timestamp: Date.now(), volatility: 0.31 },
  { pair: 'JPY/INR', bid: 0.5521, ask: 0.5528, mid: 0.5524, change: -0.0018, changePct: -0.32, high24h: 0.5549, low24h: 0.5498, volume: 1240000000, spread: 0.0007, timestamp: Date.now(), volatility: 0.48 },
];

export const MOCK_DEALS: Deal[] = [
  { id: 'd1', dealRef: 'PFN-2025-084521', client: 'Tata Consultancy Services', clientId: 'c1', pair: 'USD/INR', type: 'spot', direction: 'sell', notional: 5000000, rate: 83.2800, marketRate: 83.2450, margin: 17500, marginBps: 42, valueDate: '2025-01-24', status: 'executed', bookedBy: 'Arjun Mehta', branch: 'Mumbai HQ', timestamp: '2025-01-24T09:14:22Z', pnl: 17500, complianceStatus: 'clear', riskScore: 12, hedgeTag: 'HDG-2025-Q1' },
  { id: 'd2', dealRef: 'PFN-2025-084520', client: 'Infosys Ltd', clientId: 'c2', pair: 'EUR/USD', type: 'forward', direction: 'buy', notional: 2000000, rate: 1.0865, marketRate: 1.0843, margin: 4400, marginBps: 22, valueDate: '2025-04-24', maturityDate: '2025-04-24', status: 'approved', approver: 'Priya Sharma', bookedBy: 'Arjun Mehta', branch: 'Mumbai HQ', timestamp: '2025-01-24T08:55:10Z', pnl: 4400, complianceStatus: 'clear', riskScore: 18 },
  { id: 'd3', dealRef: 'PFN-2025-084519', client: 'Wipro Technologies', clientId: 'c3', pair: 'GBP/INR', type: 'spot', direction: 'sell', notional: 1500000, rate: 105.5600, marketRate: 105.4650, margin: 14250, marginBps: 95, valueDate: '2025-01-24', status: 'pending', bookedBy: 'Vikram Singh', branch: 'Bangalore', timestamp: '2025-01-24T08:42:05Z', complianceStatus: 'review', riskScore: 34 },
  { id: 'd4', dealRef: 'PFN-2025-084518', client: 'HCL Technologies', clientId: 'c4', pair: 'AED/INR', type: 'spot', direction: 'buy', notional: 8000000, rate: 22.6400, marketRate: 22.6595, margin: -15600, marginBps: -19, valueDate: '2025-01-24', status: 'executed', bookedBy: 'Arjun Mehta', branch: 'Mumbai HQ', timestamp: '2025-01-24T08:30:18Z', pnl: -15600, complianceStatus: 'clear', riskScore: 8 },
  { id: 'd5', dealRef: 'PFN-2025-084517', client: 'Mahindra & Mahindra', clientId: 'c5', pair: 'USD/INR', type: 'swap', direction: 'buy', notional: 10000000, rate: 83.5200, marketRate: 83.2300, margin: 290000, marginBps: 29, valueDate: '2025-01-24', maturityDate: '2025-07-24', status: 'approved', approver: 'Priya Sharma', bookedBy: 'Amit Nair', branch: 'Chennai', timestamp: '2025-01-24T08:15:44Z', pnl: 290000, complianceStatus: 'clear', riskScore: 22, hedgeTag: 'CORP-HDG-M1' },
  { id: 'd6', dealRef: 'PFN-2025-084516', client: 'Bajaj Auto Ltd', clientId: 'c6', pair: 'JPY/INR', type: 'forward', direction: 'sell', notional: 500000000, rate: 0.5545, marketRate: 0.5524, margin: 10500, marginBps: 38, valueDate: '2025-03-24', maturityDate: '2025-03-24', status: 'rejected', bookedBy: 'Vikram Singh', branch: 'Bangalore', timestamp: '2025-01-24T07:58:30Z', complianceStatus: 'flagged', riskScore: 78 },
  { id: 'd7', dealRef: 'PFN-2025-084515', client: 'Sun Pharma', clientId: 'c7', pair: 'USD/INR', type: 'spot', direction: 'sell', notional: 3500000, rate: 83.3100, marketRate: 83.2300, margin: 28000, marginBps: 80, valueDate: '2025-01-24', status: 'executed', bookedBy: 'Arjun Mehta', branch: 'Mumbai HQ', timestamp: '2025-01-24T07:40:12Z', pnl: 28000, complianceStatus: 'clear', riskScore: 15 },
  { id: 'd8', dealRef: 'PFN-2025-084514', client: 'Asian Paints', clientId: 'c8', pair: 'SGD/INR', type: 'spot', direction: 'buy', notional: 2000000, rate: 61.3500, marketRate: 61.3700, margin: -4000, marginBps: -20, valueDate: '2025-01-24', status: 'executed', bookedBy: 'Amit Nair', branch: 'Chennai', timestamp: '2025-01-24T07:22:08Z', pnl: -4000, complianceStatus: 'clear', riskScore: 10 },
];

export const MOCK_EXPOSURE: ExposurePosition[] = [
  { currency: 'USD', longPosition: 145000000, shortPosition: 98000000, netExposure: 47000000, hedgeRatio: 0.68, unrealizedPnl: 1245000, maturityBucket: '0-7D', branch: 'Mumbai HQ' },
  { currency: 'EUR', longPosition: 32000000, shortPosition: 28000000, netExposure: 4000000, hedgeRatio: 0.88, unrealizedPnl: -285000, maturityBucket: '7-30D', branch: 'Mumbai HQ' },
  { currency: 'GBP', longPosition: 18500000, shortPosition: 12000000, netExposure: 6500000, hedgeRatio: 0.65, unrealizedPnl: 420000, maturityBucket: '30-90D', branch: 'Mumbai HQ' },
  { currency: 'AED', longPosition: 55000000, shortPosition: 48000000, netExposure: 7000000, hedgeRatio: 0.87, unrealizedPnl: 180000, maturityBucket: '0-7D', branch: 'Delhi' },
  { currency: 'SGD', longPosition: 12000000, shortPosition: 9500000, netExposure: 2500000, hedgeRatio: 0.79, unrealizedPnl: -95000, maturityBucket: '7-30D', branch: 'Chennai' },
  { currency: 'JPY', longPosition: 8200000000, shortPosition: 6100000000, netExposure: 2100000000, hedgeRatio: 0.74, unrealizedPnl: 380000, maturityBucket: '30-90D', branch: 'Mumbai HQ' },
];

export const MOCK_RISK_LIMITS: RiskLimit[] = [
  { type: 'Daily Dealer Limit', used: 42000000, limit: 50000000, utilizationPct: 84, status: 'warning' },
  { type: 'Intraday VaR', used: 1850000, limit: 2500000, utilizationPct: 74, status: 'normal' },
  { type: 'Single Deal Limit', used: 10000000, limit: 15000000, utilizationPct: 67, status: 'normal' },
  { type: 'Client Credit Limit - TCS', used: 48000000, limit: 50000000, utilizationPct: 96, status: 'breach' },
  { type: 'Overnight Exposure', used: 28000000, limit: 35000000, utilizationPct: 80, status: 'warning' },
  { type: 'Counterparty Limit - HDFC', used: 18000000, limit: 40000000, utilizationPct: 45, status: 'normal' },
];

export const MOCK_COMPLIANCE_ALERTS: ComplianceAlert[] = [
  { id: 'ca1', type: 'threshold', severity: 'high', message: 'Transaction exceeds CTR threshold of ₹10L - Bajaj Auto JPY deal', dealRef: 'PFN-2025-084516', client: 'Bajaj Auto Ltd', timestamp: '2025-01-24T07:58:30Z', status: 'escalated' },
  { id: 'ca2', type: 'pattern', severity: 'medium', message: 'Unusual structuring pattern detected - 3 deals <₹5L within 2 hours', client: 'Anonymous', timestamp: '2025-01-24T08:20:15Z', status: 'reviewing' },
  { id: 'ca3', type: 'aml', severity: 'low', message: 'PEP screening match - Level 2 review required', client: 'GulfTrade Corp', timestamp: '2025-01-24T09:00:00Z', status: 'open' },
  { id: 'ca4', type: 'regulatory', severity: 'medium', message: 'FEMA reporting deadline in 48 hours - 12 deals pending submission', timestamp: '2025-01-24T06:00:00Z', status: 'open' },
  { id: 'ca5', type: 'sanction', severity: 'critical', message: 'OFAC watchlist partial match - immediate review required', client: 'GenTrading LLC', timestamp: '2025-01-24T09:12:44Z', status: 'open' },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Tata Consultancy Services', type: 'corporate', segment: 'platinum', relationship_manager: 'Amit Nair', branch: 'Mumbai HQ', ytdRevenue: 4850000, ytdVolume: 2400000000, avgMarginBps: 20, dealsCount: 248, creditLimit: 100000000, creditUsed: 48000000, riskRating: 'A', onboardDate: '2018-04-01' },
  { id: 'c2', name: 'Infosys Ltd', type: 'corporate', segment: 'platinum', relationship_manager: 'Amit Nair', branch: 'Bangalore', ytdRevenue: 3210000, ytdVolume: 1850000000, avgMarginBps: 17, dealsCount: 186, creditLimit: 80000000, creditUsed: 32000000, riskRating: 'A', onboardDate: '2019-01-15' },
  { id: 'c3', name: 'Wipro Technologies', type: 'corporate', segment: 'gold', relationship_manager: 'Vikram Singh', branch: 'Bangalore', ytdRevenue: 1840000, ytdVolume: 980000000, avgMarginBps: 19, dealsCount: 124, creditLimit: 50000000, creditUsed: 22000000, riskRating: 'A', onboardDate: '2020-06-10' },
  { id: 'c4', name: 'HCL Technologies', type: 'corporate', segment: 'gold', relationship_manager: 'Arjun Mehta', branch: 'Delhi', ytdRevenue: 2150000, ytdVolume: 1200000000, avgMarginBps: 18, dealsCount: 158, creditLimit: 60000000, creditUsed: 28000000, riskRating: 'A', onboardDate: '2019-08-22' },
  { id: 'c5', name: 'Mahindra & Mahindra', type: 'corporate', segment: 'platinum', relationship_manager: 'Amit Nair', branch: 'Mumbai HQ', ytdRevenue: 5620000, ytdVolume: 3100000000, avgMarginBps: 18, dealsCount: 312, creditLimit: 120000000, creditUsed: 65000000, riskRating: 'A', onboardDate: '2017-11-30' },
  { id: 'c6', name: 'Bajaj Auto Ltd', type: 'corporate', segment: 'gold', relationship_manager: 'Vikram Singh', branch: 'Pune', ytdRevenue: 980000, ytdVolume: 520000000, avgMarginBps: 19, dealsCount: 72, creditLimit: 30000000, creditUsed: 18000000, riskRating: 'B', onboardDate: '2021-03-15' },
  { id: 'c7', name: 'Sun Pharmaceutical', type: 'corporate', segment: 'gold', relationship_manager: 'Arjun Mehta', branch: 'Mumbai HQ', ytdRevenue: 1450000, ytdVolume: 780000000, avgMarginBps: 19, dealsCount: 95, creditLimit: 40000000, creditUsed: 15000000, riskRating: 'A', onboardDate: '2020-09-01' },
  { id: 'c8', name: 'Asian Paints', type: 'corporate', segment: 'silver', relationship_manager: 'Amit Nair', branch: 'Chennai', ytdRevenue: 620000, ytdVolume: 310000000, avgMarginBps: 20, dealsCount: 48, creditLimit: 20000000, creditUsed: 8000000, riskRating: 'B', onboardDate: '2022-01-10' },
];

export const MOCK_APPROVALS: ApprovalRequest[] = [
  { id: 'ap1', dealRef: 'PFN-2025-084519', client: 'Wipro Technologies', pair: 'GBP/INR', notional: 1500000, rate: 105.5600, type: 'spot', urgency: 'urgent', requestedBy: 'Vikram Singh', requestedAt: '2025-01-24T08:42:05Z', reason: 'Client acceptance within 5 min window' },
  { id: 'ap2', dealRef: 'PFN-2025-084522', client: 'L&T Finance', pair: 'USD/INR', notional: 12000000, rate: 83.4500, type: 'spot', urgency: 'critical', requestedBy: 'Arjun Mehta', requestedAt: '2025-01-24T09:18:30Z', reason: 'Limit override required - above single deal threshold', overrideType: 'limit_override' },
  { id: 'ap3', dealRef: 'PFN-2025-084523', client: 'Reliance Industries', pair: 'EUR/USD', notional: 5000000, rate: 1.0870, type: 'forward', urgency: 'standard', requestedBy: 'Amit Nair', requestedAt: '2025-01-24T09:05:15Z' },
];

export const MOCK_INSIGHTS: MarketInsight[] = [
  { pair: 'USD/INR', signal: 'bullish', confidence: 78, recommendation: 'USD strength expected on Fed hold narrative. Recommend USD buy hedges for importers before RBI intervention.', targetRate: 83.65, horizon: '5-7 days', aiGenerated: true },
  { pair: 'EUR/USD', signal: 'bearish', confidence: 65, recommendation: 'ECB dovish signals weighing on EUR. Exporters should consider EUR forward sales at current levels.', targetRate: 1.0780, horizon: '2 weeks', aiGenerated: true },
  { pair: 'GBP/INR', signal: 'neutral', confidence: 54, recommendation: 'Mixed UK macro data. Monitor BoE minutes for direction. Spread widening opportunity for dealers.', horizon: '1 week', aiGenerated: true },
];

export const REVENUE_CHART_DATA = [
  { month: 'Jul', revenue: 12400000, target: 11000000, deals: 184 },
  { month: 'Aug', revenue: 14200000, target: 12000000, deals: 210 },
  { month: 'Sep', revenue: 11800000, target: 13000000, deals: 195 },
  { month: 'Oct', revenue: 16500000, target: 14000000, deals: 248 },
  { month: 'Nov', revenue: 18200000, target: 15000000, deals: 276 },
  { month: 'Dec', revenue: 21400000, target: 16000000, deals: 312 },
  { month: 'Jan', revenue: 9800000, target: 17000000, deals: 148 },
];

export const VOLUME_BY_PAIR = [
  { pair: 'USD/INR', volume: 68, color: '#22d3ee' },
  { pair: 'EUR/USD', volume: 14, color: '#a3e635' },
  { pair: 'GBP/INR', volume: 8, color: '#f59e0b' },
  { pair: 'AED/INR', volume: 6, color: '#e879f9' },
  { pair: 'SGD/INR', volume: 3, color: '#fb923c' },
  { pair: 'JPY/INR', volume: 1, color: '#60a5fa' },
];

export const BRANCH_PERFORMANCE = [
  { branch: 'Mumbai HQ', revenue: 58400000, deals: 842, clients: 48, target: 55000000 },
  { branch: 'Delhi', revenue: 24200000, deals: 384, clients: 22, target: 25000000 },
  { branch: 'Bangalore', revenue: 18600000, deals: 296, clients: 18, target: 20000000 },
  { branch: 'Chennai', revenue: 12400000, deals: 184, clients: 14, target: 14000000 },
  { branch: 'Hyderabad', revenue: 8800000, deals: 128, clients: 10, target: 10000000 },
  { branch: 'Pune', revenue: 6200000, deals: 92, clients: 8, target: 8000000 },
];

export const RATE_HISTORY_DATA = Array.from({ length: 48 }, (_, i) => ({
  time: new Date(Date.now() - (47 - i) * 30 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
  'USD/INR': 83.10 + Math.sin(i * 0.2) * 0.15 + Math.random() * 0.08 + i * 0.003,
  'EUR/USD': 1.0820 + Math.cos(i * 0.15) * 0.008 + Math.random() * 0.004,
  'GBP/INR': 104.80 + Math.sin(i * 0.25) * 0.4 + Math.random() * 0.2 + i * 0.015,
}));

export const DEAL_FLOW_DATA = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  deals: Math.floor(Math.random() * 25 + (i >= 9 && i <= 17 ? 20 : 5)),
  volume: Math.floor(Math.random() * 50000000 + (i >= 9 && i <= 17 ? 80000000 : 10000000)),
}));
