import { router } from 'expo-router';
import { BottomNav } from '@/src/components/common/BottomNav';

type LecturerTab = 'home' | 'chats' | 'courses' | 'tasks';

type Props = {
  active?: LecturerTab;
  unreadCount?: number;
};

export function LecturerBottomNav({ active, unreadCount = 0 }: Props) {
  return (
    <BottomNav
      items={[
        {
          label: 'Home',
          icon: '🏠',
          active: active === 'home',
          onPress: () => router.replace('/(lecturer)/home'),
        },
        {
          label: 'Chats',
          icon: '💬',
          badge: unreadCount,
          active: active === 'chats',
          onPress: () => router.replace('/(lecturer)/chats'),
        },
        {
          label: 'Courses',
          icon: '📚',
          active: active === 'courses',
          onPress: () => router.replace('/(lecturer)/courses'),
        },
        {
          label: 'Course Tools',
          icon: '📝',
          active: active === 'tasks',
          onPress: () => router.replace('/(lecturer)/tasks' as any),
        },
      ]}
    />
  );
}
