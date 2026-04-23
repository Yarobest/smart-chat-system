import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAdminUserById } from '@/src/components/admin/adminUsers';
import { StatusBar } from '@/src/components/common/StatusBar';

const accountInfoRows = [
  { key: 'email', label: 'Email', icon: '📧' },
  { key: 'joined', label: 'Joined', icon: '📅' },
  { key: 'lastLogin', label: 'Last Login', icon: '📱' },
  { key: 'twoFactor', label: '2FA', icon: '🔐' },
] as const;

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
  const user = getAdminUserById(params.id);

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-[#203765]" edges={['top']}>
        <StatusBar style="light" backgroundColor="#203765" />
        <View className="flex-1 items-center justify-center bg-[#F3F6FD] px-6">
          <Text className="text-lg font-semibold text-slate-700">User not found</Text>
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
                <View className={`h-20 w-20 items-center justify-center rounded-full ${user.avatarColor}`}>
                  <Text className="text-2xl font-extrabold text-white">{user.initials}</Text>
                </View>

                <View className="ml-4 flex-1">
                  <Text className="text-2xl font-extrabold text-slate-900">{user.name}</Text>
                  <Text className="mt-1 text-sm text-slate-400">
                    ID: {user.identifier} · {user.department}
                  </Text>

                  <View className="mt-3 flex-row items-center">
                    <View className="rounded-full bg-blue-50 px-3 py-1.5">
                      <Text className="text-sm font-extrabold text-blue-600">
                        {user.role.toUpperCase()}
                      </Text>
                    </View>

                    <View className="ml-3 flex-row items-center rounded-full bg-emerald-50 px-3 py-1.5">
                      <View className={`mr-2 h-3 w-3 rounded-full ${user.statusDot}`} />
                      <Text className="text-sm font-bold text-emerald-600">{user.statusText}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="mt-4 flex-row justify-between">
              {user.stats.map((stat) => (
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
            {accountInfoRows.map((row) => {
              const value = user[row.key];
              return (
                <DetailRow
                  key={row.key}
                  icon={row.icon}
                  label={row.label}
                  value={value}
                  valueAccent={row.key === 'email' ? 'text-blue-600' : undefined}
                />
              );
            })}

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
