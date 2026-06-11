import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';

interface Notification {
  id: string;
  type: 'admin' | 'student';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  icon: string;
  color: string;
  bgColor: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'admin',
    title: 'New System Update',
    message: 'The grading system has been updated with new features for better performance tracking.',
    timestamp: 'Today at 2:30 PM',
    isRead: false,
    icon: '🔧',
    color: '#6366F1',
    bgColor: '#EEF2FF',
  },
  {
    id: '2',
    type: 'student',
    title: 'Assignment Submission - Stephen Appiah',
    message: 'Stephen Appiah has submitted Assignment 3 for CS301 Data Structures.',
    timestamp: 'Today at 1:15 PM',
    isRead: false,
    icon: '📝',
    color: '#10B981',
    bgColor: '#F0FDF4',
  },
  {
    id: '3',
    type: 'admin',
    title: 'Maintenance Notice',
    message: 'Scheduled maintenance will occur on Jan 20 from 11 PM to 1 AM. The system will be unavailable during this time.',
    timestamp: 'Yesterday at 10:00 AM',
    isRead: true,
    icon: '⚠️',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
  },
  {
    id: '4',
    type: 'student',
    title: 'Quiz Completed - Rudolf Gavor',
    message: 'Rudolf Gavor completed the CS301 Mid-Semester Quiz with a score of 80%.',
    timestamp: 'Yesterday at 3:45 PM',
    isRead: true,
    icon: '✅',
    color: '#06B6D4',
    bgColor: '#F0F9FA',
  },
  {
    id: '5',
    type: 'student',
    title: 'Question Posted - Abena Asante',
    message: 'Abena Asante posted a question in CS301: "Can you explain the difference between BFS and DFS?"',
    timestamp: 'Jan 12 at 9:30 AM',
    isRead: true,
    icon: '❓',
    color: '#8B5CF6',
    bgColor: '#FAF5FF',
  },
  {
    id: '6',
    type: 'admin',
    title: 'Grade Deadline Reminder',
    message: 'Please submit all grades for CS301 Quiz by Jan 15. This is your final reminder.',
    timestamp: 'Jan 11 at 4:00 PM',
    isRead: true,
    icon: '📋',
    color: '#EF4444',
    bgColor: '#FEE2E2',
  },
];

function NotificationCard({ notification }: { notification: Notification }) {
  return (
    <Pressable className="mb-3 flex-row gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4">
      <View
        className="h-12 w-12 items-center justify-center rounded-full flex-shrink-0"
        style={{ backgroundColor: notification.bgColor }}
      >
        <Text className="text-xl">{notification.icon}</Text>
      </View>

      <View className="flex-1">
        <View className="flex-row items-start justify-between gap-2">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-900">{notification.title}</Text>
            <Text className="mt-1 text-xs text-slate-600 leading-4">{notification.message}</Text>
          </View>
          {!notification.isRead && (
            <View
              className="h-2 w-2 rounded-full flex-shrink-0 mt-1"
              style={{ backgroundColor: notification.color }}
            />
          )}
        </View>

        <Text className="mt-2 text-xs text-slate-400">{notification.timestamp}</Text>
      </View>
    </Pressable>
  );
}

export default function LecturerNotificationsScreen() {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.isRead).length;
  const adminNotifications = NOTIFICATIONS.filter((n) => n.type === 'admin');
  const studentNotifications = NOTIFICATIONS.filter((n) => n.type === 'student');

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />

      {/* Header */}
      <View className="bg-[#051839] px-4 pb-5 pt-6">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-3">
          <Text className="text-2xl text-white">‹</Text>
          <View>
            <Text className="text-2xl font-extrabold text-white">Notifications</Text>
            <Text className="text-sm text-slate-300">
              {unreadCount} unread • {NOTIFICATIONS.length} total
            </Text>
          </View>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 bg-[#F5F7FA]"
        contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Admin Notifications */}
        <View>
          <View className="mb-4 flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
              <Text className="text-sm">🛡️</Text>
            </View>
            <Text className="text-base font-extrabold text-slate-900">From Admin</Text>
            <Text className="text-xs font-semibold text-slate-400">
              {adminNotifications.length}
            </Text>
          </View>

          {adminNotifications.length > 0 ? (
            <View>
              {adminNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </View>
          ) : (
            <View className="rounded-2xl border border-slate-200 bg-white px-4 py-6 items-center">
              <Text className="text-lg text-slate-400">No admin notifications</Text>
            </View>
          )}
        </View>

        {/* Student Notifications */}
        <View>
          <View className="mb-4 flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <Text className="text-sm">👥</Text>
            </View>
            <Text className="text-base font-extrabold text-slate-900">From Students</Text>
            <Text className="text-xs font-semibold text-slate-400">
              {studentNotifications.length}
            </Text>
          </View>

          {studentNotifications.length > 0 ? (
            <View>
              {studentNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </View>
          ) : (
            <View className="rounded-2xl border border-slate-200 bg-white px-4 py-6 items-center">
              <Text className="text-lg text-slate-400">No student notifications</Text>
            </View>
          )}
        </View>

        {/* Mark All as Read */}
        {unreadCount > 0 && (
          <Pressable className="rounded-full border border-slate-200 bg-white px-5 py-3 items-center">
            <Text className="text-sm font-semibold text-slate-700">Mark all as read</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
