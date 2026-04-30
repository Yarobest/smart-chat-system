import { Stack } from 'expo-router';

export default function ChatsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" options={{ animationEnabled: true }} />
      <Stack.Screen name="group/[id]" options={{ animationEnabled: true }} />
    </Stack>
  );
}
