export interface WalletSummaryResponse {
  userId: string;
  totalAccounts: number;
  totalTickets: number;
  activeTickets: number;
  ticketBreakdown: TicketBreakdown[];
  totalDeposits: number;
  totalWithdrawals: number;
  totalTradingOrders: number;
  totalUsdEquivalent: number;
  totalBtcEquivalent: number;
  totalAvailableBalance: number;
  totalLockedBalance: number;
  totalBalance: number;
  currencyBreakdown: CurrencyBreakdown[];
}

export interface CurrencyBreakdown {
  currency: string;
  availableBalance: number;
  lockedBalance: number;
  totalBalance: number;
  usdEquivalent: number;
  walletCount: number;
}

export interface TicketBreakdown {
  id: string;
  amount: number;
  ticketStatus: number;
  ticketType: number;
  walletId: string;
}
