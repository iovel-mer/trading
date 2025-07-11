"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/app/api/auth/getCurrentUser";
import { postLoginForRedirect } from "@/app/api/auth/postLoginForRedirect";
import type { UserSettings, LoginCredentials } from "@/app/api/types/auth";
import { useToast } from "@/hooks/use-toast";
import { useCredentials } from "@/hooks/use-credentials";
import { isMobileDevice } from "@/lib/utils/web-trader-utils";

interface UserContextType {
  user: UserSettings | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  openWebTrader: () => Promise<void>;
  updateCredentials: (credentials: LoginCredentials) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { toast } = useToast();
  const { hasCredentials, clearCredentials, getCredentials, storeCredentials } = useCredentials();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCurrentUser();

      if (!response.success) {
        setError(response.message as any);
        setIsAuthenticated(false);
        setUser(null);
        clearCredentials(); // Clear credentials if user data fetch fails
        return;
      }

      setUser(response.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch user data");
      setIsAuthenticated(false);
      setUser(null);
      clearCredentials(); // Clear credentials if user data fetch fails
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUserData();
  };

  const openWebTrader = async () => {
    try {
      if (!hasCredentials()) {
        toast({
          title: "Error",
          description: "No stored credentials found. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      const credentials = getCredentials();
      if (!credentials) {
        toast({
          title: "Error",
          description: "Credentials are invalid. Please log in again.",
          variant: "destructive",
        });
        return;
      }

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
      const webTraderUrl = `https://webtrader.salesvault.dev/trading-view?ctx=${token}`;
      
      // Try multiple methods to open Web Trader directly
      let success = false;
      
      // Method 1: Try window.open with _blank
      try {
        const newWindow = window.open(webTraderUrl, '_blank');
        if (newWindow && !newWindow.closed) {
          success = true;
        }
      } catch (error) {
        console.warn('window.open failed:', error);
      }
      
      // Method 2: Try location.href (works better on mobile)
      if (!success) {
        try {
          window.location.href = webTraderUrl;
          success = true;
        } catch (error) {
          console.warn('location.href failed:', error);
        }
      }
      
      // Method 3: Try location.assign as fallback
      if (!success) {
        try {
          window.location.assign(webTraderUrl);
          success = true;
        } catch (error) {
          console.warn('location.assign failed:', error);
        }
      }
      
      // Method 4: Try location.replace as last resort
      if (!success) {
        try {
          window.location.replace(webTraderUrl);
          success = true;
        } catch (error) {
          console.warn('location.replace failed:', error);
        }
      }
      
      if (success) {
        toast({
          title: "Success",
          description: "Web Trader opened successfully",
        });
      } else {
        // If all methods failed, show error message
        toast({
          title: "Error",
          description: "Failed to open Web Trader. Please try again.",
          variant: "destructive",
        });
      }
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
    openWebTrader,
    updateCredentials: storeCredentials
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
