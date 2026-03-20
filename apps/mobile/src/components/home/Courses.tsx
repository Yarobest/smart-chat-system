import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { StatusBar } from '@/src/components/common/StatusBar';
import { BottomNav } from '@/src/components/common/BottomNav';

type CourseStatus = 'ACTIVE' | 'EXAM SOON' | 'COMPLETED';
type FilterTab = 'All' | 'In Progress' | 'Completed';

interface Course {
  id: string;
  name: string;
  code: string;
  lecturer: string;
  progress: number;
  status: CourseStatus;
  assignments: number;
  messages: number;
  borderColor: string;
}

const COURSES: Course[] = [
  {
    id: '1',
    name: 'Data Structures & Algorithms',
    code: 'CS301',
    lecturer: 'Mr. G. Agordzo',
    progress: 72,
    status: 'ACTIVE',
    assignments: 4,
    messages: 48,
    borderColor: '#3B82F6', // blue
  },
  {
    id: '2',
    name: 'Computer Networks',
    code: 'CS205',
    lecturer: 'Mr. G. Agordzo',
    progress: 58,
    status: 'ACTIVE',
    assignments: 3,
    messages: 21,
    borderColor: '#22C55E', // green
  },
  {
    id: '3',
    name: 'Software Engineering',
    code: 'CS410',
    lecturer: 'Dr. A. Mensah',
    progress: 45,
    status: 'ACTIVE',
    assignments: 2,
    messages: 15,
    borderColor: '#F59E0B', // amber
  },
  {
    id: '4',
    name: 'Mathematics for CS',
    code: 'CS102',
    lecturer: 'Mr. B. Tetteh',
    progress: 88,
    status: 'EXAM SOON',
    assignments: 5,
    messages: 33,
    borderColor: '#EF4444', // red
  },
  {
    id: '5',
    name: 'Web Development',
    code: 'CS308',
    lecturer: 'Mrs. A. Boateng',
    progress: 100,
    status: 'COMPLETED',
    assignments: 6,
    messages: 52,
    borderColor: '#8B5CF6', // purple
  },
];

function getStatusStyle(status: CourseStatus): { bg: string; text: string } {
  switch (status) {
    case 'ACTIVE':
      return { bg: '#EFF6FF', text: '#3B82F6' };
    case 'EXAM SOON':
      return { bg: '#FFF1F2', text: '#EF4444' };
    case 'COMPLETED':
      return { bg: '#F0FDF4', text: '#22C55E' };
  }
}

export default function MyCoursesScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

  const filteredCourses = COURSES.filter((course) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'In Progress') return course.status === 'ACTIVE' || course.status === 'EXAM SOON';
    if (activeFilter === 'Completed') return course.status === 'COMPLETED';
    return true;
  });

  const filters: FilterTab[] = ['All', 'In Progress', 'Completed'];

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="flex-1 bg-white">

        {/* Header */}
        <View className="bg-white px-4 pb-3 pt-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => router.back()}
                className="mr-1 h-8 w-8 items-center justify-center rounded-full"
              >
                <Text className="text-xl text-slate-700">‹</Text>
              </Pressable>
              <View>
                <Text className="text-xl font-extrabold text-slate-900">My Courses</Text>
                <Text className="text-xs text-slate-400">HND Year 2 · 2024/2025</Text>
              </View>
            </View>
            <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-slate-100">
              <Text className="text-base">🔍</Text>
            </Pressable>
          </View>

          {/* Filter Tabs */}
          <View className="mt-4 flex-row gap-2">
            {filters.map((filter) => (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-1.5 ${
                  activeFilter === filter
                    ? 'bg-blue-600'
                    : 'bg-slate-100'
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    activeFilter === filter ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {filter}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Course List */}
        <ScrollView
          className="flex-1 bg-[#F5F7FA]"
          contentContainerStyle={{ padding: 16, paddingBottom: 12, gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {filteredCourses.length === 0 ? (
            <View className="mt-20 items-center justify-center">
              <Text className="text-4xl">📭</Text>
              <Text className="mt-3 text-base font-semibold text-slate-400">No courses found</Text>
            </View>
          ) : (
            filteredCourses.map((course) => {
              const statusStyle = getStatusStyle(course.status);
              return (
                <View
                  key={course.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  style={{ borderLeftWidth: 4, borderLeftColor: course.borderColor }}
                >
                  <View className="px-4 pt-4">
                    {/* Top row: name + status badge */}
                    <View className="flex-row items-start justify-between gap-2">
                      <Text className="flex-1 text-base font-extrabold text-slate-900">
                        {course.name}
                      </Text>
                      <View
                        className="rounded-md px-2.5 py-1"
                        style={{ backgroundColor: statusStyle.bg }}
                      >
                        <Text
                          className="text-xs font-bold"
                          style={{ color: statusStyle.text }}
                        >
                          {course.status}
                        </Text>
                      </View>
                    </View>

                    {/* Code + Lecturer */}
                    <Text className="mt-0.5 text-xs text-slate-400">
                      {course.code} · {course.lecturer}
                    </Text>

                    {/* Progress bar */}
                    <View className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${course.progress}%`,
                          backgroundColor: course.borderColor,
                        }}
                      />
                    </View>

                    {/* Progress % + Open Chat */}
                    <View className="mt-1.5 flex-row items-center justify-between">
                      <Text className="text-xs text-slate-400">{course.progress}% complete</Text>
                      <Pressable>
                        <Text className="text-xs font-semibold" style={{ color: course.borderColor }}>
                          Open Chat →
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  {/* Footer: assignments + messages */}
                  <View className="mt-3 flex-row items-center gap-4 border-t border-slate-100 px-4 py-3">
                    <View className="flex-row items-center gap-1">
                      <Text className="text-xs">📋</Text>
                      <Text className="text-xs text-slate-500">Assign. {course.assignments}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-xs">💬</Text>
                      <Text className="text-xs text-slate-500">{course.messages} msgs</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        <BottomNav
          items={[
            { label: 'Home', icon: '🏠', onPress: () => router.replace('/(student)/home') },
            { label: 'Chats', icon: '💬', badge: 12, onPress: () => router.replace('/(student)/chats') },
            { label: 'Notices', icon: '📢', onPress: () => router.replace('/(student)/announcements') },
            { label: 'Profile', icon: '👤', active: true, onPress: () => router.replace('/(student)/profile') },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}
