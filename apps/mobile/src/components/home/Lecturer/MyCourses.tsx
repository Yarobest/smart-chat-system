import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { LecturerBottomNav } from '@/src/components/common/LecturerBottomNav';
import { useLiveThreads } from '@/src/hooks/useLiveThreads';
import { Thread } from '@/src/types/chat.types';

const colors = ['#2563EB', '#16A34A', '#D97706', '#7C3AED', '#DC2626'];

function isCourseThread(thread: Thread) {
  return thread.type === 'group' && Boolean(thread.courseCode || thread.courseName);
}

function academicLine(thread: Thread) {
  return [thread.awardType, thread.programme, thread.yearGroup]
    .filter(Boolean)
    .join(' · ');
}

export default function LecturerMyCoursesScreen() {
  const { threads, loading, unreadCount } = useLiveThreads();
  const courses = useMemo(() => threads.filter(isCourseThread), [threads]);

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="flex-1 bg-white">
        <View className="bg-[#051839] px-4 pb-5 pt-6">
          <Text className="text-2xl font-extrabold text-white">My Courses</Text>
          <Text className="mt-1 text-sm text-slate-300">
            {loading ? 'Loading assigned courses...' : `Lecturer · ${courses.length} active course groups`}
          </Text>
        </View>

        <ScrollView
          className="flex-1 bg-[#F5F7FA]"
          contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {!loading && courses.length === 0 ? (
            <View className="mt-20 items-center justify-center px-6">
              <Text className="text-4xl">📚</Text>
              <Text className="mt-3 text-center text-base font-bold text-slate-600">
                No assigned courses yet
              </Text>
              <Text className="mt-1 text-center text-sm leading-5 text-slate-500">
                Courses appear here after the admin assigns you as lecturer in charge.
              </Text>
            </View>
          ) : null}

          {courses.map((course, index) => {
            const accent = colors[index % colors.length];

            return (
              <View
                key={course.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                style={{ borderLeftWidth: 4, borderLeftColor: accent }}
              >
                <View className="px-4 pt-4">
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-base font-extrabold text-slate-900" numberOfLines={2}>
                        {course.courseName ?? course.title}
                      </Text>
                      <Text className="mt-1 text-xs font-semibold text-slate-400">
                        {course.courseCode ?? 'Course'} · {academicLine(course) || course.department || 'Assigned group'}
                      </Text>
                    </View>

                    <View className="rounded-md bg-emerald-50 px-2.5 py-1">
                      <Text className="text-xs font-bold text-emerald-600">ACTIVE</Text>
                    </View>
                  </View>

                  <View className="mt-4 flex-row flex-wrap gap-4">
                    <Text className="text-xs font-semibold text-slate-500">
                      👥 {course.memberCount ?? 0} members
                    </Text>
                    <Text className="text-xs font-semibold text-slate-500">
                      💬 {course.unreadCount} unread
                    </Text>
                  </View>
                </View>

                <View className="mt-4 flex-row flex-wrap gap-2 border-t border-slate-100 px-4 py-3">
                  <Pressable
                    onPress={() => router.push(`/(lecturer)/groups/${course.id}` as any)}
                    className="min-w-[30%] items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <Text className="text-xs font-bold text-slate-700">Open Chat</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => router.push('/(lecturer)/announcements/compose' as any)}
                    className="min-w-[30%] items-center rounded-full bg-amber-100 px-3 py-2"
                  >
                    <Text className="text-xs font-bold text-amber-700">Announce</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => router.push('/(lecturer)/tasks' as any)}
                    className="min-w-[30%] items-center rounded-full bg-blue-50 px-3 py-2"
                  >
                    <Text className="text-xs font-bold text-blue-700">Tasks</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <LecturerBottomNav active="courses" unreadCount={unreadCount} />
      </View>
    </SafeAreaView>
  );
}
