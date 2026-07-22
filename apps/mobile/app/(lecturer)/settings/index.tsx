import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';

export default function LecturerSettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title="Settings" fallbackRoute="/(lecturer)/profile"/>

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
