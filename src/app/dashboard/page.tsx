"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useUser } from "@/app/dashboard/context/user-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Users,
  AlertCircle,
  Wallet,
} from "lucide-react";
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
import { AuthConfirmer } from "../auth/components/authConfirmer";

interface DashboardData {
  tradingAccounts: TradingAccountDto[];
  wallets: WalletDto[];
  portfolio: PortfolioDto | null;
  tickets: TicketDto[];
  primaryWallet: WalletDto | null;
  totalUsdValue: number;
}

// Approximate USD prices for major cryptocurrencies (fallback values)
const FALLBACK_PRICES: Record<string, number> = {
  BTC: 45000,
  ETH: 2500,
  SOL: 100,
  ADA: 0.5,
  DOT: 7,
  LINK: 15,
  UNI: 8,
  USDT: 1,
  USDC: 1,
  USD: 1,
};

// Helper function to calculate USD equivalent with fallback
const calculateUsdEquivalent = (
  amount: number,
  currency: string,
  apiUsdValue: number
): number => {
  // If API provides a valid USD value, use it
  if (apiUsdValue && apiUsdValue > 0) {
    return apiUsdValue;
  }

  // Otherwise, use fallback calculation
  const fallbackPrice = FALLBACK_PRICES[currency.toUpperCase()] || 0;
  return amount * fallbackPrice;
};

// Helper function to get the primary wallet (prioritize wallets with balance)
const getPrimaryWallet = (wallets: WalletDto[]): WalletDto | null => {
  if (wallets.length === 0) return null;

  const walletsWithBalance = wallets.filter((w) => w.availableBalance > 0);

  if (walletsWithBalance.length > 0) {
    // Priority order for wallets with balance: BTC, ETH, USDT, USD
    const priorityCurrencies = ["BTC", "ETH", "USDT", "USD"];

    for (const currency of priorityCurrencies) {
      const wallet = walletsWithBalance.find((w) => w.currency === currency);
      if (wallet) return wallet;
    }

    // If no priority currency found, return wallet with largest USD equivalent
    return walletsWithBalance.reduce((prev, current) => {
      const prevUsd = calculateUsdEquivalent(
        prev.totalBalance,
        prev.currency,
        prev.usdEquivalent
      );
      const currentUsd = calculateUsdEquivalent(
        current.totalBalance,
        current.currency,
        current.usdEquivalent
      );
      return currentUsd > prevUsd ? current : prev;
    });
  }

  const priorityCurrencies = ["BTC", "ETH", "USDT", "USD"];

  for (const currency of priorityCurrencies) {
    const wallet = wallets.find(
      (w) => w.currency === currency && w.totalBalance > 0
    );
    if (wallet) return wallet;
  }

  // Return wallet with largest total balance
  return wallets.reduce((prev, current) => {
    const prevUsd = calculateUsdEquivalent(
      prev.totalBalance,
      prev.currency,
      prev.usdEquivalent
    );
    const currentUsd = calculateUsdEquivalent(
      current.totalBalance,
      current.currency,
      current.usdEquivalent
    );
    return currentUsd > prevUsd ? current : prev;
  });
};

// Helper function to format currency amount
const formatCurrencyAmount = (amount: number, currency: string): string => {
  if (currency === "USD" || currency === "USDT" || currency === "USDC") {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // For crypto currencies, show more decimal places for small amounts
  const decimals = amount < 1 ? 6 : amount < 100 ? 4 : 2;
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Helper function to get wallet icon based on currency
const getWalletIcon = (currency: string) => {
  const iconMap: Record<string, string> = {
    BTC: "₿",
    ETH: "Ξ",
    USDT: "$",
    USDC: "$",
    USD: "$",
    SOL: "◎",
    ADA: "₳",
    DOT: "●",
    LINK: "⬡",
    UNI: "🦄",
  };
  return iconMap[currency] || "◊";
};

// Helper function to sort wallets (available balance first, then by USD value)
const sortWallets = (wallets: WalletDto[]): WalletDto[] => {
  return wallets.sort((a, b) => {
    // First priority: wallets with available balance > 0
    const aHasBalance = a.availableBalance > 0 ? 1 : 0;
    const bHasBalance = b.availableBalance > 0 ? 1 : 0;

    if (aHasBalance !== bHasBalance) {
      return bHasBalance - aHasBalance;
    }

    const aUsdValue = calculateUsdEquivalent(
      a.totalBalance,
      a.currency,
      a.usdEquivalent
    );
    const bUsdValue = calculateUsdEquivalent(
      b.totalBalance,
      b.currency,
      b.usdEquivalent
    );

    return bUsdValue - aUsdValue;
  });
};

export default function DashboardPage() {
  console.log("📊 [DashboardPage] Component rendering");

  const {
    user,
    loading: userLoading,
    error: userError,
    refreshUser,
  } = useUser();

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    tradingAccounts: [],
    wallets: [],
    portfolio: null,
    tickets: [],
    primaryWallet: null,
    totalUsdValue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    // Get trading accounts first
    const accountsResponse = await getTradingAccounts();
    if (!accountsResponse.success) {
      setError(accountsResponse.message || "Failed to load trading accounts");
      setLoading(false);
      return;
    }

    const accounts = accountsResponse.data || [];
    if (accounts.length === 0) {
      setDashboardData((prev) => ({ ...prev, tradingAccounts: [] }));
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
    const portfolio = portfolioResponse.success
      ? portfolioResponse.data ?? null
      : null;
    const tickets = ticketsResponse.success ? ticketsResponse.data || [] : [];

    // Get primary wallet and calculate totals with fallback USD calculation
    const primaryWallet = getPrimaryWallet(wallets);
    const totalUsdValue = wallets.reduce(
      (sum, wallet) =>
        sum +
        calculateUsdEquivalent(
          wallet.totalBalance,
          wallet.currency,
          wallet.usdEquivalent
        ),
      0
    );

    setDashboardData({
      tradingAccounts: accounts,
      wallets,
      portfolio,
      tickets,
      primaryWallet,
      totalUsdValue,
    });

    setLoading(false);
  };

  useEffect(() => {
    if (!userLoading) {
      fetchDashboardData();
    }
  }, [userLoading]);

  // Handle auth confirmation callback
  const handleAuthConfirmed = async () => {
    await refreshUser();
    await fetchDashboardData();
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || userError) {
    return (
      <DashboardLayout>
        <AuthConfirmer onAuthConfirmed={handleAuthConfirmed} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-muted-foreground mb-4">{error || userError}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const primaryAccount = dashboardData.tradingAccounts[0];
  const activeTickets = dashboardData.tickets.filter(
    (ticket) => ticket.ticketStatus === 0 || ticket.ticketStatus === 1 // Pending or Processing
  );

  // Calculate USD equivalent for primary wallet with fallback
  const primaryWalletUsdValue = dashboardData.primaryWallet
    ? calculateUsdEquivalent(
        dashboardData.primaryWallet.totalBalance,
        dashboardData.primaryWallet.currency,
        dashboardData.primaryWallet.usdEquivalent
      )
    : 0;

  return (
    <DashboardLayout>
      <AuthConfirmer onAuthConfirmed={handleAuthConfirmed} />
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user ? `${user.firstName} ${user.lastName}` : "User"}
            !
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your trading account today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Primary Balance
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground flex items-center justify-center text-xs font-bold">
                {dashboardData.primaryWallet ? (
                  getWalletIcon(dashboardData.primaryWallet.currency)
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.primaryWallet ? (
                  <>
                    {formatCurrencyAmount(
                      dashboardData.primaryWallet.totalBalance,
                      dashboardData.primaryWallet.currency
                    )}{" "}
                    <span className="text-lg text-muted-foreground">
                      {dashboardData.primaryWallet.currency}
                    </span>
                  </>
                ) : (
                  "No Balance"
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.primaryWallet ? (
                  <>
                    ≈ $
                    {primaryWalletUsdValue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    {primaryWalletUsdValue === 0 &&
                      dashboardData.primaryWallet.usdEquivalent === 0 && (
                        <span className="text-orange-500 ml-1">
                          (estimated)
                        </span>
                      )}
                  </>
                ) : (
                  `${dashboardData.wallets.length} wallet${
                    dashboardData.wallets.length !== 1 ? "s" : ""
                  }`
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total USD Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {dashboardData.totalUsdValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {dashboardData.wallets.length} wallet
                {dashboardData.wallets.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Tickets
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTickets.length}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.tickets.length} total tickets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Account Status
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge
                  variant={
                    primaryAccount?.status === "Active"
                      ? "default"
                      : "secondary"
                  }
                  className={
                    primaryAccount?.status === "Active" ? "bg-green-500" : ""
                  }
                >
                  {primaryAccount?.status || "Unknown"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {primaryAccount?.verifiedAt
                  ? "Verified account"
                  : "Pending verification"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Wallets */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
              <CardDescription>
                Your latest deposit and withdrawal requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.tickets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No recent tickets
                  </p>
                ) : (
                  dashboardData.tickets.slice(0, 5).map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center space-x-4"
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          ticket.ticketStatus === 2
                            ? "bg-green-500"
                            : ticket.ticketStatus === 4 ||
                              ticket.ticketStatus === 5
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      ></div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          {ticket.ticketType === 0 ? "Deposit" : "Withdrawal"}{" "}
                          Request
                        </p>
                        <p className="text-xs text-muted-foreground">
                          $
                          {ticket.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {
                            [
                              "Pending",
                              "Processing",
                              "Completed",
                              "Cancelled",
                              "Failed",
                              "Rejected",
                            ][ticket.ticketStatus]
                          }
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Wallets</CardTitle>
              <CardDescription>
                Your wallet balances by currency.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {dashboardData.wallets.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No wallets found
                </p>
              ) : (
                sortWallets(dashboardData.wallets).map((wallet) => {
                  const walletUsdValue = calculateUsdEquivalent(
                    wallet.totalBalance,
                    wallet.currency,
                    wallet.usdEquivalent
                  );
                  const isEstimated =
                    wallet.usdEquivalent === 0 && walletUsdValue > 0;

                  return (
                    <div key={wallet.id} className="rounded-lg border p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-bold">
                            {getWalletIcon(wallet.currency)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{wallet.currency}</p>
                              {wallet.availableBalance > 0 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                >
                                  Active
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Available:{" "}
                              {formatCurrencyAmount(
                                wallet.availableBalance,
                                wallet.currency
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrencyAmount(
                              wallet.totalBalance,
                              wallet.currency
                            )}{" "}
                            {wallet.currency}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ≈ $
                            {walletUsdValue.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            {isEstimated && (
                              <span className="text-orange-500 ml-1">*</span>
                            )}
                          </p>
                        </div>
                      </div>
                      {wallet.lockedBalance > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Locked:{" "}
                          {formatCurrencyAmount(
                            wallet.lockedBalance,
                            wallet.currency
                          )}{" "}
                          {wallet.currency}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              {dashboardData.wallets.some(
                (w) =>
                  calculateUsdEquivalent(
                    w.totalBalance,
                    w.currency,
                    w.usdEquivalent
                  ) > 0 && w.usdEquivalent === 0
              ) && (
                <p className="text-xs text-muted-foreground mt-2">
                  * Estimated values based on approximate market prices
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
