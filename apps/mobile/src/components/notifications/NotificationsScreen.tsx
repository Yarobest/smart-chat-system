import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from '@/src/components/common/StatusBar';
import { useNotifications } from '@/src/hooks/useNotifications';
import { markNotificationsRead } from '@/src/stores/notificationStore';
import { formatTime } from '@/src/utils/formatTime';
import { useAuth } from '@/src/hooks/useAuth';

export default function NotificationsScreen() {
  const { items } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    markNotificationsRead();
  }, []);

  const backRoute = user?.role === 'lecturer' ? '/(lecturer)/home' : '/(student)/home';

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="flex-row items-center bg-[#051839] px-4 py-4">
        <Pressable
          onPress={() => router.replace(backRoute as any)}
          className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10"
        >
          <Ionicons name="chevron-back" size={20} color="white" />
        </Pressable>
        <View>
          <Text className="text-xl font-extrabold text-white">Notifications</Text>
          <Text className="text-sm text-white/60">Account and chat activity</Text>
        </View>
      </View>

      <ScrollView className="flex-1 bg-[#F3F5F8]" contentContainerStyle={{ padding: 16 }}>
        {items.map((item) => (
          <View
            key={item.id}
            className="mb-3 rounded-2xl border border-slate-200 bg-white px-4 py-4"
          >
            <View className="flex-row items-start">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Ionicons name="notifications-outline" size={18} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-extrabold text-slate-900">{item.title}</Text>
                <Text className="mt-1 text-sm text-slate-600">{item.body}</Text>
                <Text className="mt-2 text-xs text-slate-400">{formatTime(item.createdAt)}</Text>
              </View>
            </View>
          </View>
        ))}

        {items.length === 0 ? (
          <View className="items-center py-16">
            <Text className="text-4xl">🔔</Text>
            <Text className="mt-3 text-base font-bold text-slate-600">No notifications yet</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
