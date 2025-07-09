"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/app/api/auth/getCurrentUser";
import { postLoginForRedirect } from "@/app/api/auth/postLoginForRedirect";
import type { UserSettings, LoginCredentials } from "@/app/api/types/auth";
import { useToast } from "@/hooks/use-toast";

interface UserContextType {
  user: UserSettings | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  openWebTrader: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCurrentUser();

      if (!response.success) {
        setError(response.message as any);
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      setUser(response.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch user data");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUserData();
  };

  const openWebTrader = async () => {
    try {
      const storedCredentials = localStorage.getItem('webTraderCredentials');
      if (!storedCredentials) {
        toast({
          title: "Error",
          description: "No stored credentials found. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      const credentials: LoginCredentials = JSON.parse(storedCredentials);
      
      const response = await postLoginForRedirect(credentials);
      
      if (!response.success) {
        toast({
          title: "Error",
          description: response.message || "Failed to get Web Trader access",
          variant: "destructive",
        });
        return;
      }

      const token = response.data;
      if (!token) {
        toast({
          title: "Error",
          description: "No token received from server",
          variant: "destructive",
        });
        return;
      }

      // Redirect to Web Trader with token
      window.open(`http://localhost:3000/trading-view?ctx=${token}`, '_blank');
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to open Web Trader",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const contextValue = { 
    user, 
    loading, 
    error, 
    refreshUser, 
    isAuthenticated, 
    openWebTrader
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
