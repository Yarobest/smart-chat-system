import { Tabs } from 'expo-router';

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard/index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="users/index" options={{ title: 'Users' }} />
      <Tabs.Screen name="broadcast/index" options={{ title: 'Broadcast' }} />
      <Tabs.Screen name="audit/index" options={{ title: 'Logs' }} />
    </Tabs>
  );
}
