import { createContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'medsutra_user';

export const AuthContext = createContext(null);

/**
 * Centralised auth state provider.
 * Reads/writes user data to localStorage and keeps it synced
 * across tabs via the `storage` event.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  /* Sync across tabs */
  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const login = useCallback((userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    window.dispatchEvent(new Event('storage'));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    window.dispatchEvent(new Event('storage'));
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
