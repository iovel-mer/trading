"use client";

console.log("🔥 [UserContext] Module loaded");

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/app/api/auth/getCurrentUser";
import type { UserSettings } from "@/app/api/types/auth";

interface UserContextType {
  user: UserSettings | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  console.log("🚀 [UserProvider] Component initialized - THIS SHOULD SHOW UP!");

  const [user, setUser] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    console.log("👤 [UserContext] User state changed:", {
      user: user,
      userEmail: user?.email,
      loading,
      error,
      isAuthenticated,
    });
  }, [user, loading, error, isAuthenticated]);

  const contextValue = { user, loading, error, refreshUser, isAuthenticated };

  console.log("🎨 [UserProvider] Rendering with state:", {
    user: user?.email || "null",
    loading,
    error,
    contextValue: contextValue,
  });

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  console.log("🔍 [useUser] Hook called, context value:", {
    user: context.user?.email || "null",
    loading: context.loading,
    error: context.error,
    fullUser: context.user,
  });

  return context;
}
