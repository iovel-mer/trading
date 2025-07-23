"use client";

import { useState, useEffect } from "react";
import { getTradingAccounts } from "@/app/api/balance/getTradingAccounts";
import { getWallets } from "@/app/api/balance/getWallets";
import { getPortfolio } from "@/app/api/balance/getPortfolio";
import { getTickets } from "@/app/api/balance/getTickets";
import type {
  TradingAccountDto,
  WalletDto,
  PortfolioDto,
  TicketDto,
} from "@/app/api/types/trading";

interface DashboardData {
  tradingAccounts: TradingAccountDto[];
  wallets: WalletDto[];
  portfolio: PortfolioDto | null;
  tickets: TicketDto[];
  totalBalance: number;
  totalUsdValue: number;
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    tradingAccounts: [],
    wallets: [],
    portfolio: null,
    tickets: [],
    totalBalance: 0,
    totalUsdValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Get trading accounts first
      const accountsResponse = await getTradingAccounts();
      if (!accountsResponse.success) {
        setError(accountsResponse.message || "Failed to load trading accounts");
        return;
      }

      const accounts = accountsResponse.data || [];
      if (accounts.length === 0) {
        setData((prev) => ({ ...prev, tradingAccounts: [] }));
        setLoading(false);
        return;
      }

      // Use the first trading account
      const primaryAccount = accounts[0];

      // Fetch wallets, portfolio, and tickets in parallel
      const [walletsResponse, portfolioResponse, ticketsResponse] =
        await Promise.all([
          getWallets(primaryAccount.id),
          getPortfolio(primaryAccount.id),
          getTickets({ tradingAccountId: primaryAccount.id, pageSize: 10 }),
        ]);

      const wallets = walletsResponse.success ? walletsResponse.data || [] : [];
      const portfolio: PortfolioDto | null = portfolioResponse.success
        ? portfolioResponse.data ?? null
        : null;
      const tickets = ticketsResponse.success ? ticketsResponse.data || [] : [];

      // Calculate total balance from wallets
      const totalBalance = wallets.reduce(
        (sum, wallet) => sum + wallet.totalBalance,
        0
      );
      const totalUsdValue = portfolio?.totalUsdValue || 0;

      setData({
        tradingAccounts: accounts,
        wallets,
        portfolio,
        tickets,
        totalBalance,
        totalUsdValue,
      });
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
