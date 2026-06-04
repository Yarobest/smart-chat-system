import { useSyncExternalStore } from 'react';
import {
  getNotificationSnapshot,
  subscribeNotifications,
} from '@/src/stores/notificationStore';

const serverSnapshot = {
  items: [],
  unreadCount: 0,
};

export function useNotifications() {
  return useSyncExternalStore(
    subscribeNotifications,
    getNotificationSnapshot,
    () => serverSnapshot,
  );
}
