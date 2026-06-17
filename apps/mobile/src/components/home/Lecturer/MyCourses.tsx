import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { BottomNav } from '@/src/components/common/BottomNav';

type CourseStatus = 'ACTIVE' | 'QUIET';

interface Course {
  id: string;
  name: string;
  code: string;
  year: string;
  students: number;
  messages: number;
  status: CourseStatus;
  borderColor: string;
}

const COURSES: Course[] = [
  {
    id: '1',
    name: 'Data Structures & Algorithms',
    code: 'CS301',
    year: 'HND Yr2',
    students: 32,
    messages: 48,
    status: 'ACTIVE',
    borderColor: '#3B82F6',
  },
  {
    id: '2',
    name: 'Computer Networks',
    code: 'CS205',
    year: 'HND Yr2',
    students: 28,
    messages: 21,
    status: 'ACTIVE',
    borderColor: '#22C55E',
  },
  {
    id: '3',
    name: 'Software Engineering',
    code: 'CS410',
    year: 'HND Yr2',
    students: 30,
    messages: 15,
    status: 'QUIET',
    borderColor: '#F59E0B',
  },
];

function getStatusStyle(status: CourseStatus) {
  if (status === 'ACTIVE') {
    return { bg: '#ECFDF5', text: '#15803D' };
  }

  return { bg: '#FEF3C7', text: '#B45309' };
}

export default function LecturerMyCoursesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="bg-[#051839] px-4 pb-5 pt-6">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-3">
          <Text className="text-2xl text-white">‹</Text>
          <View>
            <Text className="text-2xl font-extrabold text-white">My Courses</Text>
            <Text className="text-sm text-slate-300">Lecturer · {COURSES.length} courses</Text>
          </View>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 bg-[#F5F7FA]"
        contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {COURSES.map((course) => {
          const statusStyle = getStatusStyle(course.status);

          return (
            <View
              key={course.id}
              className="rounded-[28px] border border-slate-200 bg-white px-5 py-4"
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
                elevation: 3,
              }}
            >
              <View className="h-1 rounded-t-[28px]" style={{ backgroundColor: course.borderColor }} />

              <View className="mt-3 flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-base font-extrabold text-slate-900">{course.name}</Text>
                  <Text className="mt-1 text-xs text-slate-400">
                    {course.code} · {course.year}
                  </Text>
                </View>

                <View
                  className="rounded-full px-3 py-1"
                  style={{ backgroundColor: statusStyle.bg }}
                >
                  <Text className="text-[10px] font-bold" style={{ color: statusStyle.text }}>
                    {course.status}
                  </Text>
                </View>
              </View>

              <View className="mt-4 flex-row items-center justify-between gap-4">
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm">👥</Text>
                  <Text className="text-sm font-semibold text-slate-500">{course.students} students</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm">💬</Text>
                  <Text className="text-sm font-semibold text-slate-500">
                    {course.messages} msgs
                  </Text>
                </View>
              </View>

              <View className="mt-4 flex-row flex-wrap gap-2">
                <Pressable
                  onPress={() => router.push('/(lecturer)/chats')}
                  className="min-w-[30%] items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-2 py-2"
                >
                  <Text className="text-[10px] font-semibold text-slate-700 text-center">Open Chat</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/(lecturer)/announcements/compose')}
                  className="min-w-[30%] items-center justify-center rounded-full bg-amber-100 px-2 py-2"
                >
                  <Text className="text-[10px] font-semibold text-amber-700 text-center">Announce</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/(lecturer)/courses/set-quiz')}
                  className="min-w-[30%] items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-2 py-2"
                >
                  <Text className="text-[10px] font-semibold text-slate-700 text-center">Set Quiz</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/(lecturer)/courses/push-note')}
                  className="min-w-[30%] items-center justify-center rounded-full bg-slate-100 px-2 py-2"
                >
                  <Text className="text-[10px] font-semibold text-slate-700 text-center">Push Note</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/(lecturer)/courses/submissions')}
                  className="min-w-[30%] items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-2 py-2"
                >
                  <Text className="text-[10px] font-semibold text-slate-700 text-center">Submissions</Text>
                </Pressable>
              </View>

              <View className="mt-4 flex-row flex-wrap gap-2">
                <Pressable
                  onPress={() => router.push('/(lecturer)/courses/set-quiz')}
                  className="min-w-[30%] items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-2 py-2"
                >
                  <Text className="text-[10px] font-semibold text-slate-700 text-center">Set Quiz</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/(lecturer)/courses/upload-notes')}
                  className="min-w-[30%] items-center justify-center rounded-full bg-slate-100 px-2 py-2"
                >
                  <Text className="text-[10px] font-semibold text-slate-700 text-center">Upload Notes</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/(lecturer)/courses/submissions')}
                  className="min-w-[30%] items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-2 py-2"
                >
                  <Text className="text-[10px] font-semibold text-slate-700 text-center">Submissions</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <BottomNav
        items={[
          { label: 'Home', icon: '🏠', onPress: () => router.replace('/(lecturer)/home') },
          { label: 'Chats', icon: '💬', onPress: () => router.replace('/(lecturer)/chats') },
          { label: 'Notices', icon: '📢', onPress: () => router.replace('/(lecturer)/announcements') },
          { label: 'Profile', icon: '👤', onPress: () => router.replace('/(lecturer)/profile') },
        ]}
      />
    </SafeAreaView>
  );
}
