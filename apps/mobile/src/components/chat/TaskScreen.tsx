import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { StudentBottomNav } from '@/src/components/common/StudentBottomNav';
import { useLiveThreads } from '@/src/hooks/useLiveThreads';
import { Thread } from '@/src/types/chat.types';

type TaskFilter = 'All' | 'Assignments' | 'Quizzes' | 'Notes';

const filters: TaskFilter[] = ['All', 'Assignments', 'Quizzes', 'Notes'];

function isCourseThread(thread: Thread) {
  return thread.type === 'group' && Boolean(thread.courseCode || thread.courseName);
}

function getCourseLabel(thread: Thread) {
  return `${thread.courseCode ?? 'Course'} · ${thread.courseName ?? thread.title}`;
}

export default function TaskScreen() {
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('All');
  const { threads, loading, unreadCount } = useLiveThreads();

  const courses = useMemo(() => threads.filter(isCourseThread), [threads]);

  const visibleCards = useMemo(() => {
    if (activeFilter === 'All') {
      return courses.flatMap((course) => [
        { type: 'Assignments' as TaskFilter, course },
        { type: 'Quizzes' as TaskFilter, course },
        { type: 'Notes' as TaskFilter, course },
      ]);
    }

    return courses.map((course) => ({ type: activeFilter, course }));
  }, [activeFilter, courses]);

  const openTaskArea = (type: TaskFilter, course: Thread) => {
    if (type === 'Assignments') {
      router.push('/(student)/tasks/assignments' as any);
      return;
    }

    if (type === 'Quizzes') {
      router.push('/(student)/tasks/quizzes' as any);
      return;
    }

    if (type === 'Notes') {
      router.push('/(student)/tasks/notes' as any);
      return;
    }

    router.push(`/(student)/chats/group/${course.id}` as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />

      <View className="bg-[#051839] px-4 pb-5 pt-6">
        <Text className="text-2xl font-extrabold text-white">Tasks</Text>
        <Text className="mt-1 text-sm text-slate-300">
          Assignments, quizzes and notes from your course groups
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          contentContainerStyle={{ gap: 8, paddingRight: 8 }}
        >
          {filters.map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-1.5 ${
                activeFilter === filter ? 'bg-blue-600' : 'bg-white/10'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  activeFilter === filter ? 'text-white' : 'text-slate-300'
                }`}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 bg-[#F5F7FA]"
        contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {!loading && courses.length === 0 ? (
          <View className="mt-20 items-center justify-center px-6">
            <Text className="text-4xl">📝</Text>
            <Text className="mt-3 text-center text-base font-bold text-slate-600">
              No course tasks yet
            </Text>
            <Text className="mt-1 text-center text-sm leading-5 text-slate-500">
              Tasks will appear after you are added to assigned course groups.
            </Text>
          </View>
        ) : null}

        {visibleCards.map(({ type, course }) => {
          const icon = type === 'Assignments' ? '📋' : type === 'Quizzes' ? '🧪' : '📘';
          const tone =
            type === 'Assignments'
              ? { bg: '#EFF6FF', text: '#2563EB' }
              : type === 'Quizzes'
                ? { bg: '#FEF3C7', text: '#B45309' }
                : { bg: '#ECFDF5', text: '#15803D' };

          return (
            <Pressable
              key={`${course.id}-${type}`}
              onPress={() => openTaskArea(type, course)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
            >
              <View className="flex-row items-start">
                <View
                  className="mr-3 h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: tone.bg }}
                >
                  <Text className="text-xl">{icon}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-start justify-between gap-2">
                    <Text className="flex-1 text-base font-extrabold text-slate-900">
                      {type}
                    </Text>
                    <View className="rounded-md px-2.5 py-1" style={{ backgroundColor: tone.bg }}>
                      <Text className="text-xs font-bold" style={{ color: tone.text }}>
                        LIVE
                      </Text>
                    </View>
                  </View>
                  <Text className="mt-1 text-sm font-semibold text-slate-500" numberOfLines={2}>
                    {getCourseLabel(course)}
                  </Text>
                  <Text className="mt-2 text-sm leading-5 text-slate-500">
                    Open this course area to view published {type.toLowerCase()} or continue in the course group chat.
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <StudentBottomNav active="tasks" unreadCount={unreadCount} />
    </SafeAreaView>
  );
}
