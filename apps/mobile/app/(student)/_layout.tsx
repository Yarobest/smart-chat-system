import { Tabs } from 'expo-router';

export default function StudentLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
      <Tabs.Screen name="home/index" options={{ title: 'Home' }} />
      <Tabs.Screen name="chats" options={{ title: 'Chats', href: null }} />
      <Tabs.Screen name="announcements/index" options={{ title: 'Announcements' }} />
      <Tabs.Screen name="profile/index" options={{ title: 'Profile' }} />
      <Tabs.Screen name="settings/index" options={{ href: null }} />
      <Tabs.Screen name="chats/[id]" options={{ href: null }} />
      <Tabs.Screen name="chats/group/[id]" options={{ href: null }} />
      <Tabs.Screen name="announcements/[id]" options={{ href: null }} />
    </Tabs>
  );
}
