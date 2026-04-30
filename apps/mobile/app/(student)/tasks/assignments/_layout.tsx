import { Stack } from 'expo-router';

export default function AssignmentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="cs205-network" options={{ animationEnabled: true }} />
    </Stack>
  );
}
