import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { roleGuard } from '@/src/utils/roleGuard';

export default function StudentLayout() {
  const { role } = useAuth();

  if (role && role !== 'student') {
    return <Redirect href={roleGuard(role) as any} />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
      <Tabs.Screen name="home/index" options={{ title: 'Home' }} />
      <Tabs.Screen name="chats" options={{ title: 'Chats', href: null }} />
      <Tabs.Screen name="courses/index" options={{ title: 'Courses', href: null }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tasks', href: null }} />
      <Tabs.Screen name="announcements/index" options={{ title: 'Announcements' }} />
      <Tabs.Screen name="profile/index" options={{ title: 'Profile' }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="settings/index" options={{ href: null }} />
      <Tabs.Screen name="chats/[id]" options={{ href: null }} />
      <Tabs.Screen name="chats/new" options={{ href: null }} />
      <Tabs.Screen name="chats/group/[id]" options={{ href: null }} />
      <Tabs.Screen name="announcements/[id]" options={{ href: null }} />
    </Tabs>
  );
}
