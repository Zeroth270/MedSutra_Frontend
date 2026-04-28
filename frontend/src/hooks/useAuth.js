import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Convenience hook to access auth state.
 * Returns { user, isAuthenticated, login, logout }.
 */
export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
