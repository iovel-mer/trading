'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard, 
  History, 
  Plus,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { tradingApi, TradingAccountDto, WalletDto, TicketDto, TicketType, TicketStatus } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function TradingPage() {
  const [activeTab, setActiveTab] = useState('accounts');
  const [tradingAccounts, setTradingAccounts] = useState<TradingAccountDto[]>([]);
  const [wallets, setWallets] = useState<WalletDto[]>([]);
  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [ticketAmount, setTicketAmount] = useState('');
  const [ticketType, setTicketType] = useState<TicketType>(TicketType.Deposit);
  const [creatingTicket, setCreatingTicket] = useState(false);
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

  // Load tickets when tab changes to history
  useEffect(() => {
    if (activeTab === 'history') {
      loadTickets();
    }
  }, [activeTab]);

  const loadTradingAccounts = async () => {
    try {
      setLoading(true);
      const response = await tradingApi.getTradingAccounts();
      if (response.data) {
        setTradingAccounts(response.data);
        if (response.data.length > 0) {
          setSelectedAccount(response.data[0].id);
        }
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to load trading accounts",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load trading accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadWallets = async (accountId: string) => {
    try {
      const response = await tradingApi.getWallets(accountId);
      if (response.data) {
        setWallets(response.data);
        if (response.data.length > 0) {
          setSelectedWallet(response.data[0].id);
        }
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to load wallets",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load wallets",
        variant: "destructive",
      });
    }
  };

  const loadTickets = async () => {
    try {
      const response = await tradingApi.getTickets();
      if (response.data) {
        setTickets(response.data);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to load tickets",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tickets",
        variant: "destructive",
      });
    }
  };

  const createTicket = async () => {
    if (!selectedWallet || !ticketAmount || parseFloat(ticketAmount) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please select a wallet and enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreatingTicket(true);
      const response = await tradingApi.createTicket({
        walletId: selectedWallet,
        type: ticketType,
        amount: parseFloat(ticketAmount),
      });

      if (response.data) {
        toast({
          title: "Success",
          description: `Ticket created successfully with ID: ${response.data}`,
        });
        setTicketAmount('');
        // Reload tickets if we're on the history tab
        if (activeTab === 'history') {
          loadTickets();
        }
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create ticket",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket",
        variant: "destructive",
      });
    } finally {
      setCreatingTicket(false);
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.Completed:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case TicketStatus.Pending:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case TicketStatus.Processing:
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case TicketStatus.Cancelled:
      case TicketStatus.Failed:
      case TicketStatus.Rejected:
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.Pending:
        return 'Pending';
      case TicketStatus.Processing:
        return 'Processing';
      case TicketStatus.Completed:
        return 'Completed';
      case TicketStatus.Cancelled:
        return 'Cancelled';
      case TicketStatus.Failed:
        return 'Failed';
      case TicketStatus.Rejected:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.Completed:
        return 'bg-green-100 text-green-800';
      case TicketStatus.Pending:
        return 'bg-yellow-100 text-yellow-800';
      case TicketStatus.Processing:
        return 'bg-blue-100 text-blue-800';
      case TicketStatus.Cancelled:
      case TicketStatus.Failed:
      case TicketStatus.Rejected:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTicketTypeText = (type: TicketType) => {
    return type === TicketType.Deposit ? 'Deposit' : 'Withdraw';
  };

  const getTicketTypeIcon = (type: TicketType) => {
    return type === TicketType.Deposit ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading trading data...</p>
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
            Manage your trading accounts, create tickets, and view transaction history.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                  <div>
                    <Label htmlFor="account-select">Trading Account</Label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger>
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
                                  <p className="font-medium">{wallet.currency}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Available: {wallet.availableBalance.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">${wallet.usdEquivalent.toFixed(2)}</p>
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
                  Create a deposit or withdrawal ticket for your trading account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="account-select">Trading Account</Label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger>
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

                  <div>
                    <Label htmlFor="wallet-select">Wallet</Label>
                    <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a wallet" />
                      </SelectTrigger>
                      <SelectContent>
                        {wallets.map((wallet) => (
                          <SelectItem key={wallet.id} value={wallet.id}>
                            {wallet.currency} - ${wallet.usdEquivalent.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                                         <Label htmlFor="ticket-type">Ticket Type</Label>
                     <Select value={ticketType.toString()} onValueChange={(value: string) => setTicketType(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ticket type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TicketType.Deposit.toString()}>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            Deposit
                          </div>
                        </SelectItem>
                        <SelectItem value={TicketType.Withdraw.toString()}>
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-600" />
                            Withdraw
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount</Label>
                                         <Input
                       id="amount"
                       type="number"
                       placeholder="Enter amount"
                       value={ticketAmount}
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTicketAmount(e.target.value)}
                       min="0"
                       step="0.01"
                     />
                  </div>

                  <Button 
                    onClick={createTicket} 
                    disabled={creatingTicket || !selectedWallet || !ticketAmount}
                    className="w-full"
                  >
                    {creatingTicket ? 'Creating...' : 'Create Ticket'}
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
                  {tickets.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No tickets found</p>
                    </div>
                  ) : (
                    tickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getTicketTypeIcon(ticket.ticketType)}
                          <div>
                            <p className="font-medium">
                              {getTicketTypeText(ticket.ticketType)} - {ticket.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Ticket ID: {ticket.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(ticket.ticketStatus)}>
                            {getStatusIcon(ticket.ticketStatus)}
                            <span className="ml-1">{getStatusText(ticket.ticketStatus)}</span>
                          </Badge>
                        </div>
                      </div>
                    ))
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