"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  History,
  Plus,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { getTradingAccounts } from "@/app/api/balance/getTradingAccounts";
import { getWallets } from "@/app/api/balance/getWallets";
import { getTickets } from "@/app/api/balance/getTickets";
import { postCreateTicket } from "@/app/api/balance/postCreateTicket";
import type {
  TradingAccountDto,
  WalletDto,
  TicketDto,
  TicketType,
  TicketStatus,
} from "@/app/api/types/trading";
import { useToast } from "@/hooks/use-toast";

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export default function TradingPage() {
  const [activeTab, setActiveTab] = useState("accounts");
  const [tradingAccounts, setTradingAccounts] = useState<TradingAccountDto[]>(
    []
  );
  const [wallets, setWallets] = useState<WalletDto[]>([]);
  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [ticketAmount, setTicketAmount] = useState("");
  const [ticketType, setTicketType] = useState<TicketType>(0); // TicketType.Deposit
  const [creatingTicket, setCreatingTicket] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  console.log(selectedAccount, "SelectedAccount");

  const { toast } = useToast();

  // Load trading accounts on component mount
  useEffect(() => {
    loadTradingAccounts();
  }, []);

  // Load wallets when account changes
  useEffect(() => {
    if (selectedAccount) {
      loadWallets(selectedAccount);
    }
  }, [selectedAccount]);

  // Load tickets when tab changes to history or pagination changes
  useEffect(() => {
    if (activeTab === "history" && selectedAccount) {
      loadTickets(pagination.currentPage, pagination.pageSize);
    }
  }, [activeTab, selectedAccount, pagination.currentPage, pagination.pageSize]);

  const loadTradingAccounts = async () => {
    setLoading(true);
    const response = await getTradingAccounts();

    if (response.success && response.data) {
      setTradingAccounts(response.data);
      if (response.data.length > 0) {
        setSelectedAccount(response.data[0].id);
      }
    } else {
      toast({
        title: "Error",
        description: response.message || "Failed to load trading accounts",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const loadWallets = async (accountId: string) => {
    const response = await getWallets(accountId);

    if (response.success && response.data) {
      setWallets(response.data);
      if (response.data.length > 0) {
        setSelectedWallet(response.data[0].id);
      }
    } else {
      toast({
        title: "Error",
        description: response.message || "Failed to load wallets",
        variant: "destructive",
      });
    }
  };

  const loadTickets = async (page = 1, pageSize = 10) => {
    if (!selectedAccount) return;

    setTicketsLoading(true);
    const response = await getTickets({
      tradingAccountId: selectedAccount,
      pageIndex: page - 1, // API expects 0-based index
      pageSize: pageSize,
    });

    if (response.success && response.data) {
      setTickets(response.data);

      // Note: Since your API doesn't return total count, we'll estimate it
      // You might want to modify your API to return total count for proper pagination
      const estimatedTotal =
        response.data.length === pageSize
          ? page * pageSize + 1
          : (page - 1) * pageSize + response.data.length;

      setPagination((prev) => ({
        ...prev,
        currentPage: page,
        totalItems: estimatedTotal,
        totalPages: Math.ceil(estimatedTotal / pageSize),
      }));
    } else {
      toast({
        title: "Error",
        description: response.message || "Failed to load tickets",
        variant: "destructive",
      });
    }
    setTicketsLoading(false);
  };

  const createTicket = async () => {
    if (
      !selectedWallet ||
      !ticketAmount ||
      Number.parseFloat(ticketAmount) <= 0
    ) {
      toast({
        title: "Validation Error",
        description: "Please select a wallet and enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setCreatingTicket(true);
    const response = await postCreateTicket({
      walletId: selectedWallet,
      type: ticketType,
      amount: Number.parseFloat(ticketAmount),
    });

    if (response.success && response.data) {
      toast({
        title: "Success",
        description: `Ticket created successfully with ID: ${response.data}`,
      });
      setTicketAmount("");
      // Reload tickets if we're on the history tab
      if (activeTab === "history") {
        loadTickets(1, pagination.pageSize); // Reset to first page
      }
    } else {
      toast({
        title: "Error",
        description:
          response.message ||
          "Unable to create ticket due to insufficient funds. Please check your balance and try again.",
        variant: "destructive",
      });
    }
    setCreatingTicket(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const pageSize = Number.parseInt(newPageSize);
    setPagination((prev) => ({
      ...prev,
      pageSize,
      currentPage: 1, // Reset to first page when changing page size
    }));
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 2: // Completed
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 0: // Pending
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 1: // Processing
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 3: // Cancelled
      case 4: // Failed
      case 5: // Rejected
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: TicketStatus) => {
    const statusMap = {
      0: "Pending",
      1: "Processing",
      2: "Completed",
      3: "Cancelled",
      4: "Failed",
      5: "Rejected",
    };
    return statusMap[status] || "Unknown";
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 2: // Completed
        return "bg-green-100 text-green-800";
      case 0: // Pending
        return "bg-yellow-100 text-yellow-800";
      case 1: // Processing
        return "bg-blue-100 text-blue-800";
      case 3: // Cancelled
      case 4: // Failed
      case 5: // Rejected
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTicketTypeText = (type: TicketType) => {
    return type === 0 ? "Deposit" : "Withdraw";
  };

  const getTicketTypeIcon = (type: TicketType) => {
    return type === 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">
              Loading trading data...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trading</h1>
          <p className="text-muted-foreground">
            Manage your trading accounts, create tickets, and view transaction
            history.
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Trading Accounts
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Ticket
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Ticket History
            </TabsTrigger>
          </TabsList>

          {/* Trading Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Trading Account</CardTitle>
                <CardDescription>
                  Choose an account to view its wallets and balances.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="ms-auto mt-3">
                    <Label htmlFor="account-select" className="justify-end">
                      Trading Account
                    </Label>
                    <Select
                      value={selectedAccount}
                      onValueChange={setSelectedAccount}
                    >
                      <SelectTrigger className="ms-auto mt-3">
                        <SelectValue placeholder="Select a trading account" />
                      </SelectTrigger>
                      <SelectContent>
                        {tradingAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.displayName} ({account.accountNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedAccount && (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {wallets.map((wallet) => (
                          <Card key={wallet.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-5 w-5 text-green-600" />
                                <div>
                                  <p className="font-medium">
                                    {wallet.currency}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Available:{" "}
                                    {wallet.availableBalance.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">
                                  ${wallet.usdEquivalent.toFixed(2)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Total: {wallet.totalBalance.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            {wallet.lockedBalance > 0 && (
                              <div className="mt-2 text-sm text-muted-foreground">
                                Locked: {wallet.lockedBalance.toFixed(2)}
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Ticket Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Ticket</CardTitle>
                <CardDescription>
                  Create a deposit or withdrawal ticket for your trading
                  account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="account-select" className="mb-2">
                      Trading Account
                    </Label>
                    <Select
                      value={selectedAccount}
                      onValueChange={setSelectedAccount}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a trading account" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {tradingAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.displayName} ({account.accountNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="wallet-select" className="mb-2">
                      Wallet
                    </Label>
                    <Select
                      value={selectedWallet}
                      onValueChange={setSelectedWallet}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a wallet" />
                      </SelectTrigger>
                      <SelectContent>
                        {wallets.map((wallet) => (
                          <SelectItem key={wallet.id} value={wallet.id}>
                            {wallet.currency} - $
                            {wallet.usdEquivalent.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="ticket-type" className="mb-2">
                      Ticket Type
                    </Label>
                    <Select
                      value={ticketType.toString()}
                      onValueChange={(value: string) =>
                        setTicketType(Number.parseInt(value) as TicketType)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ticket type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            Deposit
                          </div>
                        </SelectItem>
                        <SelectItem value="1">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-600" />
                            Withdraw
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount" className="mb-2">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={ticketAmount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTicketAmount(e.target.value)
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <Button
                    onClick={createTicket}
                    disabled={
                      creatingTicket || !selectedWallet || !ticketAmount
                    }
                    className="w-full"
                  >
                    {creatingTicket ? "Creating..." : "Create Ticket"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ticket History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ticket History</CardTitle>
                <CardDescription>
                  View all your deposit and withdrawal tickets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Page Size Selector */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="page-size">Show:</Label>
                      <Select
                        value={pagination.pageSize.toString()}
                        onValueChange={handlePageSizeChange}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-muted-foreground">
                        entries
                      </span>
                    </div>

                    {ticketsLoading && (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="text-sm text-muted-foreground">
                          Loading...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tickets List */}
                  {tickets.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No tickets found</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            {getTicketTypeIcon(ticket.ticketType)}
                            <div>
                              <p className="font-medium">
                                {getTicketTypeText(ticket.ticketType)} -{" "}
                                {ticket.amount.toFixed(2)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Ticket ID: {ticket.id}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={getStatusColor(ticket.ticketStatus)}
                            >
                              {getStatusIcon(ticket.ticketStatus)}
                              <span className="ml-1">
                                {getStatusText(ticket.ticketStatus)}
                              </span>
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {tickets.length > 0 && (
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        {(pagination.currentPage - 1) * pagination.pageSize + 1}{" "}
                        to{" "}
                        {Math.min(
                          pagination.currentPage * pagination.pageSize,
                          pagination.totalItems
                        )}{" "}
                        of {pagination.totalItems} entries
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(1)}
                          disabled={
                            pagination.currentPage === 1 || ticketsLoading
                          }
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                          }
                          disabled={
                            pagination.currentPage === 1 || ticketsLoading
                          }
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center space-x-1">
                          {Array.from(
                            { length: Math.min(5, pagination.totalPages) },
                            (_, i) => {
                              const pageNumber = i + 1;
                              return (
                                <Button
                                  key={pageNumber}
                                  variant={
                                    pagination.currentPage === pageNumber
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handlePageChange(pageNumber)}
                                  disabled={ticketsLoading}
                                  className="w-8 h-8"
                                >
                                  {pageNumber}
                                </Button>
                              );
                            }
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                          }
                          disabled={
                            pagination.currentPage === pagination.totalPages ||
                            ticketsLoading
                          }
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePageChange(pagination.totalPages)
                          }
                          disabled={
                            pagination.currentPage === pagination.totalPages ||
                            ticketsLoading
                          }
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
