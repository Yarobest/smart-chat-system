import { Stack } from "expo-router";

export default function LecturerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="/(lecturer)/lecturer/home/index"  options={{ title: 'Home' }}/>
      <Stack.Screen name="/(lecturer)/lecturer/chats/index" options={{ title: 'Chats' }}/>
      <Stack.Screen name="/(lecturer)/lecturer/announcements/index" options={{ title: 'Announcements' }}/>
      <Stack.Screen name="/(lecturer)/lecturer/profile/index" options={{ title: 'Profile' }}/>
      <Stack.Screen name="/(lecturer)/lecturer/groups/index" />
      <Stack.Screen name="/(lecturer)/lecturer/groups/[id]" />
      <Stack.Screen name="announcements/compose" />
    </Stack>
  );
}