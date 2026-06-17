import { Stack } from 'expo-router';

export default function NotesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="cs410-design-patterns" options={{ animation: 'default' }} />
      <Stack.Screen name="cs301-avl-trees" options={{ animation: 'default' }} />
    </Stack>
  );
}
