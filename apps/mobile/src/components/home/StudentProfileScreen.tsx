import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { BottomNav } from '@/src/components/common/BottomNav';

export default function StudentProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="flex-1 bg-white">
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 12 }} showsVerticalScrollIndicator={false}>
          <View className="bg-[#102B57] px-4 pb-6 pt-6">
            <View className="items-center">
              <View className="relative h-24 w-24 items-center justify-center rounded-full border-2 border-orange-300 bg-orange-500">
                <Text className="text-5xl font-bold text-white">SA</Text>
                <View className="absolute -bottom-0.5 -right-0.5 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-500">
                  <Text className="text-lg text-white">✏️</Text>
                </View>
              </View>
              <Text className="mt-4 text-xl font-extrabold text-white">Stephen Appiah</Text>
              <Text className="mt-1 text-sm text-slate-300">ID: 0323080542</Text>
              <View className="mt-3 rounded-full bg-amber-400 px-5 py-1.5">
                <Text className="text-sm font-bold tracking-wide text-[#4A3700]">STUDENT</Text>
              </View>
            </View>

            <View className="mt-5 flex-row overflow-hidden rounded-2xl border border-white/15 bg-white/10">
              <View className="flex-1 items-center py-4">
                <Text className="text-xl font-extrabold text-white">5</Text>
                <Text className="text-sm text-slate-300">Courses</Text>
              </View>
              <View className="w-px bg-white/10" />
              <View className="flex-1 items-center py-4">
                <Text className="text-xl font-extrabold text-white">248</Text>
                <Text className="text-sm text-slate-300">Messages</Text>
              </View>
              <View className="w-px bg-white/10" />
              <View className="flex-1 items-center py-4">
                <Text className="text-xl font-extrabold text-white">3</Text>
                <Text className="text-sm text-slate-300">Groups</Text>
              </View>
            </View>
          </View>

          <View className="bg-[#F5F7FA] px-4 py-4">
            <Text className="mb-3 text-sm font-extrabold tracking-wide text-slate-400">PERSONAL INFO</Text>

            <View className="mb-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-md bg-violet-100">
                  <Text className="text-base">📧</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-slate-400">Email</Text>
                  <Text className="text-lg font-semibold text-slate-900" numberOfLines={1}>stephen@htu.edu.gh</Text>
                </View>
              </View>
            </View>

            <View className="mb-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-md bg-violet-100">
                  <Text className="text-base">🏛️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-slate-400">Department</Text>
                  <Text className="text-lg font-semibold text-slate-900" numberOfLines={1}>Computer Science</Text>
                </View>
              </View>
            </View>

            <View className="mb-5 rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-md bg-violet-100">
                  <Text className="text-base">🗓️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-slate-400">Year</Text>
                  <Text className="text-lg font-semibold text-slate-900" numberOfLines={1}>HND Year 2 · 2024/2025</Text>
                </View>
              </View>
            </View>

            <Text className="mb-3 text-sm font-extrabold tracking-wide text-slate-400">QUICK LINKS</Text>

            {[
              { label: 'My Courses', icon: '📚' },
              { label: 'Settings', icon: '⚙️' },
            ].map((item) => (
              <Pressable key={item.label} className="mb-3 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <View className="flex-row items-center gap-3">
                  <View className="h-8 w-8 items-center justify-center rounded-md bg-violet-100">
                    <Text className="text-base">{item.icon}</Text>
                  </View>
                  <Text className="text-lg font-semibold text-slate-900">{item.label}</Text>
                </View>
                <Text className="text-sm text-slate-400">›</Text>
              </Pressable>
            ))}

            <Pressable className="mb-2 flex-row items-center justify-between rounded-2xl border border-red-100 bg-red-50 px-4 py-4">
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

        <BottomNav
          items={[
            { label: 'Home', icon: '🏠', onPress: () => router.replace('/(student)/home') },
            { label: 'Chats', icon: '💬', badge: 12, onPress: () => router.replace('/(student)/chats') },
            { label: 'Notices', icon: '📢', onPress: () => router.replace('/(student)/announcements') },
            { label: 'Profile', icon: '👤', active: true, onPress: () => router.replace('/(student)/profile') },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}




