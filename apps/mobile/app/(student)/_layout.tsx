import { Tabs } from 'expo-router';

export default function StudentLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
      <Tabs.Screen name="home/index" options={{ title: 'Home' }} />
      <Tabs.Screen name="chats" options={{ title: 'Chats', href: null }} />
      <Tabs.Screen name="announcements/index" options={{ title: 'Announcements' }} />
      <Tabs.Screen name="profile/index" options={{ title: 'Profile' }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tasks', href: null }} />
    </Tabs>
  );
}
