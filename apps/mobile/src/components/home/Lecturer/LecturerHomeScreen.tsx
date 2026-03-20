import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { BottomNav } from '@/src/components/common/BottomNav';

const COURSE_GROUPS = [
  {
    id: '1',
    code: 'CS301',
    name: 'Data Structures',
    students: 32,
    messages: 'No messages yet',
    icon: '📚',
    iconBg: '#EEF2FF',
  },
  {
    id: '2',
    code: 'CS205',
    name: 'Networking',
    students: 28,
    messages: 'No messages yet',
    icon: '🛰️',
    iconBg: '#F0FDF4',
  },
  {
    id: '3',
    code: 'CS410',
    name: 'Software Engineering',
    students: 30,
    messages: 'No messages yet',
    icon: '🧑‍💻',
    iconBg: '#FFF7ED',
  },
];

export default function LecturerHomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="flex-1 bg-[#051839]">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Top Header ── */}
          <View className="px-4 pb-6 pt-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-slate-300">Good Morning 👋</Text>
                <Text className="text-2xl font-extrabold text-white">Mr. G. Agordzo</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Text className="text-lg">🔔</Text>
                </Pressable>
                <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-500">
                  <Text className="text-sm font-bold text-white">GA</Text>
                </View>
              </View>
            </View>

            {/* Stats Row */}
            <View className="mt-5 flex-row gap-3">
              {[
                { label: 'Courses', value: '3', valueColor: '#FBBF24' },
                { label: 'Students', value: '90', valueColor: '#FBBF24' },
                { label: 'Unread', value: '0', valueColor: '#FBBF24' },
              ].map((stat) => (
                <View
                  key={stat.label}
                  className="flex-1 items-start rounded-2xl bg-white/10 px-4 py-4"
                >
                  <Text className="text-2xl font-extrabold" style={{ color: stat.valueColor }}>
                    {stat.value}
                  </Text>
                  <Text className="mt-0.5 text-xs text-slate-400">{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── White Body ── */}
          <View className="flex-1 rounded-t-3xl bg-white px-4 pt-5">

            {/* Welcome Banner */}
            <View className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
              <Text className="mb-1 text-base font-extrabold text-amber-700">
                🎒 Welcome, Mr. Agordzo!
              </Text>
              <Text className="mb-4 text-sm leading-5 text-amber-600">
                You have 3 courses and 90 students. Start by posting your first announcement or opening a course group chat.
              </Text>
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => router.push('/(lecturer)/announcements')}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-amber-500 py-3"
                >
                  <Text className="text-sm font-bold text-white">📣  Post Announcement</Text>
                </Pressable>
                <Pressable
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3"
                >
                  <Text className="text-sm font-bold text-slate-700">📚  My Courses</Text>
                </Pressable>
              </View>
            </View>

            {/* My Course Groups */}
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-base font-extrabold text-slate-900">My Course Groups</Text>
              <Pressable>
                <Text className="text-sm font-semibold text-blue-600">See All</Text>
              </Pressable>
            </View>

            {COURSE_GROUPS.map((course) => (
              <View
                key={course.id}
                className="mb-3 flex-row items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-4"
                style={{
                  shadowColor: '#000',
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: course.iconBg }}
                  >
                    <Text className="text-2xl">{course.icon}</Text>
                  </View>
                  <View>
                    <Text className="text-sm font-extrabold text-slate-900">
                      {course.code} · {course.name}
                    </Text>
                    <Text className="text-xs text-slate-400">
                      {course.students} students · {course.messages}
                    </Text>
                  </View>
                </View>

                <Pressable className="rounded-xl bg-blue-600 px-4 py-2">
                  <Text className="text-xs font-bold text-white">Open</Text>
                </Pressable>
              </View>
            ))}

            {/* ── Recent Messages ── */}
            <View className="mb-3 mt-2 flex-row items-center justify-between">
              <Text className="text-base font-extrabold text-slate-900">Recent Messages</Text>
            </View>

            {/* Empty State */}
            <View className="mb-6 items-center justify-center py-10">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Text className="text-3xl">✉️</Text>
              </View>
              <Text className="text-base font-bold text-slate-700">No messages yet</Text>
              <Text className="mt-1 text-center text-sm text-slate-400">
                Students haven't sent you any direct{'\n'}messages yet.
              </Text>
            </View>

          </View>
        </ScrollView>

        <BottomNav
          items={[
            { label: 'Home', icon: '🏠', active: false, onPress: () => router.replace('/(lecturer)/home') },
            { label: 'Chats', icon: '💬', onPress: () => router.replace('/(lecturer)/chats') },
            { label: 'Notices', icon: '📢', onPress: () => router.replace('/(lecturer)/announcements') },
            { label: 'Profile', icon: '👤', onPress: () => router.replace('/(lecturer)/profile') },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}