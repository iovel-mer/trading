"use client";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Shield, Camera } from "lucide-react";
import { useUser } from "@/app/dashboard/context/user-context";

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
                    {user ? `${user.firstName[0]}${user.lastName[0]}` : "DU"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>
                {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
              </CardTitle>
              <CardDescription>{user?.email || "Loading..."}</CardDescription>
            </CardHeader>
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
                    defaultValue={user?.firstName || ""}
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    defaultValue={user?.lastName || ""}
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="email"
                      defaultValue={user?.email || ""}
                      className="flex-1 p-2 border rounded-md bg-background"
                      disabled
                    />
                    <Badge variant="secondary">
                      {user?.isEmailConfirmed ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue={user?.phoneNumber || ""}
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Username</label>
                  <input
                    type="text"
                    defaultValue={user?.username || ""}
                    className="w-full p-2 border rounded-md bg-background"
                    disabled
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
