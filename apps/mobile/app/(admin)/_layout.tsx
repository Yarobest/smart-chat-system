import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="dashboard/index" />
      <Stack.Screen name="notifications/index" />
      <Stack.Screen name="profile/index" />
      <Stack.Screen name="users/index" />
      <Stack.Screen name="users/[id]" />
      <Stack.Screen name="broadcast/index" />
      <Stack.Screen name="audit/index" />
    </Stack>
  );
}
