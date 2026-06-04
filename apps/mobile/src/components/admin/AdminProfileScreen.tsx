import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogoutModal } from '@/src/components/auth/Logout';
import { StatusBar } from '@/src/components/common/StatusBar';
import { authService } from '@/src/services/auth.service';
import { useAuth } from '@/src/hooks/useAuth';
import { getInitials } from '@/src/utils/getInitials';

const profileStats = [
  { label: 'Users', value: '1,248' },
  { label: 'Courses', value: '48' },
  { label: 'Broadcasts', value: '27' },
  { label: 'Uptime', value: '98%' },
] as const;

const adminControls = [
  { label: 'Live Dashboard', icon: '📊', onPress: () => router.replace('/(admin)/dashboard') },
  { label: 'User Management', icon: '👥', onPress: () => router.replace('/(admin)/users') },
  { label: 'Security Center', icon: '🔐', onPress: () => router.replace('/(admin)/notifications?filter=Security') },
  { label: 'Reports & Analytics', icon: '📈', onPress: () => router.replace('/(admin)/audit') },
  { label: 'System Settings', icon: '⚙️', onPress: () => router.replace('/(admin)/broadcast') },
] as const;

export default function AdminProfileScreen() {
  const insets = useSafeAreaInsets();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (token) {
      authService.me().catch(() => null);
    }
  }, [token]);

  const handleLogout = async () => {
    setLogoutVisible(false);
    await authService.logout();
    router.replace('/(auth)/login');
  };

  const displayName = user?.name ?? 'System Admin';
  const displayRole = (user?.role ?? 'admin').toUpperCase();
  const initials = getInitials(displayName) || 'AD';
  const adminInfo = [
    {
      label: 'Email',
      value: user?.email ?? 'Not available',
      icon: '📧',
      valueColor: 'text-blue-600',
    },
    {
      label: 'Institution',
      value: 'Ho Technical University',
      icon: '🏛️',
      valueColor: 'text-slate-900',
    },
    {
      label: 'Access Level',
      value: displayRole,
      icon: '🛡️',
      valueColor: 'text-slate-900',
    },
    {
      label: 'User ID',
      value: user?.staffId ?? user?.studentId ?? user?.id ?? 'Not available',
      icon: '📅',
      valueColor: 'text-slate-900',
    },
  ] as const;

  return (
    <SafeAreaView className="flex-1 bg-[#1A2E57]" edges={['top']}>
      <StatusBar style="light" backgroundColor="#1A2E57" />
      <View className="flex-1 bg-[#F4F7FD]">
        <View
          className="bg-[#1A2E57] px-5 pb-6"
          style={{ paddingTop: Math.max(insets.top, 4) }}
        >
          <Pressable
            onPress={() => router.back()}
            className="absolute left-5 z-10 h-10 w-10 items-center justify-center rounded-xl bg-white/10 active:bg-white/20"
            style={{ top: Math.max(insets.top, 4) }}
          >
            <Text className="text-xl text-white">‹</Text>
          </Pressable>

          <View className="-mt-20 items-center">
            <View className="relative h-24 w-24 items-center justify-center rounded-full border-2 border-white/20 bg-[#F26157]">
              <Text className="text-5xl font-extrabold text-white">{initials}</Text>
              <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-[#1A2E57] bg-[#3D6EE8]">
                <Text className="text-sm text-white">✏️</Text>
              </View>
            </View>

            <Text className="mt-4 text-3xl font-extrabold text-white">{displayName}</Text>
            <Text className="mt-1 text-base font-medium text-white/65">Admin ID: {user?.id ?? 'Not available'}</Text>

            <View className="mt-4 rounded-full bg-[#F26157] px-5 py-2">
              <Text className="text-sm font-extrabold tracking-wide text-white">
                ⚙ ADMINISTRATOR
              </Text>
            </View>

            <View className="mt-5 flex-row overflow-hidden rounded-[22px] border border-white/10 bg-white/10">
              {profileStats.map((stat, index) => (
                <View key={stat.label} className="flex-1 items-center px-4 py-4">
                  <Text className="text-2xl font-extrabold text-white">{stat.value}</Text>
                  <Text className="mt-1 text-center text-sm font-medium text-white/60">
                    {stat.label}
                  </Text>
                  {index < profileStats.length - 1 ? (
                    <View className="absolute right-0 top-3 h-12 w-px bg-white/10" />
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 18 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="-mt-3 px-4 py-4">
            <Text className="mb-3 text-sm font-extrabold tracking-wide text-slate-400">
              ADMIN INFO
            </Text>

            {adminInfo.map((item) => (
              <View
                key={item.label}
                className="mb-3 flex-row items-center justify-between rounded-[22px] bg-white px-4 py-4 shadow-sm shadow-slate-200"
              >
                <View className="flex-row items-center">
                  <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Text className="text-lg">{item.icon}</Text>
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-slate-400">{item.label}</Text>
                    <Text className={`mt-1 text-lg font-semibold ${item.valueColor}`}>
                      {item.value}
                    </Text>
                  </View>
                </View>
                <Text className="text-sm font-semibold text-slate-400">›</Text>
              </View>
            ))}

            <Text className="mb-3 text-sm font-extrabold tracking-wide text-slate-400">
              ADMIN CONTROLS
            </Text>

            {adminControls.map((item) => (
              <Pressable
                key={item.label}
                onPress={item.onPress}
                className="mb-3 flex-row items-center justify-between rounded-[22px] bg-white px-4 py-5 shadow-sm shadow-slate-200"
              >
                <View className="flex-row items-center">
                  <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Text className="text-lg">{item.icon}</Text>
                  </View>
                  <Text className="text-lg font-semibold text-slate-900">{item.label}</Text>
                </View>
                <Text className="text-sm font-semibold text-slate-400">›</Text>
              </Pressable>
            ))}

            <Pressable
              onPress={() => setLogoutVisible(true)}
              className="mb-3 flex-row items-center justify-between rounded-[22px] border border-red-100 bg-red-50 px-4 py-5 shadow-sm shadow-slate-200"
            >
              <View className="flex-row items-center">
                <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                  <Text className="text-lg">🚪</Text>
                </View>
                <Text className="text-lg font-semibold text-red-500">Logout</Text>
              </View>
              <Text className="text-sm font-semibold text-red-400">›</Text>
            </Pressable>
          </View>
        </ScrollView>

        <LogoutModal
          visible={logoutVisible}
          onCancel={() => setLogoutVisible(false)}
          onConfirm={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
}
