import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { BottomNav } from '@/src/components/common/BottomNav';
import { useAuth } from '@/src/hooks/useAuth';
import { useNotifications } from '@/src/hooks/useNotifications';
import { authService } from '@/src/services/auth.service';
import { getInitials } from '@/src/utils/getInitials';
import { useLiveThreads } from '@/src/hooks/useLiveThreads';

export default function LecturerHomeScreen() {
  const { user, token } = useAuth();
  const { unreadCount: notificationCount } = useNotifications();
  const { threads, unreadCount, memberCount: studentCount } = useLiveThreads();

  useEffect(() => {
    if (token) authService.me().catch(() => null);
  }, [token]);

  const displayName = user?.name ?? 'Lecturer';
  const initials = getInitials(displayName) || 'LE';
  const groupThreads = useMemo(() => threads.filter((thread) => thread.type === 'group'), [threads]);

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="flex-1 bg-[#051839]">
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 12 }}>
          <View className="px-4 pb-6 pt-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-sm text-slate-300">Good Day 👋</Text>
                <Text className="text-2xl font-extrabold text-white" numberOfLines={1}>
                  {displayName}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Pressable
                  onPress={() => router.push('/(lecturer)/notifications' as any)}
                  className="relative h-10 w-10 items-center justify-center rounded-full bg-white/10"
                >
                  <Text className="text-lg">🔔</Text>
                  {notificationCount > 0 ? (
                    <View className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1">
                      <Text className="text-center text-xs font-bold text-white">{notificationCount}</Text>
                    </View>
                  ) : null}
                </Pressable>
                <Pressable
                  onPress={() => router.replace('/(lecturer)/profile')}
                  className="h-10 w-10 items-center justify-center rounded-full bg-orange-500"
                >
                  <Text className="text-sm font-bold text-white">{initials}</Text>
                </Pressable>
              </View>
            </View>

            <View className="mt-5 flex-row gap-3">
              {[
                { label: 'Groups', value: String(groupThreads.length) },
                { label: 'Members', value: String(studentCount) },
                { label: 'Unread', value: String(unreadCount) },
              ].map((stat) => (
                <View key={stat.label} className="flex-1 items-start rounded-2xl bg-white/10 px-4 py-4">
                  <Text className="text-2xl font-extrabold text-amber-300">{stat.value}</Text>
                  <Text className="mt-0.5 text-xs text-slate-400">{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="flex-1 rounded-t-3xl bg-white px-4 pt-5">
            <View className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
              <Text className="mb-1 text-base font-extrabold text-amber-700">
                Welcome, {displayName}
              </Text>
              <Text className="text-sm leading-5 text-amber-600">
                {user?.department ?? 'Your department'} · {user?.faculty ?? 'Ho Technical University'}
              </Text>
            </View>

            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-base font-extrabold text-slate-900">My Conversations</Text>
              <Pressable onPress={() => router.replace('/(lecturer)/chats')}>
                <Text className="text-sm font-semibold text-blue-600">See All</Text>
              </Pressable>
            </View>

            {threads.slice(0, 4).map((thread) => (
              <Pressable
                key={thread.id}
                onPress={() =>
                  router.push(
                    thread.type === 'group'
                      ? (`/(lecturer)/groups/${thread.id}` as any)
                      : (`/(lecturer)/chats/${thread.id}` as any),
                  )
                }
                className="mb-3 flex-row items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-4"
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                    <Text className="text-2xl">{thread.type === 'group' ? '👥' : '💬'}</Text>
                  </View>
                  <View className="max-w-[220px]">
                    <Text className="text-sm font-extrabold text-slate-900" numberOfLines={1}>
                      {thread.title}
                    </Text>
                    <Text className="text-xs text-slate-400" numberOfLines={1}>
                      {thread.lastMessage?.text || 'No messages yet'}
                    </Text>
                  </View>
                </View>
                {thread.unreadCount > 0 ? (
                  <View className="rounded-full bg-blue-600 px-2 py-1">
                    <Text className="text-xs font-bold text-white">{thread.unreadCount}</Text>
                  </View>
                ) : null}
              </Pressable>
            ))}

            {threads.length === 0 ? (
              <View className="mb-6 items-center justify-center py-10">
                <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Text className="text-3xl">✉️</Text>
                </View>
                <Text className="text-base font-bold text-slate-700">No conversations yet</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <BottomNav
          items={[
            { label: 'Home', icon: '🏠', active: true, onPress: () => router.replace('/(lecturer)/home') },
            { label: 'Chats', icon: '💬', badge: unreadCount, onPress: () => router.replace('/(lecturer)/chats') },
            { label: 'Notices', icon: '📢', onPress: () => router.replace('/(lecturer)/announcements') },
            { label: 'Profile', icon: '👤', onPress: () => router.replace('/(lecturer)/profile') },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}
