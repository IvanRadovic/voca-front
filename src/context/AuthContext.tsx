import { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, tokenStorage } from '../lib/api';
import { qk } from '../lib/queryClient';
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
  refresh: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// The auth endpoints embed the user flat; /user wraps it in `data`.
const unwrap = (payload: { data: User } | User): User =>
  payload && typeof payload === 'object' && 'data' in payload ? payload.data : (payload as User);

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const hasToken = !!tokenStorage.get();

  const { data: user, isLoading } = useQuery({
    queryKey: qk.user,
    queryFn: async () => (await api.get<{ data: User }>('/user')).data,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60_000,
    select: (res) => res.data,
  });

  const setSession = useCallback(
    (token: string, payload: { data: User } | User) => {
      tokenStorage.set(token);
      const u = unwrap(payload);
      qc.setQueryData(qk.user, { data: u });
      return u;
    },
    [qc],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post('/login', { email, password });
      return setSession(data.token, data.user);
    },
    [setSession],
  );

  const registerYouth = useCallback(
    async (payload: Record<string, unknown>) => {
      const { data } = await api.post('/register', payload);
      return setSession(data.token, data.user);
    },
    [setSession],
  );

  const registerNvo = useCallback(
    async (payload: Record<string, unknown>) => {
      const { data } = await api.post('/register/nvo', payload);
      return setSession(data.token, data.user);
    },
    [setSession],
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch {
      // ignore network errors on logout
    }
    tokenStorage.clear();
    qc.clear();
  }, [qc]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      loading: hasToken && isLoading,
      isAuthenticated: !!user,
      isNvo: user?.role === 'nvo',
      isYouth: user?.role === 'youth',
      login,
      registerYouth,
      registerNvo,
      logout,
      refresh: () => qc.invalidateQueries({ queryKey: qk.user }),
      setUser: (u: User) => qc.setQueryData(qk.user, { data: u }),
    }),
    [user, hasToken, isLoading, login, registerYouth, registerNvo, logout, qc],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
