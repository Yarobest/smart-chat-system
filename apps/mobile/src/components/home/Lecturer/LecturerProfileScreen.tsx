import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { LecturerBottomNav } from '@/src/components/common/LecturerBottomNav';
import { LogoutModal } from '@/src/components/auth/Logout';
import { authService } from '@/src/services/auth.service';
import { useAuth } from '@/src/hooks/useAuth';
import { getInitials } from '@/src/utils/getInitials';
import { useLiveThreads } from '@/src/hooks/useLiveThreads';

export default function LecturerProfileScreen() {
  const [logoutVisible, setLogoutVisible] = useState(false);
  const { user, token } = useAuth();
  const { unreadCount, groupCount, memberCount } = useLiveThreads();

  useEffect(() => {
    if (token) {
      authService.me().catch(() => null);
    }
  }, [token]);

  const displayName = user?.name ?? 'Lecturer';
  const displayEmail = user?.email ?? 'Not available';
  const displayRole = (user?.role ?? 'lecturer').toUpperCase();
  const initials = getInitials(displayName) || 'LE';

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header ── */}
          <View className="bg-[#102B57] px-4 pb-6 pt-6">
            <View className="items-center">
              {/* Avatar */}
              <View className="relative h-24 w-24 items-center justify-center rounded-full border-2 border-orange-300 bg-orange-500">
                <Text className="text-5xl font-bold text-white">{initials}</Text>
                <View className="absolute -bottom-0.5 -right-0.5 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-500">
                  <Text className="text-lg text-white">✏️</Text>
                </View>
              </View>

              <Text className="mt-4 text-xl font-extrabold text-white">{displayName}</Text>
              <Text className="mt-1 text-sm text-slate-300">Staff ID: {user?.staffId ?? user?.id ?? 'Not available'}</Text>

              <View className="mt-3 rounded-full bg-amber-400 px-5 py-1.5">
                <Text className="text-sm font-bold tracking-wide text-[#4A3700]">{displayRole}</Text>
              </View>
            </View>

            {/* Stats */}
            <View className="mt-5 flex-row overflow-hidden rounded-2xl border border-white/15 bg-white/10">
              <View className="flex-1 items-center py-4">
                <Text className="text-xl font-extrabold text-white">{groupCount}</Text>
                <Text className="text-sm text-slate-300">Groups</Text>
              </View>
              <View className="w-px bg-white/10" />
              <View className="flex-1 items-center py-4">
                <Text className="text-xl font-extrabold text-white">{memberCount}</Text>
                <Text className="text-sm text-slate-300">Members</Text>
              </View>
              <View className="w-px bg-white/10" />
              <View className="flex-1 items-center py-4">
                <Text className="text-xl font-extrabold text-white">{unreadCount}</Text>
                <Text className="text-sm text-slate-300">Unread</Text>
              </View>
            </View>
          </View>

          {/* ── Body ── */}
          <View className="bg-[#F5F7FA] px-4 py-4">
            <Text className="mb-3 text-sm font-extrabold tracking-wide text-slate-400">
              PERSONAL INFO
            </Text>

            {/* Email */}
            <View className="mb-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-md bg-violet-100">
                  <Text className="text-base">📧</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-slate-400">Email</Text>
                  <Text className="text-lg font-semibold text-blue-600" numberOfLines={1}>
                    {displayEmail}
                  </Text>
                </View>
              </View>
            </View>

            {/* Department */}
            <View className="mb-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-md bg-violet-100">
                  <Text className="text-base">🏛️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-slate-400">Department</Text>
                  <Text className="text-lg font-semibold text-slate-900" numberOfLines={1}>
                    {user?.department ?? 'Not available'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Office */}
            <View className="mb-5 rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-md bg-violet-100">
                  <Text className="text-base">📞</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-slate-400">Office</Text>
                  <Text className="text-lg font-semibold text-slate-900" numberOfLines={1}>
                    Block B, Room 204
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Links */}
            <Text className="mb-3 text-sm font-extrabold tracking-wide text-slate-400">
              QUICK LINKS
            </Text>

            {[
              { label: 'My Courses', icon: '📚', onPress: () => router.push('./courses') },
              { label: 'Post Announcement', icon: '📣', onPress: () => router.push('./announcements/compose') },
              { label: 'My Students', icon: '👥', onPress: () => router.push('./groups') },
              { label: 'Notifications', icon: '🔔', onPress: () => router.push('./notifications') },
              { label: 'Settings', icon: '⚙️', onPress: () => router.push('./settings') },
            ].map((item) => (
              <Pressable
                key={item.label}
                onPress={item.onPress}
                className="mb-3 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4"
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-8 w-8 items-center justify-center rounded-md bg-violet-100">
                    <Text className="text-base">{item.icon}</Text>
                  </View>
                  <Text className="text-lg font-semibold text-slate-900">{item.label}</Text>
                </View>
                <Text className="text-sm text-slate-400">›</Text>
              </Pressable>
            ))}

            {/* Logout */}
            <Pressable
              onPress={() => setLogoutVisible(true)}
              className="mb-2 flex-row items-center justify-between rounded-2xl border border-red-100 bg-red-50 px-4 py-4"
            >
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-md bg-red-100">
                  <Text className="text-base">🚪</Text>
                </View>
                <Text className="text-lg font-semibold text-red-500">Logout</Text>
              </View>
              <Text className="text-sm text-red-400">›</Text>
            </Pressable>
          </View>
        </ScrollView>

        <LecturerBottomNav unreadCount={unreadCount} />

        <LogoutModal
          visible={logoutVisible}
          onCancel={() => setLogoutVisible(false)}
          onConfirm={() => {
            setLogoutVisible(false);
            authService.logout();
            router.replace('/(auth)/login');
          }}
        />
      </View>
    </SafeAreaView>
  );
}
