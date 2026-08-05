'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthResponse } from '@/types';
import { post, get } from '@/lib/api';
import { clearAuthToken, getAuthToken, storeAuthToken } from '@/lib/auth-token';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, tenantSlug?: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    tenantName: string;
    tenantSlug: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await get<User>('/auth/profile');
      setUser(response.data);
    } catch {
      clearAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string, tenantSlug?: string) => {
    const body: Record<string, string> = { email, password };
    if (tenantSlug) body.tenantSlug = tenantSlug;

    const response = await post<AuthResponse>('/auth/login', body);
    storeAuthToken(response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    tenantName: string;
    tenantSlug: string;
  }) => {
    const response = await post<AuthResponse>('/auth/register', data);
    storeAuthToken(response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  const logout = () => {
    clearAuthToken();
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
