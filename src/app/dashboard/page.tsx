'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authManager } from '@/lib/auth';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useUser } from '@/contexts/user-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Users, Activity } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, error } = useUser();

  useEffect(() => {
    // Check if user is authenticated
    if (!authManager.isAuthenticated()) {
      router.push('/login');
      return;
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user ? `${user.firstName} ${user.lastName}` : 'User'}!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your trading account today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12</div>
              <p className="text-xs text-muted-foreground">
                +2 new trades today
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Verified account
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest trading activities and transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Buy Order Executed</p>
                    <p className="text-xs text-muted-foreground">AAPL - 10 shares at $150.25</p>
                  </div>
                  <div className="text-sm text-muted-foreground">2 min ago</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Sell Order Executed</p>
                    <p className="text-xs text-muted-foreground">TSLA - 5 shares at $245.80</p>
                  </div>
                  <div className="text-sm text-muted-foreground">15 min ago</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Deposit Received</p>
                    <p className="text-xs text-muted-foreground">$5,000.00 deposited to account</p>
                  </div>
                  <div className="text-sm text-muted-foreground">1 hour ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common actions you can take.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border p-3 text-center hover:bg-accent cursor-pointer">
                  <TrendingUp className="h-4 w-4 mx-auto mb-1" />
                  <p className="text-xs">New Trade</p>
                </div>
                <div className="rounded-lg border p-3 text-center hover:bg-accent cursor-pointer">
                  <DollarSign className="h-4 w-4 mx-auto mb-1" />
                  <p className="text-xs">Deposit</p>
                </div>
                <div className="rounded-lg border p-3 text-center hover:bg-accent cursor-pointer">
                  <Activity className="h-4 w-4 mx-auto mb-1" />
                  <p className="text-xs">Analytics</p>
                </div>
                <div className="rounded-lg border p-3 text-center hover:bg-accent cursor-pointer">
                  <Users className="h-4 w-4 mx-auto mb-1" />
                  <p className="text-xs">Profile</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 