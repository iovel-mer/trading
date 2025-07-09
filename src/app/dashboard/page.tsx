"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  Activity,
  AlertCircle,
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

interface DashboardData {
  tradingAccounts: TradingAccountDto[];
  wallets: WalletDto[];
  portfolio: PortfolioDto | null;
  tickets: TicketDto[];
  totalBalance: number;
  totalUsdValue: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: userLoading, error: userError } = useUser();
  console.log("📊 [DashboardPage] User context state:", {
    user: user?.email,
    userLoading,
    userError,
  });

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    tradingAccounts: [],
    wallets: [],
    portfolio: null,
    tickets: [],
    totalBalance: 0,
    totalUsdValue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const accountsResponse = await getTradingAccounts();
        if (!accountsResponse.success) {
          setError(
            accountsResponse.message || "Failed to load trading accounts"
          );
          return;
        }

        const accounts = accountsResponse.data || [];
        if (accounts.length === 0) {
          setDashboardData((prev) => ({ ...prev, tradingAccounts: [] }));
          setLoading(false);
          return;
        }

        const primaryAccount = accounts[0];

        const [walletsResponse, portfolioResponse, ticketsResponse] =
          await Promise.all([
            getWallets(primaryAccount.id),
            getPortfolio(primaryAccount.id),
            getTickets({ tradingAccountId: primaryAccount.id, pageSize: 10 }),
          ]);

        console.log(ticketsResponse, "Tick Response");

        const wallets = walletsResponse.success
          ? walletsResponse.data || []
          : [];
        const portfolio = portfolioResponse.success
          ? portfolioResponse.data ?? null
          : null;
        const tickets = ticketsResponse.success
          ? ticketsResponse.data || []
          : [];

        const totalBalance = wallets.reduce(
          (sum, wallet) => sum + wallet.totalBalance,
          0
        );
        const totalUsdValue = portfolio?.totalUsdValue || 0;

        setDashboardData({
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

    if (!userLoading) {
      fetchDashboardData();
    }
  }, [userLoading]);

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
    (ticket) => ticket.ticketStatus === 0 || ticket.ticketStatus === 1
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user ? `${user.firstName} ${user.lastName}` : "User"}
            !
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your trading account today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {dashboardData.totalBalance.toLocaleString("en-US", {
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
                Portfolio Value
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
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
                {dashboardData.portfolio?.holdings.length || 0} holdings
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
                dashboardData.wallets.map((wallet) => (
                  <div key={wallet.id} className="rounded-lg border p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{wallet.currency}</p>
                        <p className="text-sm text-muted-foreground">
                          Available: {wallet.availableBalance.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {wallet.totalBalance.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          $
                          {wallet.usdEquivalent.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
