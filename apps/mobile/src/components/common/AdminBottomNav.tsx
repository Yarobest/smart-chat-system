import { router } from 'expo-router';
import { BottomNav } from '@/src/components/common/BottomNav';

type AdminTab = 'home' | 'users' | 'courses' | 'analytics' | 'broadcast';

export function AdminBottomNav({ active }: { active: AdminTab }) {
  return (
    <BottomNav
      items={[
        { label: 'Home', icon: '🏠', active: active === 'home', onPress: () => router.replace('/(admin)/dashboard') },
        { label: 'Users', icon: '👥', active: active === 'users', onPress: () => router.replace('/(admin)/users') },
        { label: 'Courses', icon: '📚', active: active === 'courses', onPress: () => router.replace('/(admin)/courses' as never) },
        { label: 'Analytics', icon: '📈', active: active === 'analytics', onPress: () => router.replace('/(admin)/analytics/reports-and-analytics') },
        { label: 'Broadcast', icon: '📣', active: active === 'broadcast', onPress: () => router.replace('/(admin)/broadcast/broad-cast') },
      ]}
    />
  );
}
