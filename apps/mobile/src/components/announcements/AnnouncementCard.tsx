import { Text, View } from 'react-native';

export function AnnouncementCard({ title, body }: { title: string; body: string }) {
  return (
    <View className="rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-4">
      <Text className="font-bold text-amber-900">{title}</Text>
      <Text className="mt-1 text-amber-800">{body}</Text>
    </View>
  );
}
