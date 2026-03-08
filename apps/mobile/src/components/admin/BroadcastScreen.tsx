import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { PrimaryButton } from '@/src/components/common/PrimaryButton';

export default function BroadcastScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Campus Broadcast" />
      <View className="p-4">
        <Text className="mb-3 text-slate-700">Send a campus-wide message.</Text>
        <PrimaryButton label="Send Broadcast" />
      </View>
    </SafeAreaView>
  );
}
