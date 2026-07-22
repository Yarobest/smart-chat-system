import { useEffect, useSyncExternalStore } from 'react';
import {
  getNotificationSnapshot,
  subscribeNotifications,
  setNotifications,
} from '@/src/stores/notificationStore';
import { notificationService } from '@/src/services/notification.service';

const serverSnapshot = {
  items: [],
  unreadCount: 0,
};

export function useNotifications() {
  useEffect(() => {
    const load = () => notificationService.list().then(setNotifications).catch(() => undefined);
    void load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);
  return useSyncExternalStore(
    subscribeNotifications,
    getNotificationSnapshot,
    () => serverSnapshot,
  );
}
