export interface TradingAccountDto {
  id: string;
  userId: string;
  accountNumber: string;
  displayName: string;
  accountType: string;
  status: string;
  initialBalance: number;
  enableSpotTrading: boolean;
  enableFuturesTrading: boolean;
  maxLeverage: number;
  createdAt: string;
  verifiedAt: string | null;
  suspendedAt: string | null;
  suspensionReason: string | null;
}

export interface WalletDto {
  id: string;
  currency: string;
  availableBalance: number;
  lockedBalance: number;
  totalBalance: number;
  usdEquivalent: number;
  lastPriceUpdate: string;
}

export interface PortfolioDto {
  tradingAccountId: string;
  totalUsdValue: number;
  holdings: AssetHoldingDto[];
  timestamp: string;
}

export interface AssetHoldingDto {
  currency: string;
  balance: number;
  usdPrice: number;
  usdValue: number;
  percentage: number;
  change24h: number;
}

export interface CreateTicketRequest {
  walletId: string;
  type: TicketType;
  amount: number;
}

export interface TicketDto {
  id: string;
  ticketType: TicketType;
  amount: number;
  walletId: string;
  ticketStatus: TicketStatus;
}

export interface GetTicketsParams {
  tradingAccountId?: string;
  pageIndex?: number;
  pageSize?: number;
}

export enum TicketType {
  Deposit = 0,
  Withdraw = 1,
}

export enum TicketStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Cancelled = 3,
  Failed = 4,
  Rejected = 5,
}
