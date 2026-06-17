import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from '@/src/components/common/StatusBar';
import { AdminUserDetails, adminService } from '@/src/services/admin.service';
import { getInitials } from '@/src/utils/getInitials';

const adminActions = [
  { label: 'Send Direct Message', icon: '✉️', accent: 'text-blue-600', tone: 'bg-white' },
  { label: 'Reset Password', icon: '🔑', accent: 'text-amber-600', tone: 'bg-white' },
  { label: 'Suspend Account', icon: '🚫', accent: 'text-red-500', tone: 'bg-red-50' },
  { label: 'Delete Account', icon: '🗑️', accent: 'text-red-500', tone: 'bg-red-50' },
] as const;

function DetailRow({
  icon,
  label,
  value,
  valueAccent,
}: {
  icon: string;
  label: string;
  value: string;
  valueAccent?: string;
}) {
  return (
    <View className="mb-3 flex-row items-center justify-between rounded-[22px] bg-white px-4 py-4 shadow-sm shadow-slate-200">
      <View className="flex-row items-center">
        <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <Text className="text-lg">{icon}</Text>
        </View>
        <Text className="text-lg font-semibold text-slate-900">{label}</Text>
      </View>

      <Text className={`text-sm font-semibold ${valueAccent ?? 'text-slate-500'}`}>{value}</Text>
    </View>
  );
}

export default function UserDetailsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [details, setDetails] = useState<AdminUserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('Missing user id');
      return;
    }

    let mounted = true;

    adminService
      .user(id)
      .then((data) => {
        if (mounted) {
          setDetails(data);
          setError('');
        }
      })
      .catch((caught) => {
        if (mounted) {
          setError(caught instanceof Error ? caught.message : 'Unable to load user');
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const user = details?.user;

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-[#203765]" edges={['top']}>
        <StatusBar style="light" backgroundColor="#203765" />
        <View className="flex-1 items-center justify-center bg-[#F3F6FD] px-6">
          <Text className="text-lg font-semibold text-slate-700">
            {loading ? 'Loading user...' : error || 'User not found'}
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-4 rounded-2xl bg-[#3D6EE8] px-5 py-3"
          >
            <Text className="text-sm font-bold text-white">Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#203765]" edges={['top']}>
      <StatusBar style="light" backgroundColor="#203765" />
      <View className="flex-1 bg-[#F3F6FD]">
        <View
          className="bg-[#203765] px-5 pb-5"
          style={{ paddingTop: Math.max(insets.top, 4) }}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center">
              <Pressable
                onPress={() => router.back()}
                className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-white/10 active:bg-white/20"
              >
                <Text className="text-xl text-white">‹</Text>
              </Pressable>

              <View>
                <Text className="-mt-3 text-3xl font-extrabold text-white">User Details</Text>
                <Text className="mt-1 text-sm font-medium text-white/65">Full profile & activity</Text>
              </View>
            </View>

            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <Text className="text-lg text-[#F26157]">🚫</Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 18 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 pb-6 pt-4">
            <View className="rounded-[24px] border-2 border-blue-500 bg-white px-4 py-5 shadow-sm shadow-slate-200">
              <View className="flex-row items-center">
                <View className="h-20 w-20 items-center justify-center rounded-full bg-[#3B6AE3]">
                  <Text className="text-2xl font-extrabold text-white">{getInitials(user.name)}</Text>
                </View>

                <View className="ml-4 flex-1">
                  <Text className="text-2xl font-extrabold text-slate-900">{user.name}</Text>
                  <Text className="mt-1 text-sm text-slate-400">
                    ID: {user.studentId ?? user.staffId ?? user.id} · {user.department ?? 'No department'}
                  </Text>

                  <View className="mt-3 flex-row items-center">
                    <View className="rounded-full bg-blue-50 px-3 py-1.5">
                      <Text className="text-sm font-extrabold text-blue-600">
                        {user.role.toUpperCase()}
                      </Text>
                    </View>

                    <View className="ml-3 flex-row items-center rounded-full bg-emerald-50 px-3 py-1.5">
                      <View className={`mr-2 h-3 w-3 rounded-full ${user.isOnline ? 'bg-lime-500' : 'bg-slate-300'}`} />
                      <Text className="text-sm font-bold text-emerald-600">
                        {user.isOnline ? 'Online' : 'Offline'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="mt-4 flex-row justify-between">
              {[
                { label: 'Messages', value: String(details?.stats.messages ?? 0) },
                { label: 'Chats', value: String(details?.stats.conversations ?? 0) },
                { label: 'Role', value: user.role.toUpperCase() },
              ].map((stat) => (
                <View
                  key={stat.label}
                  className="w-[31.5%] rounded-[20px] bg-white px-3 py-4 shadow-sm shadow-slate-200"
                >
                  <Text className="text-2xl font-extrabold text-slate-900">{stat.value}</Text>
                  <Text className="mt-1 text-sm font-medium text-slate-400">{stat.label}</Text>
                </View>
              ))}
            </View>

            <Text className="mb-3 mt-5 text-base font-extrabold text-slate-900">Account Info</Text>
            <DetailRow icon="📧" label="Email" value={user.email} valueAccent="text-blue-600" />
            <DetailRow icon="📅" label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
            <DetailRow icon="📱" label="Last Seen" value={user.lastSeenAt ? new Date(user.lastSeenAt).toLocaleString() : 'Not available'} />
            <DetailRow icon="🔐" label="Faculty" value={user.faculty ?? 'Not set'} />

            <Text className="mb-3 mt-5 text-base font-extrabold text-slate-900">Admin Actions</Text>
            {adminActions.map((action) => (
              <Pressable
                key={action.label}
                className={`mb-3 flex-row items-center justify-between rounded-[22px] px-4 py-4 shadow-sm shadow-slate-200 ${action.tone}`}
              >
                <View className="flex-row items-center">
                  <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Text className="text-lg">{action.icon}</Text>
                  </View>
                  <Text className={`text-lg font-semibold ${action.accent}`}>{action.label}</Text>
                </View>

                <Text className="text-sm font-semibold text-slate-400">›</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
