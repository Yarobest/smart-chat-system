import { Stack } from 'expo-router';

export default function TakeQuizLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="final" options={{ animation: 'default' }} />
    </Stack>
  );
}
