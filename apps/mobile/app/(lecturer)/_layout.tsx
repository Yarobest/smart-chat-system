import { Redirect, Stack } from "expo-router";
import { useAuth } from '@/src/hooks/useAuth';
import { roleGuard } from '@/src/utils/roleGuard';

export default function LecturerLayout() {
  const { role } = useAuth();

  if (role && role !== 'lecturer') {
    return <Redirect href={roleGuard(role) as any} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="home/index"  options={{ title: 'Home' }}/>
      <Stack.Screen name="chats/index" options={{ title: 'Chats' }}/>
      <Stack.Screen name="chats/new" options={{ title: 'New Chat' }}/>
      <Stack.Screen name="chats/[id]" options={{ title: 'Chat' }}/>
      <Stack.Screen name="announcements/index" options={{ title: 'Announcements' }}/>
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }}/>
      <Stack.Screen name="profile/index" options={{ title: 'Profile' }}/>
      <Stack.Screen name="courses/index" options={{ title: 'My Courses' }} />
      <Stack.Screen name="tasks/index" options={{ title: 'Tasks' }} />
      <Stack.Screen name="courses/set-quiz" options={{ title: 'Set Quiz' }} />
      <Stack.Screen name="courses/add-questions/index" options={{ title: 'Add Questions' }} />
      <Stack.Screen name="courses/submissions" options={{ title: 'Submissions' }} />
      <Stack.Screen name="courses/push-note" options={{ title: 'Push Note' }} />
      <Stack.Screen name="courses/upload-notes" options={{ title: 'Upload Notes' }} />
      <Stack.Screen name="settings/index" options={{ title: 'Settings' }} />
      <Stack.Screen name="groups/index" />
      <Stack.Screen name="groups/[id]" />
      <Stack.Screen name="announcements/compose" />
    </Stack>
  );
}
