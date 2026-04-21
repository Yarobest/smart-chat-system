import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav } from '@/src/components/common/BottomNav';
import { StatusBar } from '@/src/components/common/StatusBar';

const filters = ['All', 'Students', 'Lecturers', 'Suspended'] as const;

const summary = [
  {
    label: '3 Alerts',
    icon: '🚨',
    container: 'bg-rose-50',
    text: 'text-rose-500',
  },
  {
    label: '1 Pending',
    icon: '⏳',
    container: 'bg-amber-50',
    text: 'text-amber-500',
  },
  {
    label: '1,244 Active',
    icon: '✅',
    container: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
] as const;

const users = [
  {
    initials: 'SA',
    avatarColor: 'bg-[#3B6AE3]',
    name: 'Stephen Appiah',
    meta: '0323080542 · Student · CS ·',
    statusDot: 'bg-lime-500',
    statusText: 'Online',
    rowBg: 'bg-white',
    actions: ['👁️', '✉️', '🚫'],
  },
  {
    initials: 'RG',
    avatarColor: 'bg-[#4CB37C]',
    name: 'Rudolf S. K. Gavor',
    meta: '0323080246 · Student · CS ·',
    statusDot: 'bg-lime-500',
    statusText: 'Online',
    rowBg: 'bg-white',
    actions: ['👁️', '✉️', '🚫'],
  },
  {
    initials: 'GA',
    avatarColor: 'bg-[#E79B2C]',
    name: 'Mr. George Agordzo',
    meta: 'STAFF-001 · Lecturer · CS ·',
    statusDot: 'bg-lime-500',
    statusText: 'Online',
    rowBg: 'bg-white',
    actions: ['👁️', '✉️', '🚫'],
  },
  {
    initials: 'AY',
    avatarColor: 'bg-[#4294DB]',
    name: 'Ama Yeboah',
    meta: '0323080421 · Student · CS ·',
    statusDot: 'bg-amber-500',
    statusText: 'Pending',
    rowBg: 'bg-white',
    actions: ['⏳', '✅', '✕'],
  },
  {
    initials: 'KA',
    avatarColor: 'bg-[#DF5147]',
    name: 'Kofi Agyemang',
    meta: '0323080310 · Student · CS ·',
    statusDot: 'bg-red-500',
    statusText: 'Suspended',
    rowBg: 'bg-[#FFF7F7]',
    actions: ['🔴', '👁️', '✅'],
  },
] as const;

function ActionButton({ icon }: { icon: string }) {
  return (
    <Pressable className="ml-2 h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 active:bg-slate-200">
      <Text className="text-sm">{icon}</Text>
    </Pressable>
  );
}

export default function UserManagementScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return true;

    return (
      user.name.toLowerCase().includes(query) ||
      user.meta.toLowerCase().includes(query) ||
      user.statusText.toLowerCase().includes(query)
    );
  });

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
              <Text className="-mt-3 text-3xl font-extrabold text-white">User Management</Text>
              <Text className="mt-1 text-sm font-medium text-white/65">
                1,248 users · 3 suspended
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

            <View className="mt-5 flex-row items-center justify-between">
              {filters.map((filter, index) => {
                const active = index === 0;
                return (
                  <Pressable
                    key={filter}
                    className={`flex-1 items-center rounded-full border py-3 ${
                      active
                        ? 'border-blue-600 bg-[#3D6EE8]'
                        : 'border-slate-200 bg-[#EEF3FB]'
                    } ${index === 0 ? '' : 'ml-2'}`}
                  >
                    <Text
                      className={`text-sm font-bold ${
                        active ? 'text-white' : 'text-slate-600'
                      }`}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="border-t border-slate-200 bg-[#FBFCFF] px-4 py-3">
            <View className="flex-row flex-wrap justify-between">
              {summary.map((item) => (
                <View
                  key={item.label}
                  className={`mb-2 rounded-full px-4 py-2 ${item.container}`}
                >
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
                key={user.name}
                className={`flex-row items-center border-b border-slate-100 px-4 py-4 ${user.rowBg}`}
              >
                <View
                  className={`mr-4 h-16 w-16 items-center justify-center rounded-full ${user.avatarColor}`}
                >
                  <Text className="text-sm font-extrabold text-white">{user.initials}</Text>
                </View>

                <View className="flex-1">
                  <Text className="text-base font-extrabold text-slate-900">{user.name}</Text>
                  <Text className="mt-1 text-sm text-slate-400">{user.meta}</Text>

                  <View className="mt-1 flex-row items-center">
                    <View className={`mr-2 h-4 w-4 rounded-full ${user.statusDot}`} />
                    <Text className="text-sm text-slate-400">{user.statusText}</Text>
                  </View>
                </View>

                <View className="ml-3 flex-row items-center">
                  {user.actions.map((action, index) => (
                    <ActionButton key={`${user.name}-${index}`} icon={action} />
                  ))}
                </View>
              </View>
            ))}

            {filteredUsers.length === 0 ? (
              <View className="items-center px-4 py-10">
                <Text className="text-sm font-semibold text-slate-500">No users found</Text>
                <Text className="mt-1 text-sm text-slate-400">
                  Try another name, ID, or department.
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <BottomNav
          items={[
            { label: 'Home', icon: '🏠', onPress: () => router.replace('/(admin)/dashboard') },
            { label: 'Users', icon: '👥', active: true, onPress: () => router.replace('/(admin)/users') },
            { label: 'Reports', icon: '📊', badge: 3, onPress: () => router.replace('/(admin)/audit') },
            { label: 'Settings', icon: '⚙️', onPress: () => router.replace('/(admin)/broadcast') },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}
