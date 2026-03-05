import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';

export default function LecturerGroupsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Course Groups" />
      <View className="p-4"><Text className="text-slate-700">Lecturer groups list</Text></View>
    </SafeAreaView>
  );
}
