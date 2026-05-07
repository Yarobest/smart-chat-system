import { View } from 'react-native';
import { StatCard } from './StatCard';

export function StatsRow({ unreadCount }: { unreadCount: number }) {
  return (
    <View className="mt-6 flex-row">
      <View className="mr-3 flex-1">
        <StatCard value="5" label="Courses" />
      </View>
      <View className="mr-3 flex-1">
        <StatCard value={String(unreadCount)} label="Unread" />
      </View>
      <StatCard value="3" label="Alerts" />
    </View>
  );
}
