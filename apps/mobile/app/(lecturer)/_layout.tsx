import { Stack } from "expo-router";

export default function LecturerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="home/index"  options={{ title: 'Home' }}/>
      <Stack.Screen name="chats/index" options={{ title: 'Chats' }}/>
      <Stack.Screen name="announcements/index" options={{ title: 'Announcements' }}/>
      <Stack.Screen name="profile/index" options={{ title: 'Profile' }}/>
      <Stack.Screen name="groups/index" />
      <Stack.Screen name="groups/[id]" />
      <Stack.Screen name="announcements/compose" />
    </Stack>
  );
}