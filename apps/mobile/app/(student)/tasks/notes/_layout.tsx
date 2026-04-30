import { Stack } from 'expo-router';

export default function NotesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="cs410-design-patterns" options={{ animationEnabled: true }} />
      <Stack.Screen name="cs301-avl-trees" options={{ animationEnabled: true }} />
    </Stack>
  );
}
