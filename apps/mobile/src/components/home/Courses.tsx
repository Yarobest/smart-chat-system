import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { StudentBottomNav } from '@/src/components/common/StudentBottomNav';
import { FilterRow } from '@/src/components/common/FilterRow';
import { PageHeader } from '@/src/components/common/PageHeader';
import { useLiveThreads } from '@/src/hooks/useLiveThreads';
import { Thread } from '@/src/types/chat.types';

type FilterTab = 'All' | 'Active' | 'Unread';

const colors = ['#2563EB', '#16A34A', '#D97706', '#7C3AED', '#DC2626'];

function isCourseThread(thread: Thread) {
  return thread.type === 'group' && Boolean(thread.courseCode || thread.courseName);
}

function courseTitle(thread: Thread) {
  return thread.courseName ?? thread.title;
}

function courseCode(thread: Thread) {
  return thread.courseCode ?? 'Course';
}

function lecturerName(thread: Thread) {
  return (
    thread.members?.find((member) => member.user.role === 'lecturer')?.user.name ??
    'Lecturer not assigned'
  );
}

function academicLine(thread: Thread) {
  return [thread.awardType, thread.programme, thread.yearGroup]
    .filter(Boolean)
    .join(' · ');
}

export default function MyCoursesScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const { threads, loading, unreadCount } = useLiveThreads();

  const courses = useMemo(
    () => threads.filter(isCourseThread),
    [threads],
  );

  const filteredCourses = useMemo(() => {
    if (activeFilter === 'Unread') {
      return courses.filter((course) => course.unreadCount > 0);
    }

    return courses;
  }, [activeFilter, courses]);

  const filters: FilterTab[] = ['All', 'Active', 'Unread'];

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="flex-1 bg-white">
        <PageHeader
          title="My Courses"
          subtitle={loading ? 'Loading assigned courses...' : `${courses.length} active course groups`}
        />
        <FilterRow filters={filters} active={activeFilter} onSelect={setActiveFilter} />

        <ScrollView
          className="flex-1 bg-[#F5F7FA]"
          contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {!loading && filteredCourses.length === 0 ? (
            <View className="mt-20 items-center justify-center px-6">
              <Text className="text-4xl">📚</Text>
              <Text className="mt-3 text-center text-base font-bold text-slate-600">
                No course groups found
              </Text>
              <Text className="mt-1 text-center text-sm leading-5 text-slate-500">
                Your courses appear here after an admin assigns courses to your programme and level.
              </Text>
            </View>
          ) : null}

          {filteredCourses.map((course, index) => {
            const accent = colors[index % colors.length];

            return (
              <View
                key={course.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                style={{ borderLeftWidth: 4, borderLeftColor: accent }}
              >
                <View className={`px-4 pt-4 ${course.lastMessage ? '' : 'pb-4'}`}>
                  <View className="flex-row items-start justify-between gap-2">
                    <View className="flex-1">
                      <Text className="text-base font-extrabold text-slate-900" numberOfLines={2}>
                        {courseTitle(course)}
                      </Text>
                      <Text className="mt-1 text-xs font-semibold text-slate-400">
                        {courseCode(course)} · {lecturerName(course)}
                      </Text>
                    </View>

                    <View className="rounded-md bg-blue-50 px-2.5 py-1">
                      <Text className="text-xs font-bold text-blue-600">ACTIVE</Text>
                    </View>
                  </View>

                  <Text className="mt-3 text-sm leading-5 text-slate-500" numberOfLines={2}>
                    {academicLine(course) || course.department || 'Assigned course group'}
                  </Text>

                  <View className="mt-4 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-4">
                      <Text className="text-xs font-semibold text-slate-500">
                        👥 {course.memberCount ?? 0} members
                      </Text>
                      <Text className="text-xs font-semibold text-slate-500">
                        💬 {course.unreadCount} unread
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => router.push(`/(student)/chats/group/${course.id}` as any)}
                    >
                      <Text className="text-xs font-bold" style={{ color: accent }}>
                        Open Chat →
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {course.lastMessage ? (
                  <View className="mt-4 border-t border-slate-100 px-4 py-3">
                    <Text className="text-xs font-bold text-slate-400">LATEST ACTIVITY</Text>
                    <Text className="mt-1 text-sm text-slate-600" numberOfLines={1}>
                      Anonymous: {course.lastMessage.text || 'Attachment'}
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </ScrollView>

        <StudentBottomNav active="courses" unreadCount={unreadCount} />
      </View>
    </SafeAreaView>
  );
}
