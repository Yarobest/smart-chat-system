import { Stack } from 'expo-router';

export default function TasksLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="notes" />
      <Stack.Screen name="assignments" />
      <Stack.Screen name="quizzes" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="assignment" />
      <Stack.Screen name="midsem" />
      <Stack.Screen name="takehome" />
    </Stack>
  );
}
