'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  DollarSign,
  AlertCircle,
  Wallet,
  ArrowUpDown,
  PiggyBank,
  Activity,
} from 'lucide-react';
import { getWalletSummary } from '@/app/api/balance/getWalletSummary';
import { getTradingAccounts } from '@/app/api/balance/getTradingAccounts';
import type {
  WalletSummaryResponse,
  CurrencyBreakdown,
} from '@/app/api/types/wallet-summary';
import type { TradingAccountDto } from '@/app/api/types/trading';
import { useUser } from './context/user-context';
import { AuthConfirmer } from '../components/authConfirmer';
import { useTranslations } from 'next-intl';

interface DashboardData {
  walletSummary: WalletSummaryResponse | null;
  tradingAccounts: TradingAccountDto[];
}

const formatCurrencyAmount = (amount: number, currency: string): string => {
  if (currency === 'USD' || currency === 'USDT' || currency === 'USDC') {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const decimals = amount < 1 ? 6 : amount < 100 ? 4 : 2;
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const getWalletIcon = (currency: string) => {
  const iconMap: Record<string, string> = {
    BTC: '₿',
    ETH: 'Ξ',
    USDT: '$',
    USDC: '$',
    USD: '$',
    SOL: '◎',
    ADA: '₳',
    DOT: '●',
    LINK: '⬡',
    UNI: '🦄',
    BNB: '🔶',
    XRP: '◊',
    AUD: 'A$',
    EUR: '€',
    GBP: '£',
  };
  return iconMap[currency] || '◊';
};

const getCurrencyColors = (currency: string) => {
  const colorMap: Record<
    string,
    { bg: string; text: string; darkBg: string; darkText: string }
  > = {
    BTC: {
      bg: 'bg-orange-500',
      text: 'text-white',
      darkBg: 'dark:bg-orange-600',
      darkText: 'dark:text-white',
    },
    ETH: {
      bg: 'bg-blue-600',
      text: 'text-white',
      darkBg: 'dark:bg-blue-700',
      darkText: 'dark:text-white',
    },
    USDT: {
      bg: 'bg-green-500',
      text: 'text-white',
      darkBg: 'dark:bg-green-600',
      darkText: 'dark:text-white',
    },
    USDC: {
      bg: 'bg-blue-500',
      text: 'text-white',
      darkBg: 'dark:bg-blue-600',
      darkText: 'dark:text-white',
    },
    USD: {
      bg: 'bg-green-600',
      text: 'text-white',
      darkBg: 'dark:bg-green-700',
      darkText: 'dark:text-white',
    },
    SOL: {
      bg: 'bg-purple-500',
      text: 'text-white',
      darkBg: 'dark:bg-purple-600',
      darkText: 'dark:text-white',
    },
    ADA: {
      bg: 'bg-blue-700',
      text: 'text-white',
      darkBg: 'dark:bg-blue-800',
      darkText: 'dark:text-white',
    },
    DOT: {
      bg: 'bg-pink-500',
      text: 'text-white',
      darkBg: 'dark:bg-pink-600',
      darkText: 'dark:text-white',
    },
    LINK: {
      bg: 'bg-blue-600',
      text: 'text-white',
      darkBg: 'dark:bg-blue-700',
      darkText: 'dark:text-white',
    },
    UNI: {
      bg: 'bg-pink-600',
      text: 'text-white',
      darkBg: 'dark:bg-pink-700',
      darkText: 'dark:text-white',
    },
    BNB: {
      bg: 'bg-yellow-500',
      text: 'text-black',
      darkBg: 'dark:bg-yellow-600',
      darkText: 'dark:text-white',
    },
    XRP: {
      bg: 'bg-gray-800',
      text: 'text-white',
      darkBg: 'dark:bg-gray-900',
      darkText: 'dark:text-white',
    },
    AUD: {
      bg: 'bg-green-700',
      text: 'text-white',
      darkBg: 'dark:bg-green-800',
      darkText: 'dark:text-white',
    },
    EUR: {
      bg: 'bg-blue-800',
      text: 'text-white',
      darkBg: 'dark:bg-blue-900',
      darkText: 'dark:text-white',
    },
    GBP: {
      bg: 'bg-red-600',
      text: 'text-white',
      darkBg: 'dark:bg-red-700',
      darkText: 'dark:text-white',
    },
  };
  return (
    colorMap[currency] || {
      bg: 'bg-gray-500',
      text: 'text-white',
      darkBg: 'dark:bg-gray-600',
      darkText: 'dark:text-white',
    }
  );
};

const getPrimaryCurrency = (
  currencyBreakdown: CurrencyBreakdown[]
): CurrencyBreakdown | null => {
  const currenciesWithBalance = currencyBreakdown.filter(
    currency => currency.totalBalance > 0
  );

  if (currenciesWithBalance.length === 0) {
    return (
      currencyBreakdown.find(currency => currency.currency === 'USDT') ||
      currencyBreakdown[0] ||
      null
    );
  }

  return currenciesWithBalance.reduce((prev, current) => {
    return current.usdEquivalent > prev.usdEquivalent ? current : prev;
  });
};

const sortCurrencies = (
  currencies: CurrencyBreakdown[]
): CurrencyBreakdown[] => {
  return currencies.sort((a, b) => {
    const aHasBalance = a.totalBalance > 0 ? 1 : 0;
    const bHasBalance = b.totalBalance > 0 ? 1 : 0;

    if (aHasBalance !== bHasBalance) {
      return bHasBalance - aHasBalance;
    }

    return b.usdEquivalent - a.usdEquivalent;
  });
};

export default function DashboardPage() {
  const t = useTranslations();
  const {
    user,
    loading: userLoading,
    error: userError,
    refreshUser,
  } = useUser();

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    walletSummary: null,
    tradingAccounts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const [walletSummaryResponse, accountsResponse] = await Promise.all([
        getWalletSummary(),
        getTradingAccounts(),
      ]);

      if (!walletSummaryResponse.success) {
        setError(
          walletSummaryResponse.message || 'Failed to load wallet summary'
        );
        setLoading(false);
        return;
      }

      const walletSummary = walletSummaryResponse.data;
      const accounts = accountsResponse.success
        ? accountsResponse.data || []
        : [];

      setDashboardData({
        walletSummary: walletSummary ?? null,
        tradingAccounts: accounts,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading) {
      fetchDashboardData();
    }
  }, [userLoading]);

  const handleAuthConfirmed = async () => {
    await refreshUser();
    await fetchDashboardData();
  };

  if (userLoading || loading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
          <p className='mt-4 text-muted-foreground'>{t('dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || userError) {
    return (
      <DashboardLayout>
        <AuthConfirmer onAuthConfirmed={handleAuthConfirmed} />
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center'>
            <AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
            <h2 className='text-xl font-semibold mb-2'>
              {t('dashboard.errorTitle')}
            </h2>
            <p className='text-muted-foreground mb-4'>{error || userError}</p>
            <button
              onClick={() => window.location.reload()}
              className='bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90'
            >
              {t('dashboard.retry')}
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { walletSummary, tradingAccounts } = dashboardData;
  const primaryAccount = tradingAccounts[0];
  const primaryCurrency = walletSummary
    ? getPrimaryCurrency(walletSummary.currencyBreakdown)
    : null;
  const tickets = walletSummary?.ticketBreakdown || [];
  const activeTickets = tickets.filter(
    ticket => ticket.ticketStatus === 0 || ticket.ticketStatus === 1 // Pending or Processing
  );

  const getTicketStatusText = (status: number): string => {
    const statusMap = [
      t('dashboard.ticketStatus.pending'),
      t('dashboard.ticketStatus.processing'),
      t('dashboard.ticketStatus.completed'),
      t('dashboard.ticketStatus.cancelled'),
      t('dashboard.ticketStatus.failed'),
      t('dashboard.ticketStatus.rejected'),
    ];
    return statusMap[status] || statusMap[0];
  };

  const getUserName = (): string => {
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  };

  return (
    <DashboardLayout>
      <AuthConfirmer onAuthConfirmed={handleAuthConfirmed} />
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {user
              ? `${t('dashboard.welcomeBack')} ${getUserName()}!`
              : t('dashboard.welcomeBackDefault')}
          </h1>
          <p className='text-muted-foreground'>{t('dashboard.subtitle')}</p>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {t('dashboard.primaryBalance')}
              </CardTitle>
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  walletSummary?.totalBtcEquivalent
                    ? `${getCurrencyColors('BTC').bg} ${
                        getCurrencyColors('BTC').text
                      } ${getCurrencyColors('BTC').darkBg} ${
                        getCurrencyColors('BTC').darkText
                      }`
                    : 'text-muted-foreground'
                }`}
              >
                {walletSummary?.totalBtcEquivalent ? (
                  getWalletIcon('BTC')
                ) : (
                  <Wallet className='h-4 w-4' />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {walletSummary?.totalBtcEquivalent ? (
                  <>
                    {formatCurrencyAmount(
                      walletSummary.totalBtcEquivalent,
                      'BTC'
                    )}{' '}
                    <span className='text-lg text-muted-foreground'>BTC</span>
                  </>
                ) : (
                  0
                )}
              </div>
              <div className='space-y-1'>
                <p className='text-xs text-muted-foreground'>
                  {walletSummary?.totalUsdEquivalent ? (
                    <>
                      ≈ $
                      {walletSummary.totalUsdEquivalent.toLocaleString(
                        'en-US',
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </>
                  ) : (
                    `${walletSummary?.currencyBreakdown.length || 0} ${t(
                      'dashboard.currenciesAvailable'
                    )}`
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {t('dashboard.totalUsdValue')}
              </CardTitle>
              <DollarSign
                className='h-4 w-4 text-muted-foreground'
                color='green'
              />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                $
                {walletSummary?.totalUsdEquivalent.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || '0.00'}
              </div>
              <p className='text-xs text-muted-foreground'>
                {t('dashboard.available')} $
                {walletSummary?.totalAvailableBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || '0.00'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {t('dashboard.activeTickets')}
              </CardTitle>
              <TrendingUp
                className='h-4 w-4 text-muted-foreground'
                color='#0078ff'
              />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {walletSummary?.activeTickets || 0}
              </div>
              <p className='text-xs text-muted-foreground'>
                {walletSummary?.totalTickets || 0} {t('dashboard.totalTickets')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {t('dashboard.tradingActivity')}
              </CardTitle>
              <Activity
                className='h-4 w-4 text-muted-foreground'
                color='yellow'
              />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {walletSummary?.totalTradingOrders || 0}
              </div>
              <p className='text-xs text-muted-foreground'>
                {walletSummary?.totalAccounts || 0}{' '}
                {(walletSummary?.totalAccounts || 0) !== 1
                  ? t('dashboard.accounts')
                  : t('dashboard.account')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {t('dashboard.totalDeposits')}
              </CardTitle>
              <ArrowUpDown className='h-4 w-4 text-green-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                $
                {walletSummary?.totalDeposits.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || '0.00'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {t('dashboard.totalWithdrawals')}
              </CardTitle>
              <ArrowUpDown className='h-4 w-4 text-red-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-600'>
                $
                {walletSummary?.totalWithdrawals.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || '0.00'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {t('dashboard.lockedBalance')}
              </CardTitle>
              <PiggyBank
                className='h-4 w-4 text-muted-foreground'
                color='gold'
              />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                $
                {walletSummary?.totalLockedBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || '0.00'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Currency Breakdown */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <Card className='col-span-4'>
            <CardHeader>
              <CardTitle>{t('dashboard.recentTickets')}</CardTitle>
              <CardDescription>
                {t('dashboard.recentTicketsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {tickets.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>
                    {t('dashboard.noRecentTickets')}
                  </p>
                ) : (
                  tickets.slice(0, 5).map(ticket => (
                    <div
                      key={ticket.id}
                      className='flex items-center space-x-4'
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          ticket.ticketStatus === 2
                            ? 'bg-green-500'
                            : ticket.ticketStatus === 4 ||
                              ticket.ticketStatus === 5
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                      ></div>
                      <div className='flex-1 space-y-1'>
                        <p className='text-sm font-medium'>
                          {ticket.ticketType === 0
                            ? t('dashboard.depositRequest')
                            : t('dashboard.withdrawalRequest')}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          $
                          {ticket.amount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        <Badge variant='outline' className='text-xs'>
                          {getTicketStatusText(ticket.ticketStatus)}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className='col-span-3'>
            <CardHeader>
              <CardTitle>{t('dashboard.currencyBreakdown')}</CardTitle>
              <CardDescription>
                {t('dashboard.currencyBreakdownDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              {!walletSummary?.currencyBreakdown.length ? (
                <p className='text-sm text-muted-foreground'>
                  {t('dashboard.noCurrenciesFound')}
                </p>
              ) : (
                sortCurrencies(walletSummary.currencyBreakdown).map(
                  currency => (
                    <div
                      key={currency.currency}
                      className='rounded-lg border p-3'
                    >
                      <div className='flex justify-between items-center'>
                        <div className='flex items-center space-x-2'>
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              getCurrencyColors(currency.currency).bg
                            } ${getCurrencyColors(currency.currency).text} ${
                              getCurrencyColors(currency.currency).darkBg
                            } ${getCurrencyColors(currency.currency).darkText}`}
                          >
                            {getWalletIcon(currency.currency)}
                          </div>
                          <div>
                            <div className='flex items-center space-x-2'>
                              <p className='font-medium'>{currency.currency}</p>
                              {currency.availableBalance > 0 && (
                                <Badge
                                  variant='outline'
                                  className='text-xs px-1 py-0'
                                >
                                  {t('dashboard.active')}
                                </Badge>
                              )}
                            </div>
                            <p className='text-sm text-muted-foreground'>
                              {t('dashboard.available')}{' '}
                              {formatCurrencyAmount(
                                currency.availableBalance,
                                currency.currency
                              )}
                            </p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <p className='font-medium'>
                            {formatCurrencyAmount(
                              currency.totalBalance,
                              currency.currency
                            )}{' '}
                            {currency.currency}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            ≈ $
                            {currency.usdEquivalent.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                      {currency.lockedBalance > 0 && (
                        <div className='mt-2 text-xs text-muted-foreground'>
                          {t('dashboard.locked')}{' '}
                          {formatCurrencyAmount(
                            currency.lockedBalance,
                            currency.currency
                          )}{' '}
                          {currency.currency}
                        </div>
                      )}
                      <div className='mt-1 text-xs text-muted-foreground'>
                        {currency.walletCount}{' '}
                        {currency.walletCount !== 1
                          ? t('dashboard.wallets')
                          : t('dashboard.wallet')}
                      </div>
                    </div>
                  )
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
