import { View } from 'react-native';
import { StatCard } from './StatCard';

export function StatsRow({ unreadCount }: { unreadCount: number }) {
  return (
    <View className="mt-6 flex-row gap-3">
      <StatCard value="5" label="Courses" />
      <StatCard value={String(unreadCount)} label="Unread" />
      <StatCard value="3" label="Alerts" />
    </View>
  );
}
