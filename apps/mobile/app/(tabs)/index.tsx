import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeTabScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView className="px-5 pt-4" contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="text-xs font-semibold uppercase tracking-widest text-blue-700">
          Campus Smart Chat
        </Text>
        <Text className="mt-2 text-3xl font-bold text-slate-900">Welcome back</Text>
        <Text className="mt-1 text-sm text-slate-600">
          Ask questions, browse updates, and connect with your school community.
        </Text>

        <View className="mt-6 rounded-2xl bg-blue-600 p-5">
          <Text className="text-sm font-semibold text-blue-100">Quick action</Text>
          <Text className="mt-1 text-xl font-bold text-white">Start a new conversation</Text>
          <Pressable className="mt-4 self-start rounded-xl bg-white/95 px-4 py-2 active:bg-white/80">
            <Text className="text-sm font-semibold text-blue-700">Open Chat</Text>
          </Pressable>
        </View>

        <View className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <Text className="text-base font-semibold text-slate-900">Today</Text>
          <Text className="mt-1 text-sm text-slate-600">
            No new alerts. Your account is active and synced.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
