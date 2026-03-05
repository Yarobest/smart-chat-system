import { Text, View } from 'react-native';

export function AnnouncementBanner({ text }: { text: string }) {
  return (
    <View className="rounded-2xl bg-amber-100 p-4">
      <Text className="font-semibold text-amber-900">{text}</Text>
    </View>
  );
}
