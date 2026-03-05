import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';

export default function LecturerProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Lecturer Profile" />
      <View className="p-4"><Text className="text-slate-700">Lecturer profile details</Text></View>
    </SafeAreaView>
  );
}
