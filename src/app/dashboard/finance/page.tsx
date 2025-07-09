'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, PiggyBank } from 'lucide-react';

export default function FinancePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
          <p className="text-muted-foreground">
            Manage your financial accounts, transactions, and investments.
          </p>
        </div>

        {/* Financial Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$125,430.89</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investments</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$80,199.00</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15.3%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,500.00</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">-2.1%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Account Details */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
              <CardDescription>
                Overview of your financial accounts and recent transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Trading Account</p>
                      <p className="text-sm text-muted-foreground">****-****-****-1234</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$45,231.89</p>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Investment Portfolio</p>
                      <p className="text-sm text-muted-foreground">Stocks & Bonds</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$80,199.00</p>
                    <Badge variant="secondary">Growing</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <PiggyBank className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Savings Account</p>
                      <p className="text-sm text-muted-foreground">High Yield Savings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$12,500.00</p>
                    <Badge variant="secondary">Stable</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common financial actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 gap-2">
                <div className="rounded-lg border p-3 text-center hover:bg-accent cursor-pointer">
                  <DollarSign className="h-4 w-4 mx-auto mb-1" />
                  <p className="text-xs">Deposit Funds</p>
                </div>
                <div className="rounded-lg border p-3 text-center hover:bg-accent cursor-pointer">
                  <CreditCard className="h-4 w-4 mx-auto mb-1" />
                  <p className="text-xs">Withdraw Funds</p>
                </div>
                <div className="rounded-lg border p-3 text-center hover:bg-accent cursor-pointer">
                  <TrendingUp className="h-4 w-4 mx-auto mb-1" />
                  <p className="text-xs">Transfer Between Accounts</p>
                </div>
                <div className="rounded-lg border p-3 text-center hover:bg-accent cursor-pointer">
                  <PiggyBank className="h-4 w-4 mx-auto mb-1" />
                  <p className="text-xs">View Statements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder for future content */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Analytics</CardTitle>
            <CardDescription>
              Detailed financial analysis and reporting will be available here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <p>Financial analytics and charts will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 