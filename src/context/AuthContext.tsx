import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api, tokenStorage } from '../lib/api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isNvo: boolean;
  isYouth: boolean;
  login: (email: string, password: string) => Promise<User>;
  registerYouth: (payload: Record<string, unknown>) => Promise<User>;
  registerNvo: (payload: Record<string, unknown>) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!tokenStorage.get()) {
      setUserState(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/user');
      setUserState(data.data);
    } catch {
      tokenStorage.clear();
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleAuthResponse = (data: { token: string; user: { data: User } | User }) => {
    tokenStorage.set(data.token);
    // Auth endpoints wrap the user in a UserResource ("data").
    const u = 'data' in data.user ? (data.user as { data: User }).data : (data.user as User);
    setUserState(u);
    return u;
  };

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post('/login', { email, password });
    return handleAuthResponse(data);
  }, []);

  const registerYouth = useCallback(async (payload: Record<string, unknown>) => {
    const { data } = await api.post('/register', payload);
    return handleAuthResponse(data);
  }, []);

  const registerNvo = useCallback(async (payload: Record<string, unknown>) => {
    const { data } = await api.post('/register/nvo', payload);
    return handleAuthResponse(data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch {
      // ignore network errors on logout
    }
    tokenStorage.clear();
    setUserState(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isNvo: user?.role === 'nvo',
      isYouth: user?.role === 'youth',
      login,
      registerYouth,
      registerNvo,
      logout,
      refresh: fetchUser,
      setUser: setUserState,
    }),
    [user, loading, login, registerYouth, registerNvo, logout, fetchUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
