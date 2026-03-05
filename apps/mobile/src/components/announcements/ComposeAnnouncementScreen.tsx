import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { PrimaryButton } from '@/src/components/common/PrimaryButton';

export default function ComposeAnnouncementScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Compose Announcement" />
      <View className="p-4">
        <Text className="mb-3 text-slate-700">Draft your message and publish to students.</Text>
        <PrimaryButton label="Publish" />
      </View>
    </SafeAreaView>
  );
}
