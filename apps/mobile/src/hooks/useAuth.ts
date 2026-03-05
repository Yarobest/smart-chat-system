import { useMemo } from 'react';

export function useAuth() {
  return useMemo(() => ({
    isAuthenticated: false,
    role: 'student' as const,
  }), []);
}
