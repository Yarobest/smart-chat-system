import { Tabs } from 'expo-router';

export default function LecturerLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home/index" options={{ title: 'Home' }} />
      <Tabs.Screen name="groups/index" options={{ title: 'Groups' }} />
      <Tabs.Screen name="announcements/index" options={{ title: 'Announcements' }} />
      <Tabs.Screen name="profile/index" options={{ title: 'Profile' }} />
      <Tabs.Screen name="groups/[id]" options={{ href: null }} />
      <Tabs.Screen name="announcements/compose" options={{ href: null }} />
    </Tabs>
  );
}
