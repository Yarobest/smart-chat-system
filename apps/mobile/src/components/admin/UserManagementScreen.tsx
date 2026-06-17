import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AdminBottomNav } from '@/src/components/common/AdminBottomNav';
import { StatusBar } from '@/src/components/common/StatusBar';
import { AdminUser, adminService } from '@/src/services/admin.service';
import { getInitials } from '@/src/utils/getInitials';

const filters = ['All', 'Students', 'Lecturers', 'Suspended', 'Pending'] as const;

function ActionButton({ icon, onPress }: { icon: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="ml-2 h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 active:bg-slate-200"
    >
      <Text className="text-sm">{icon}</Text>
    </Pressable>
  );
}

export default function UserManagementScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    adminService
      .users()
      .then((data) => {
        if (mounted) {
          setUsers(data.users);
          setTotal(data.total);
          setError('');
        }
      })
      .catch((caught) => {
        if (mounted) {
          setError(caught instanceof Error ? caught.message : 'Unable to load users');
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const studentsCount = users.filter((user) => user.role === 'student').length;
  const lecturersCount = users.filter((user) => user.role === 'lecturer').length;
  const onlineCount = users.filter((user) => user.isOnline).length;

  const summary = [
    {
      label: `${studentsCount} Students`,
      icon: '🎓',
      container: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      label: `${lecturersCount} Lecturers`,
      icon: '👨‍🏫',
      container: 'bg-amber-50',
      text: 'text-amber-600',
    },
    {
      label: `${onlineCount} Online`,
      icon: '✅',
      container: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
  ] as const;

  const filteredUsers = useMemo(() => users.filter((user) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesFilter =
      activeFilter === 'All'
        ? true
        : activeFilter === 'Students'
          ? user.role === 'student'
          : activeFilter === 'Lecturers'
            ? user.role === 'lecturer'
            : activeFilter === 'Suspended'
              ? false
              : false;

    if (!matchesFilter) return false;
    if (!query) return true;

    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.studentId ?? '').toLowerCase().includes(query) ||
      (user.staffId ?? '').toLowerCase().includes(query) ||
      (user.department ?? '').toLowerCase().includes(query)
    );
  }), [activeFilter, searchQuery, users]);

  return (
    <SafeAreaView className="flex-1 bg-[#203765]" edges={['top']}>
      <StatusBar style="light" backgroundColor="#203765" />

      <View className="flex-1 bg-[#F3F6FD]">
        <View
          className="bg-[#203765] px-5 pb-5"
          style={{ paddingTop: Math.max(insets.top, 4) }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="-mt-3 text-2xl font-extrabold text-white">User Management</Text>
              <Text className="mt-1 text-sm font-medium text-white/65">
                {loading ? 'Loading live users...' : `${total} users · ${onlineCount} online`}
              </Text>
            </View>

            <Pressable className="h-11 w-11 items-center justify-center rounded-2xl bg-white/10 active:bg-white/20">
              <Text className="text-xl font-light text-[#E3B85A]">+</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white px-4 pb-6 pt-4">
            <View className="flex-row items-center rounded-[22px] border border-slate-200 bg-[#F4F7FD] px-4 py-3">
              <Text className="mr-3 text-xl text-slate-400">⌕</Text>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by name, ID or dept..."
                placeholderTextColor="#94A3B8"
                className="flex-1 text-sm text-slate-700"
                autoCapitalize="none"
                returnKeyType="search"
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-5">
              {filters.map((filter, index) => {
                const active = activeFilter === filter;

                return (
                  <Pressable
                    key={filter}
                    onPress={() => setActiveFilter(filter)}
                    className={`items-center rounded-full border px-5 py-3 ${
                      active ? 'border-blue-600 bg-[#3D6EE8]' : 'border-slate-200 bg-[#EEF3FB]'
                    } ${index === 0 ? '' : 'ml-2'}`}
                  >
                    <Text className={`text-sm font-bold ${active ? 'text-white' : 'text-slate-600'}`}>
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View className="border-t border-slate-200 bg-[#FBFCFF] px-4 py-3">
            <View className="flex-row flex-wrap justify-between">
              {summary.map((item) => (
                <View key={item.label} className={`mb-2 rounded-full px-4 py-2 ${item.container}`}>
                  <Text className={`text-sm font-bold ${item.text}`}>
                    {item.icon} {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="bg-white">
            {filteredUsers.map((user) => (
              <View
                key={user.id}
                className="flex-row items-center border-b border-slate-100 bg-white px-4 py-4"
              >
                <View className="flex-1 flex-row items-center">
                  <View
                    className="mr-4 h-16 w-16 items-center justify-center rounded-full bg-[#3B6AE3]"
                  >
                    <Text className="text-sm font-extrabold text-white">
                      {getInitials(user.name)}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-base font-extrabold text-slate-900">{user.name}</Text>
                    <Text className="mt-1 text-sm text-slate-400">
                      {user.studentId ?? user.staffId ?? user.email} · {user.role} · {user.department ?? 'No department'}
                    </Text>

                    <View className="mt-1 flex-row items-center">
                      <View className={`mr-2 h-4 w-4 rounded-full ${user.isOnline ? 'bg-lime-500' : 'bg-slate-300'}`} />
                      <Text className="text-sm text-slate-400">{user.isOnline ? 'Online' : 'Offline'}</Text>
                    </View>
                  </View>
                </View>

                <View className="ml-3 flex-row items-center">
                  <ActionButton icon="👁️" onPress={() => router.push(`/(admin)/users/${user.id}` as never)} />
                  <ActionButton icon="✉️" />
                </View>
              </View>
            ))}

            {filteredUsers.length === 0 ? (
              <View className="items-center px-4 py-10">
                <Text className="text-sm font-semibold text-slate-500">
                  {error || (loading ? 'Loading users...' : 'No users found')}
                </Text>
                <Text className="mt-1 text-sm text-slate-400">
                  Try another name, ID, or department.
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <AdminBottomNav active="users" />
      </View>
    </SafeAreaView>
  );
}
