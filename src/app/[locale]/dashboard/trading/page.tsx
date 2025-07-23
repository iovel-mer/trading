'use client';

import { getTickets } from '@/app/api/balance/getTickets';
import { getTradingAccounts } from '@/app/api/balance/getTradingAccounts';
import { getWallets } from '@/app/api/balance/getWallets';
import { postCreateTicket } from '@/app/api/balance/postCreateTicket';
import {
  createTradingAccount,
  CreateTradingAccountRequest,
} from '@/app/api/trading/createTradingAccount';
import type {
  TicketDto,
  TicketStatus,
  TicketType,
  TradingAccountDto,
  WalletDto,
} from '@/app/api/types/trading';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  DollarSign,
  History,
  Loader2,
  Plus,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Wallet,
  XCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type React from 'react';
import { useEffect, useState } from 'react';

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export default function TradingPage() {
  const [activeTab, setActiveTab] = useState('accounts');
  const [tradingAccounts, setTradingAccounts] = useState<TradingAccountDto[]>(
    []
  );
  const [wallets, setWallets] = useState<WalletDto[]>([]);
  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [ticketAmount, setTicketAmount] = useState('');
  const [ticketType, setTicketType] = useState<TicketType>(0);
  const [creatingTicket, setCreatingTicket] = useState(false);

  const [newAccountName, setNewAccountName] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const t = useTranslations();

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const { toast } = useToast();

  useEffect(() => {
    loadTradingAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      loadWallets(selectedAccount);
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (activeTab === 'history' && selectedAccount) {
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
        title: 'Error',
        description: response.message || t('trading.errorTitle'),
        variant: 'destructive',
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
        title: 'Error',
        description: response.message || t('trading.errorTitle'),
        variant: 'destructive',
      });
    }
  };

  const loadTickets = async (page = 1, pageSize = 10) => {
    if (!selectedAccount) return;
    setTicketsLoading(true);
    const response = await getTickets({
      tradingAccountId: selectedAccount,
      pageIndex: page - 1,
      pageSize: pageSize,
    });
    if (response.success && response.data) {
      setTickets(response.data);
      const estimatedTotal =
        response.data.length === pageSize
          ? page * pageSize + 1
          : (page - 1) * pageSize + response.data.length;
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalItems: estimatedTotal,
        totalPages: Math.ceil(estimatedTotal / pageSize),
      }));
    } else {
      toast({
        title: 'Error',
        description: response.message || 'Failed to load tickets',
        variant: 'destructive',
      });
    }
    setTicketsLoading(false);
  };

  const handleCreateAccount = async () => {
    if (!newAccountName.trim()) {
      toast({
        title: 'Validation Error',
        description: t('trading.createAccount.validationError'),
        variant: 'destructive',
      });
      return;
    }

    setCreatingAccount(true);

    const request: CreateTradingAccountRequest = {
      displayName: newAccountName.trim(),
    };

    const result = await createTradingAccount(request);

    if (result.success) {
      toast({
        title: 'Success',
        description: t('trading.createAccount.successMessage'),
      });

      setNewAccountName('');

      await loadTradingAccounts();

      setActiveTab('accounts');
    } else {
      toast({
        title: 'Error',
        description: t('trading.createAccount.errorMessage'),
        variant: 'destructive',
      });
    }

    setCreatingAccount(false);
  };

  const createTicket = async () => {
    if (
      !selectedWallet ||
      !ticketAmount ||
      Number.parseFloat(ticketAmount) <= 0
    ) {
      toast({
        title: 'Validation Error',
        description: t('trading.createTicket.validationError'),
        variant: 'destructive',
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
        title: 'Success',
        description: `${t('trading.createTicket.successMessage')} ${
          response.data
        }`,
      });
      setTicketAmount('');
      if (activeTab === 'history') {
        loadTickets(1, pagination.pageSize);
      }
    } else {
      toast({
        title: 'Error',
        description: response.message || t('trading.createTicket.errorMessage'),
        variant: 'destructive',
      });
    }
    setCreatingTicket(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const pageSize = Number.parseInt(newPageSize);
    setPagination(prev => ({
      ...prev,
      pageSize,
      currentPage: 1,
    }));
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 2: // Completed
        return <CheckCircle className='h-4 w-4 text-green-600' />;
      case 0: // Pending
        return <Clock className='h-4 w-4 text-yellow-600' />;
      case 1: // Processing
        return <AlertCircle className='h-4 w-4 text-blue-600' />;
      case 3: // Cancelled
      case 4: // Failed
      case 5: // Rejected
        return <XCircle className='h-4 w-4 text-red-600' />;
      default:
        return <Clock className='h-4 w-4 text-gray-600' />;
    }
  };

  const getStatusText = (status: TicketStatus) => {
    const statusMap = {
      0: t('trading.ticketStatus.pending'),
      1: t('trading.ticketStatus.processing'),
      2: t('trading.ticketStatus.completed'),
      3: t('trading.ticketStatus.cancelled'),
      4: t('trading.ticketStatus.failed'),
      5: t('trading.ticketStatus.rejected'),
    };
    return statusMap[status] || 'Unknown';
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 2: // Completed
        return 'bg-green-100 text-green-800';
      case 0: // Pending
        return 'bg-yellow-100 text-yellow-800';
      case 1: // Processing
        return 'bg-blue-100 text-blue-800';
      case 3: // Cancelled
      case 4: // Failed
      case 5: // Rejected
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTicketTypeText = (type: TicketType) => {
    return type === 0
      ? t('trading.createTicket.deposit')
      : t('trading.createTicket.withdrawal');
  };

  const getTicketTypeIcon = (type: TicketType) => {
    return type === 0 ? (
      <TrendingUp className='h-4 w-4 text-green-600' />
    ) : (
      <TrendingDown className='h-4 w-4 text-red-600' />
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
            <p className='mt-2 text-muted-foreground'>
              {t('trading.loading')}{' '}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {t('trading.title')}
          </h1>
          <p className='text-muted-foreground'>{t('trading.subtitle')}</p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='accounts' className='flex items-center gap-2'>
              <Wallet className='h-4 w-4' />
              {t('trading.tabs.accounts')}
            </TabsTrigger>
            <TabsTrigger
              value='create-account'
              className='flex items-center gap-2'
            >
              <UserPlus className='h-4 w-4' />
              {t('trading.tabs.createAccount')}
            </TabsTrigger>
            <TabsTrigger value='create' className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              {t('trading.tabs.create')}
            </TabsTrigger>
            <TabsTrigger value='history' className='flex items-center gap-2'>
              <History className='h-4 w-4' />
              {t('trading.tabs.history')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='accounts' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>{t('trading.accounts.title')}</CardTitle>
                <CardDescription>
                  {t('trading.accounts.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='ms-auto mt-3'>
                    <Label htmlFor='account-select' className='justify-end'>
                      {t('trading.accounts.selectLabel')}
                    </Label>
                    <Select
                      value={selectedAccount}
                      onValueChange={setSelectedAccount}
                    >
                      <SelectTrigger className='ms-auto mt-3'>
                        <SelectValue placeholder='Select a trading account' />
                      </SelectTrigger>
                      <SelectContent>
                        {tradingAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.displayName} ({account.accountNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedAccount && (
                    <div className='space-y-4'>
                      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        {wallets.map(wallet => (
                          <Card key={wallet.id} className='p-4'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-2'>
                                <DollarSign className='h-5 w-5 text-green-600' />
                                <div>
                                  <p className='font-medium'>
                                    {wallet.currency}
                                  </p>
                                  <p className='text-sm text-muted-foreground'>
                                    {t('trading.accounts.available')}:{' '}
                                    {wallet.availableBalance.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className='text-right'>
                                <p className='font-bold'>
                                  ${wallet.usdEquivalent.toFixed(2)}
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                  {t('trading.accounts.total')}{' '}
                                  {wallet.totalBalance.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            {wallet.lockedBalance > 0 && (
                              <div className='mt-2 text-sm text-muted-foreground'>
                                {t('trading.accounts.locked')}:{' '}
                                {wallet.lockedBalance.toFixed(2)}
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

          {/* New Create Account Tab */}
          <TabsContent value='create-account' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>{t('trading.createAccount.title')}</CardTitle>
                <CardDescription>
                  {t('trading.createAccount.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div>
                    <Label htmlFor='account-name' className='mb-2'>
                      {t('trading.createAccount.nameLabel')}
                    </Label>
                    <Input
                      id='account-name'
                      placeholder={t('trading.createAccount.namePlaceholder')}
                      value={newAccountName}
                      onChange={e => setNewAccountName(e.target.value)}
                      disabled={creatingAccount}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newAccountName.trim()) {
                          handleCreateAccount();
                        }
                      }}
                    />
                    <p className='text-sm text-muted-foreground mt-1'>
                      {t('trading.createAccount.nameHelp')}
                    </p>
                  </div>

                  <Button
                    onClick={handleCreateAccount}
                    disabled={creatingAccount || !newAccountName.trim()}
                  >
                    {creatingAccount && (
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                    )}
                    {creatingAccount
                      ? t('trading.createAccount.creating')
                      : t('trading.createAccount.createButton')}
                  </Button>

                  {tradingAccounts.length > 0 && (
                    <div className='mt-6'>
                      <h4 className='text-sm font-medium mb-3'>
                        {t('trading.createAccount.existingAccounts')}
                      </h4>
                      <div className='space-y-2'>
                        {tradingAccounts.map(account => (
                          <div
                            key={account.id}
                            className='flex items-center justify-between p-3 border rounded-lg'
                          >
                            <div>
                              <p className='font-medium'>
                                {account.displayName}
                              </p>
                              <p className='text-sm text-muted-foreground'>
                                {t('trading.createAccount.account')}{' '}
                                {account.accountNumber}
                              </p>
                            </div>
                            <Badge
                              variant={
                                account.status === 'Active'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {account.status === 'Active'
                                ? t('trading.accountStatus.active')
                                : t('trading.accountStatus.suspended')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='create' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>{t('trading.createTicket.title')}</CardTitle>
                <CardDescription>
                  {t('trading.createTicket.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div>
                    <Label htmlFor='account-select' className='mb-2'>
                      {t('trading.createTicket.accountLabel')}
                    </Label>
                    <Select
                      value={selectedAccount}
                      onValueChange={setSelectedAccount}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue
                          placeholder={t(
                            'trading.createTicket.walletPlaceholder'
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent className='w-full'>
                        {tradingAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.displayName} ({account.accountNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='wallet-select' className='mb-2'>
                      {t('trading.createTicket.walletLabel')}
                    </Label>
                    <Select
                      value={selectedWallet}
                      onValueChange={setSelectedWallet}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select a wallet' />
                      </SelectTrigger>
                      <SelectContent>
                        {wallets.map(wallet => (
                          <SelectItem key={wallet.id} value={wallet.id}>
                            {wallet.currency} - $
                            {wallet.usdEquivalent.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='ticket-type' className='mb-2'>
                      {t('trading.createTicket.typeLabel')}
                    </Label>
                    <Select
                      value={ticketType.toString()}
                      onValueChange={(value: string) =>
                        setTicketType(Number.parseInt(value) as TicketType)
                      }
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue
                          placeholder={t(
                            'trading.createTicket.typePlaceholder'
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='0'>
                          <div className='flex items-center gap-2'>
                            <TrendingUp className='h-4 w-4 text-green-600' />
                            {t('trading.createTicket.deposit')}
                          </div>
                        </SelectItem>
                        <SelectItem value='1'>
                          <div className='flex items-center gap-2'>
                            <TrendingDown className='h-4 w-4 text-red-600' />
                            {t('trading.createTicket.withdrawal')}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='amount' className='mb-2'>
                      Amount
                    </Label>
                    <Input
                      id='amount'
                      type='number'
                      placeholder={t('trading.createTicket.amountPlaceholder')}
                      value={ticketAmount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTicketAmount(e.target.value)
                      }
                      min='0'
                      step='0.01'
                    />
                  </div>
                  <Button
                    onClick={createTicket}
                    disabled={
                      creatingTicket || !selectedWallet || !ticketAmount
                    }
                  >
                    {creatingTicket
                      ? t('trading.createTicket.creating')
                      : t('trading.createTicket.createButton')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='history' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>{t('trading.history.title')}</CardTitle>
                <CardDescription>
                  {t('trading.history.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {/* Page Size Selector */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <Label htmlFor='page-size'>
                        {t('trading.history.showLabel')}
                      </Label>
                      <Select
                        value={pagination.pageSize.toString()}
                        onValueChange={handlePageSizeChange}
                      >
                        <SelectTrigger className='w-20'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='5'>5</SelectItem>
                          <SelectItem value='10'>10</SelectItem>
                          <SelectItem value='20'>20</SelectItem>
                          <SelectItem value='50'>50</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className='text-sm text-muted-foreground'>
                        {t('trading.history.entries')}
                      </span>
                    </div>
                    {ticketsLoading && (
                      <div className='flex items-center space-x-2'>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary'></div>
                        <span className='text-sm text-muted-foreground'>
                          {t('trading.history.loading')}
                        </span>
                      </div>
                    )}
                  </div>
                  {tickets.length === 0 ? (
                    <div className='text-center py-8'>
                      <History className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                      <p className='text-muted-foreground'>
                        {t('trading.history.noTickets')}
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      {tickets.map(ticket => (
                        <div
                          key={ticket.id}
                          className='flex items-center justify-between p-4 border rounded-lg'
                        >
                          <div className='flex items-center space-x-4'>
                            {getTicketTypeIcon(ticket.ticketType)}
                            <div>
                              <p className='font-medium'>
                                {getTicketTypeText(ticket.ticketType)} -{' '}
                                {ticket.amount.toFixed(2)}
                              </p>
                              <p className='text-sm text-muted-foreground'>
                                {t('trading.history.ticketId')} {ticket.id}
                              </p>
                            </div>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Badge
                              className={getStatusColor(ticket.ticketStatus)}
                            >
                              {getStatusIcon(ticket.ticketStatus)}
                              <span className='ml-1'>
                                {getStatusText(ticket.ticketStatus)}
                              </span>
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {tickets.length > 0 && (
                    <div className='flex items-center justify-between pt-4'>
                      <div className='text-sm text-muted-foreground'>
                        {t('trading.history.showing')}{' '}
                        {(pagination.currentPage - 1) * pagination.pageSize + 1}{' '}
                        {t('trading.history.to')}{' '}
                        {Math.min(
                          pagination.currentPage * pagination.pageSize,
                          pagination.totalItems
                        )}{' '}
                        {t('trading.history.of')} {pagination.totalItems}{' '}
                        {t('trading.history.entriesText')}
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handlePageChange(1)}
                          disabled={
                            pagination.currentPage === 1 || ticketsLoading
                          }
                        >
                          <ChevronsLeft className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                          }
                          disabled={
                            pagination.currentPage === 1 || ticketsLoading
                          }
                        >
                          <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <div className='flex items-center space-x-1'>
                          {Array.from(
                            { length: Math.min(5, pagination.totalPages) },
                            (_, i) => {
                              const pageNumber = i + 1;
                              return (
                                <Button
                                  key={pageNumber}
                                  variant={
                                    pagination.currentPage === pageNumber
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size='sm'
                                  onClick={() => handlePageChange(pageNumber)}
                                  disabled={ticketsLoading}
                                  className='w-8 h-8'
                                >
                                  {pageNumber}
                                </Button>
                              );
                            }
                          )}
                        </div>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                          }
                          disabled={
                            pagination.currentPage === pagination.totalPages ||
                            ticketsLoading
                          }
                        >
                          <ChevronRight className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            handlePageChange(pagination.totalPages)
                          }
                          disabled={
                            pagination.currentPage === pagination.totalPages ||
                            ticketsLoading
                          }
                        >
                          <ChevronsRight className='h-4 w-4' />
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
