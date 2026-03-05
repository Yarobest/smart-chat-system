import { Text, View } from 'react-native';

export function AnnouncementDetail({ title, body }: { title: string; body: string }) {
  return (
    <View className="p-4">
      <Text className="text-lg font-bold text-slate-900">{title}</Text>
      <Text className="mt-2 text-lg text-slate-700">{body}</Text>
    </View>
  );
}




