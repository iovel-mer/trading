'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Shield, Settings, Edit, Camera } from 'lucide-react';
import { useUser } from '@/contexts/user-context';

export default function ProfilePage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and personal information.
          </p>
        </div>

        {/* Profile Overview */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="relative mx-auto w-24 h-24 mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-green-400 to-blue-500 text-white">
                    {user ? `${user.firstName[0]}${user.lastName[0]}` : 'DU'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle>{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</CardTitle>
              <CardDescription>{user?.email || 'Loading...'}</CardDescription>
              <div className="flex justify-center mt-2">
                <Badge variant="default" className="bg-green-500">
                  {user?.isEmailConfirmed ? 'Email Verified' : 'Email Unverified'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Role:</span>
                <span>{user?.role || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email Status:</span>
                <span>{user?.isEmailConfirmed ? 'Confirmed' : 'Unconfirmed'}</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button className="w-full" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.firstName || ''} 
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.lastName || ''} 
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="email" 
                      defaultValue={user?.email || ''} 
                      className="flex-1 p-2 border rounded-md bg-background"
                      disabled
                    />
                    <Badge variant="secondary">{user?.isEmailConfirmed ? 'Verified' : 'Unverified'}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input 
                    type="tel" 
                    defaultValue={user?.phoneNumber || ''} 
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Username</label>
                  <input 
                    type="text" 
                    defaultValue={user?.username || ''} 
                    className="w-full p-2 border rounded-md bg-background"
                    disabled
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Settings */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and privacy.
              </CardDescription>
            </CardHeader>
                        <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Badge variant={user?.isTwoFactorEnabled ? "secondary" : "outline"}>
                  {user?.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email Confirmation</p>
                    <p className="text-sm text-muted-foreground">Email address verification status</p>
                  </div>
                </div>
                <Badge variant={user?.isEmailConfirmed ? "secondary" : "outline"}>
                  {user?.isEmailConfirmed ? 'Confirmed' : 'Unconfirmed'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Account Role</p>
                    <p className="text-sm text-muted-foreground">Your account role and permissions</p>
                  </div>
                </div>
                <Badge variant="secondary">{user?.role || 'N/A'}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trading Preferences</CardTitle>
              <CardDescription>
                Configure your trading experience and preferences.
              </CardDescription>
            </CardHeader>
                        <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Account Information</p>
                    <p className="text-sm text-muted-foreground">Your account details and settings</p>
                  </div>
                </div>
                <Badge variant="secondary">View Details</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">Contact Information</p>
                    <p className="text-sm text-muted-foreground">Phone and email details</p>
                  </div>
                </div>
                <Badge variant="secondary">Manage</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="font-medium">Security Settings</p>
                    <p className="text-sm text-muted-foreground">Two-factor and email verification</p>
                  </div>
                </div>
                <Badge variant="secondary">Configure</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent account activities and login history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Login successful</p>
                  <p className="text-xs text-muted-foreground">New York, NY - Chrome on Windows</p>
                </div>
                <div className="text-sm text-muted-foreground">2 minutes ago</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Profile updated</p>
                  <p className="text-xs text-muted-foreground">Phone number changed</p>
                </div>
                <div className="text-sm text-muted-foreground">1 hour ago</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Security settings updated</p>
                  <p className="text-xs text-muted-foreground">Two-factor authentication enabled</p>
                </div>
                <div className="text-sm text-muted-foreground">2 days ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 