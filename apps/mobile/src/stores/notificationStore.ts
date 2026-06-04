export type AppNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export const notificationStore = {
  items: [] as AppNotification[],
  get unreadCount() {
    return this.items.filter((item) => !item.read).length;
  },
};

const listeners = new Set<() => void>();
let snapshot = {
  items: notificationStore.items,
  unreadCount: notificationStore.unreadCount,
};

export function addNotification(title: string, body: string) {
  notificationStore.items = [
    {
      id: `${Date.now()}-${Math.random()}`,
      title,
      body,
      createdAt: new Date().toISOString(),
      read: false,
    },
    ...notificationStore.items,
  ];
  snapshot = {
    items: notificationStore.items,
    unreadCount: notificationStore.unreadCount,
  };
  listeners.forEach((listener) => listener());
}

export function markNotificationsRead() {
  notificationStore.items = notificationStore.items.map((item) => ({
    ...item,
    read: true,
  }));
  snapshot = {
    items: notificationStore.items,
    unreadCount: notificationStore.unreadCount,
  };
  listeners.forEach((listener) => listener());
}

export function subscribeNotifications(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getNotificationSnapshot() {
  return snapshot;
}
