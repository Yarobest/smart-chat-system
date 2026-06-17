import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { LecturerBottomNav } from '@/src/components/common/LecturerBottomNav';
import { useLiveThreads } from '@/src/hooks/useLiveThreads';
import { Thread } from '@/src/types/chat.types';

const taskActions = [
  {
    title: 'Create Quiz',
    subtitle: 'Set questions and publish them to a course group.',
    icon: '🧪',
    route: '/(lecturer)/courses/set-quiz',
  },
  {
    title: 'Push Course Note',
    subtitle: 'Share notes or learning material with your students.',
    icon: '📝',
    route: '/(lecturer)/courses/push-note',
  },
  {
    title: 'Review Submissions',
    subtitle: 'Check submitted assignments and give feedback.',
    icon: '📥',
    route: '/(lecturer)/courses/submissions',
  },
  {
    title: 'Post Announcement',
    subtitle: 'Send an official notice to your course group.',
    icon: '📣',
    route: '/(lecturer)/announcements/compose',
  },
];

function isCourseThread(thread: Thread) {
  return thread.type === 'group' && Boolean(thread.courseCode || thread.courseName);
}

export default function LecturerTasksScreen() {
  const { threads, loading, unreadCount } = useLiveThreads();
  const courses = useMemo(() => threads.filter(isCourseThread), [threads]);

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="flex-1 bg-white">
        <View className="bg-[#051839] px-4 pb-5 pt-6">
          <Text className="text-2xl font-extrabold text-white">Tasks</Text>
          <Text className="mt-1 text-sm text-slate-300">
            {loading ? 'Loading course task tools...' : `${courses.length} course groups available`}
          </Text>
        </View>

        <ScrollView
          className="flex-1 bg-[#F5F7FA]"
          contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <Text className="text-base font-extrabold text-slate-900">Course Task Tools</Text>
            <Text className="mt-1 text-sm leading-5 text-slate-500">
              Pick an action below, then choose the course group inside that workflow.
            </Text>
          </View>

          {taskActions.map((action) => (
            <Pressable
              key={action.title}
              onPress={() => router.push(action.route as any)}
              className="flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 py-4"
            >
              <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
                <Text className="text-xl">{action.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-extrabold text-slate-900">{action.title}</Text>
                <Text className="mt-1 text-sm leading-5 text-slate-500">{action.subtitle}</Text>
              </View>
              <Text className="ml-3 text-lg text-slate-300">›</Text>
            </Pressable>
          ))}

          <Text className="mt-2 text-xs font-extrabold tracking-wider text-slate-400">
            MY COURSE GROUPS
          </Text>

          {!loading && courses.length === 0 ? (
            <View className="items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-10">
              <Text className="text-4xl">📚</Text>
              <Text className="mt-3 text-center text-base font-bold text-slate-600">
                No assigned courses yet
              </Text>
            </View>
          ) : null}

          {courses.map((course) => (
            <Pressable
              key={course.id}
              onPress={() => router.push(`/(lecturer)/groups/${course.id}` as any)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
            >
              <Text className="text-base font-extrabold text-slate-900" numberOfLines={2}>
                {course.courseName ?? course.title}
              </Text>
              <Text className="mt-1 text-xs font-semibold text-slate-400">
                {course.courseCode ?? 'Course'} · {course.memberCount ?? 0} members
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <LecturerBottomNav active="tasks" unreadCount={unreadCount} />
      </View>
    </SafeAreaView>
  );
}
