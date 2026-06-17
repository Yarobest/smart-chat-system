import { Stack } from 'expo-router';

export default function CS301MidSemLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="take" options={{ animation: 'default' }} />
      <Stack.Screen name="results" options={{ animation: 'default' }} />
    </Stack>
  );
}
