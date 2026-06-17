import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="dashboard/index" />
      <Stack.Screen name="notifications/index" />
      <Stack.Screen name="profile/index" />
      <Stack.Screen name="users/index" />
      <Stack.Screen name="users/[id]" />
      <Stack.Screen name="courses/index" />
      <Stack.Screen name="broadcast/index" />
      <Stack.Screen name="broadcast/broad-cast" />
      <Stack.Screen name="broadcast/broad-cast-history" />
      <Stack.Screen name="analytics/reports-and-analytics" />
      <Stack.Screen name="analytics/audith-log-screen" />
      <Stack.Screen name="analytics/course-overview" />
      <Stack.Screen name="analytics/department-screen" />
      <Stack.Screen name="analytics/user-growth-report" />
      <Stack.Screen name="dashboard/live-activity" />
      <Stack.Screen name="dashboard/security-center" />
      <Stack.Screen name="dashboard/system-health" />
      <Stack.Screen name="dashboard/user-presence" />
    </Stack>
  );
}
