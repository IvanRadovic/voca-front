import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type AuthMode = 'login' | 'signup' | 'nvo';

interface ModalContextValue {
  authOpen: boolean;
  authMode: AuthMode;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  setAuthMode: (mode: AuthMode) => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const openAuth = useCallback((mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const value = useMemo(
    () => ({ authOpen, authMode, openAuth, closeAuth, setAuthMode }),
    [authOpen, authMode, openAuth, closeAuth],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
