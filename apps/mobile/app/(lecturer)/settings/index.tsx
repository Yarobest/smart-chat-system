import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';

export default function LecturerSettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="bg-[#051839] px-4 pb-5 pt-6">
        <Pressable onPress={() => router.back()} className="flex-row items-center">
          <Text className="text-2xl text-white">‹</Text>
          <Text className="ml-1 text-2xl font-bold text-white">Settings</Text>
        </Pressable>
      </View>

      <View className="flex-1 bg-[#F5F7FA] px-4 py-10">
        <View className="rounded-3xl bg-white p-6 shadow-sm">
          <Text className="text-base font-semibold text-slate-900">Settings</Text>
          <Text className="mt-3 text-sm text-slate-500">
            This page is your lecturer settings hub. More options will be added shortly.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
