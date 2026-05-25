'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface CustomerProfile {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextValue {
  customer: CustomerProfile | null;
  loading: boolean;
  setCustomer: (c: CustomerProfile | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  customer: null,
  loading: true,
  setCustomer: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const apiBase = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';

  // Fetch session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch(`${apiBase}/api/customer/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          setCustomer(json.customer);
        }
      } catch {
        // Not logged in or network error — silently ignore
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [apiBase]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${apiBase}/api/customer/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Silent
    }
    setCustomer(null);
  }, [apiBase]);

  return (
    <AuthContext.Provider value={{ customer, loading, setCustomer, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useCustomer() {
  return useContext(AuthContext);
}
