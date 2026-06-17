import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AdminBottomNav } from '@/src/components/common/AdminBottomNav';
import { StatusBar } from '@/src/components/common/StatusBar';
import { AdminDashboard, adminService } from '@/src/services/admin.service';

type DashboardStat = {
  icon: string;
  value: string;
  label: string;
  trend: string;
  trendColor: string;
};

const getStats = (dashboard: AdminDashboard | null): DashboardStat[] => [
  {
    icon: '👥',
    value: (dashboard?.stats.totalUsers ?? 0).toLocaleString(),
    label: 'Total Users',
    trend: `${dashboard?.stats.students ?? 0} students · ${dashboard?.stats.lecturers ?? 0} lecturers`,
    trendColor: 'text-emerald-500',
  },
  {
    icon: '🟢',
    value: (dashboard?.stats.onlineUsers ?? 0).toLocaleString(),
    label: 'Online Now',
    trend: 'Live from database',
    trendColor: 'text-emerald-500',
  },
  {
    icon: '🏫',
    value: (dashboard?.stats.conversations ?? 0).toLocaleString(),
    label: 'Chat Spaces',
    trend: 'Direct and course group rooms',
    trendColor: 'text-emerald-500',
  },
  {
    icon: '🛡️',
    value: (dashboard?.stats.admins ?? 0).toLocaleString(),
    label: 'Admins',
    trend: 'Admin accounts',
    trendColor: 'text-blue-500',
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
}: DashboardStat & { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 w-[48.5%] rounded-[22px] bg-white p-4 shadow-sm shadow-slate-200"
    >
      <Text className="text-lg">{icon}</Text>
      <Text className="mt-3 text-xl font-extrabold text-slate-900" numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text className="mt-1 text-sm text-slate-500" numberOfLines={1}>{label}</Text>
      <Text className={`mt-2 text-xs font-semibold ${trendColor}`} numberOfLines={2}>{trend}</Text>
    </Pressable>
  );
}

export default function AdminDashboardScreen() {
  const insets = useSafeAreaInsets();
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const stats = useMemo(() => getStats(dashboard), [dashboard]);

  useEffect(() => {
    let mounted = true;

    adminService
      .dashboard()
      .then((data) => {
        if (mounted) {
          setDashboard(data);
          setError('');
        }
      })
      .catch((caught) => {
        if (mounted) {
          setError(caught instanceof Error ? caught.message : 'Unable to load dashboard');
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

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
              <Text className="-mt-5 text-sm font-semibold text-white/80">
                {loading ? 'Loading live data...' : 'Live Admin Overview'}
              </Text>
              <Text className="mt-1 text-2xl font-extrabold text-white">System Admin</Text>
            </View>

            <View className="mb-3 ml-4 flex-row items-center gap-2 self-end">
              <Pressable
                onPress={() => router.push('/(admin)/notifications?filter=Alerts')}
                className="relative h-12 w-12 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
              >
                <View className="absolute right-2 top-2 z-10 min-w-5 rounded-full bg-[#F26157] px-1 py-[1px]">
                  <Text className="text-center text-xs font-bold text-white">
                    {dashboard?.recentUsers.length ?? 0}
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
              <Text className="text-sm font-bold text-emerald-300">
                {error ? 'API unavailable' : 'Database connected'}
              </Text>
            </View>
            <View className="mt-3 h-3 overflow-hidden rounded-full bg-white/15">
              <View className={`h-full rounded-full ${error ? 'w-[20%] bg-rose-400' : 'w-full bg-[#56D4D8]'}`} />
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 pb-6 pt-4">
            <Pressable
              onPress={() => router.push('/(admin)/notifications')}
              className={`mb-4 rounded-[22px] border px-4 py-4 ${
                error ? 'border-rose-200 bg-rose-50' : 'border-blue-200 bg-blue-50'
              }`}
            >
              <View className="flex-row items-start">
                <Text className="mr-3 mt-0.5 text-2xl">{error ? '🚨' : '📡'}</Text>
                <View className="flex-1">
                  <Text className={`text-sm font-extrabold ${error ? 'text-rose-500' : 'text-blue-600'}`}>
                    {error ? 'Backend connection issue' : 'Live database feed'}
                  </Text>
                  <Text className="mt-1 text-sm leading-5 text-slate-600">
                    {error || `${dashboard?.recentUsers.length ?? 0} recent users · ${dashboard?.stats.conversations ?? 0} chat spaces tracked`}
                  </Text>
                </View>
              </View>
            </Pressable>

            <View className="flex-row flex-wrap justify-between">
              {stats.map((stat) => (
                <StatCard
                  key={stat.label}
                  {...stat}
                  onPress={
                    stat.label === 'Admins'
                      ? () => router.push('/(admin)/users')
                      : undefined
                  }
                />
              ))}
            </View>

            <Text className="mb-3 text-base font-extrabold text-slate-900">Quick Links</Text>

            <View className="mb-2 flex-row flex-wrap justify-between">
              {quickActions.map((action) => (
                <Pressable
                  key={action.title}
                  onPress={action.onPress}
                  className={`mb-3 w-[48.5%] rounded-[20px] border bg-white px-4 py-4 shadow-sm shadow-slate-200 ${action.accent}`}
                >
                  <Text className="text-xl">{action.icon}</Text>
                  <Text className="mt-4 text-sm font-extrabold text-slate-900" numberOfLines={1} adjustsFontSizeToFit>{action.title}</Text>
                  <Text className="mt-1 text-xs font-semibold text-slate-400" numberOfLines={1}>{action.subtitle}</Text>
                </Pressable>
              ))}
            </View>

            <View className="mb-5 rounded-[22px] bg-white p-4 shadow-sm shadow-slate-200">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-extrabold text-slate-900">Recent Activity</Text>
                <View className="rounded-full bg-blue-50 px-3 py-1">
                  <Text className="text-xs font-extrabold text-blue-500">DAILY</Text>
                </View>
              </View>

              <View className="mt-5">
                {(dashboard?.recentUsers ?? []).slice(0, 4).map((user) => (
                  <View key={user.id} className="border-t border-slate-100 py-3">
                    <Text className="text-sm font-extrabold text-slate-900" numberOfLines={1}>
                      {user.name}
                    </Text>
                    <Text className="mt-1 text-sm text-slate-500" numberOfLines={2}>
                      {user.role} · {user.department ?? user.faculty ?? 'No department'} · Joined {new Date(user.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
                {!dashboard?.recentUsers.length ? (
                  <Text className="py-4 text-sm font-semibold text-slate-400">
                    {loading ? 'Loading user activity...' : 'No recent user activity yet.'}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </ScrollView>

        <AdminBottomNav active="home" />
      </View>
    </SafeAreaView>
  );
}
