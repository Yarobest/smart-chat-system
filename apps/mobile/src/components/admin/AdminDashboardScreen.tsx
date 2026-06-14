import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BottomNav } from '@/src/components/common/BottomNav';
import { StatusBar } from '@/src/components/common/StatusBar';

const stats = [
  {
    icon: '👥',
    value: '1,248',
    label: 'Total Users',
    trend: '↑ 48 this month',
    trendColor: 'text-emerald-500',
  },
  {
    icon: '🟢',
    value: '342',
    label: 'Online Now',
    trend: '↑ 27% vs yesterday',
    trendColor: 'text-emerald-500',
  },
  {
    icon: '💬',
    value: '8,421',
    label: 'Msgs Today',
    trend: '↑ 12%',
    trendColor: 'text-emerald-500',
  },
  {
    icon: '🚨',
    value: '3',
    label: 'Active Alerts',
    trend: 'Needs attention',
    trendColor: 'text-rose-500',
  },
] as const;

const chartData = [
  { day: 'Mon', height: 24, active: false },
  { day: 'Tue', height: 42, active: false },
  { day: 'Wed', height: 32, active: false },
  { day: 'Thu', height: 50, active: true },
  { day: 'Fri', height: 36, active: false },
  { day: 'Sat', height: 18, active: false },
  { day: 'Sun', height: 10, active: false },
] as const;

const quickActions = [
  {
    icon: '🔐',
    title: 'Security',
    subtitle: 'Alerts',
    accent: 'border-emerald-400',
    onPress: () => router.push('/(admin)/dashboard/security-center'),
  },
    {
    icon: '📍',
    title: 'Live Activity',
    subtitle: 'View activity',
    accent: 'border-purple-400',
    onPress: () => router.push('/(admin)/dashboard/live-activity'),
  },
  {
    icon: '💚',
    title: 'System Health',
    subtitle: 'Check status',
    accent: 'border-emerald-500',
    onPress: () => router.push('/(admin)/dashboard/system-health'),
  },
  {
    icon: '🟢',
    title: 'User Presence',
    subtitle: 'Online users',
    accent: 'border-cyan-400',
    onPress: () => router.push('/(admin)/dashboard/user-presence'),
  },
] as const;

const notifications = [
  {
    title: 'Suspicious login detected',
    message: 'A new admin login was detected from an unfamiliar device.',
    time: '2m ago',
    tone: 'bg-rose-50',
  },
  {
    title: 'Storage usage at 78%',
    message: 'Media uploads are approaching the configured warning limit.',
    time: '18m ago',
    tone: 'bg-amber-50',
  },
  {
    title: '12 new user registrations',
    message: 'Pending approvals are waiting for review in user management.',
    time: '1h ago',
    tone: 'bg-blue-50',
  },
] as const;

function StatCard({
  icon,
  value,
  label,
  trend,
  trendColor,
  onPress,
}: (typeof stats)[number] & { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 w-[48.5%] rounded-[22px] bg-white p-4 shadow-sm shadow-slate-200"
    >
      <Text className="text-lg">{icon}</Text>
      <Text className="mt-3 text-xl font-extrabold text-slate-900">{value}</Text>
      <Text className="mt-1 text-sm text-slate-500">{label}</Text>
      <Text className={`mt-2 text-xs font-semibold ${trendColor}`}>{trend}</Text>
    </Pressable>
  );
}

export default function AdminDashboardScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-[#1A2E57]" edges={['top']}>
      <StatusBar style="light" backgroundColor="#1A2E57" />
      <View className="flex-1 bg-[#EEF3FB]">
        <View
          className="bg-[#1A2E57] px-5 pb-6"
          style={{ paddingTop: Math.max(insets.top, 4) }}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="-mt-5 text-base font-semibold text-white/80">Good Morning 👋</Text>
              <Text className="mt-1 text-3xl font-extrabold text-white">System Admin</Text>
            </View>

            <View className="mb-3 ml-4 flex-row items-center gap-2 self-end">
              <Pressable
                onPress={() => router.push('/(admin)/notifications?filter=Alerts')}
                className="relative h-12 w-12 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
              >
                <View className="absolute right-2 top-2 z-10 min-w-5 rounded-full bg-[#F26157] px-1 py-[1px]">
                  <Text className="text-center text-xs font-bold text-white">
                    {notifications.length}
                  </Text>
                </View>
                <Text className="text-lg text-white">🔔</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push('/(admin)/profile')}
                className="h-12 w-12 items-center justify-center rounded-full bg-[#F26157] active:opacity-90"
              >
                <Text className="text-sm font-extrabold text-white">AD</Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-5 rounded-[20px] border border-white/10 bg-white/10 px-4 py-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-white/70">System Health</Text>
              <Text className="text-sm font-bold text-emerald-300">98.2% Uptime</Text>
            </View>
            <View className="mt-3 h-3 overflow-hidden rounded-full bg-white/15">
              <View className="h-full w-[98%] rounded-full bg-[#56D4D8]" />
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 pb-6 pt-4">
            <View className="flex-row flex-wrap justify-between">
              {stats.map((stat) => (
                <StatCard
                  key={stat.label}
                  {...stat}
                  onPress={
                    stat.label === 'Active Alerts'
                      ? () => router.push('/(admin)/notifications')
                      : undefined
                  }
                />
              ))}
            </View>

            <Pressable
              onPress={() => router.push('/(admin)/notifications')}
              className="mb-4 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-4"
            >
              <View className="flex-row items-start">
                <Text className="mr-3 mt-0.5 text-2xl">🚨</Text>
                <View className="flex-1">
                  <Text className="text-sm font-extrabold text-rose-500">3 Active Alerts</Text>
                  <Text className="mt-1 text-sm leading-5 text-slate-600">
                    Suspicious login · Storage 78% · Flagged message
                  </Text>
                </View>
              </View>
            </Pressable>

            <View className="mb-5 rounded-[24px] bg-white p-4 shadow-sm shadow-slate-200">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-extrabold text-slate-900">Messages this week</Text>
                <View className="rounded-full bg-blue-50 px-3 py-1">
                  <Text className="text-xs font-extrabold text-blue-500">DAILY</Text>
                </View>
              </View>

              <View className="mt-6 flex-row items-end justify-between">
                {chartData.map((item) => (
                  <View key={item.day} className="items-center">
                    <View
                      style={{ height: item.height }}
                      className={`w-11 rounded-t-xl ${
                        item.active ? 'bg-[#4E79E6]' : 'bg-[#8BA6EE]'
                      }`}
                    />
                    <Text
                      className={`mt-2 text-sm font-semibold ${
                        item.active ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    >
                      {item.day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <Text className="mb-3 text-base font-extrabold text-slate-900">Quick Actions</Text>

            <View className="flex-row flex-wrap justify-between">
              {quickActions.map((action) => (
                <Pressable
                  key={action.title}
                  onPress={action.onPress}
                  className={`mb-3 w-[48.5%] rounded-[22px] border-2 bg-white px-4 py-5 shadow-sm shadow-slate-200 ${action.accent}`}
                >
                  <Text className="text-2xl">{action.icon}</Text>
                  <Text className="mt-5 text-base font-extrabold text-slate-900">{action.title}</Text>
                  <Text className="mt-1 text-sm text-slate-400">{action.subtitle}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        <BottomNav
          items={[
            { label: 'Home', icon: '🏠', active: true, onPress: () => router.replace('/(admin)/dashboard') },
            { label: 'Users', icon: '👥', onPress: () => router.replace('/(admin)/users') },
            { label: 'Broadcast', icon: '📣', badge: 3, onPress: () => router.replace('/(admin)/broadcast/broad-cast') },
            { label: 'Analytics', icon: '📈', onPress: () => router.replace('/(admin)/analytics/reports-and-analytics') },
            { label: 'Settings', icon: '⚙️', onPress: () => router.replace('/(admin)/settings') },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}
