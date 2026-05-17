import { Stack } from 'expo-router';

export default function CS301MidSemLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="take" options={{ animationEnabled: true }} />
      <Stack.Screen name="results" options={{ animationEnabled: true }} />
    </Stack>
  );
}
