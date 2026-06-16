import { useSyncExternalStore } from 'react';
import {
  getAuthSnapshot,
  getServerAuthSnapshot,
  subscribeAuthStore,
} from '@/src/stores/authStore';

export function useAuth() {
  return useSyncExternalStore(
    subscribeAuthStore,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );
}
