"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getStoredAppKey,
  setStoredAppKey as saveAppKeyToStorage,
  removeStoredAppKey,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
} from "@/lib/api/httpClient";
import { getMe } from "@/lib/api/auth";
import { UserRole, NasabahProfile, AdminProfile } from "@/lib/api/types";

interface AuthContextType {
  appKey: string | null;
  setAppKey: (key: string) => void;
  clearAppKey: () => void;
  token: string | null;
  role: UserRole | null;
  user: (NasabahProfile | AdminProfile) | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuthSession: (token: string, role: UserRole, profile: NasabahProfile | AdminProfile) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [appKey, setAppKeyState] = useState<string | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [user, setUserState] = useState<(NasabahProfile | AdminProfile) | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUserState(null);
      setRoleState(null);
      return;
    }
    try {
      const res = await getMe();
      if (res.data) {
        setRoleState(res.data.role);
        setUserState(res.data.profile);
      }
    } catch {
      removeStoredToken();
      setTokenState(null);
      setRoleState(null);
      setUserState(null);
    }
  }, []);

  useEffect(() => {
    // Initial hydration from storage
    const storedKey = getStoredAppKey();
    if (storedKey) {
      setAppKeyState(storedKey);
    }

    const storedAuthToken = getStoredToken();
    if (storedAuthToken) {
      setTokenState(storedAuthToken);
      refreshUser().finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const setAppKey = (key: string) => {
    saveAppKeyToStorage(key);
    setAppKeyState(key);
  };

  const clearAppKey = () => {
    removeStoredAppKey();
    setAppKeyState(null);
  };

  const setAuthSession = (
    newToken: string,
    newRole: UserRole,
    newProfile: NasabahProfile | AdminProfile
  ) => {
    setStoredToken(newToken);
    setTokenState(newToken);
    setRoleState(newRole);
    setUserState(newProfile);
  };

  const logout = () => {
    removeStoredToken();
    setTokenState(null);
    setRoleState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        appKey,
        setAppKey,
        clearAppKey,
        token,
        role,
        user,
        isLoading,
        isAuthenticated: !!token && !!user,
        setAuthSession,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
