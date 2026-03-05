import { Text, View } from 'react-native';

export function AdminStatCard({ title, value }: { title: string; value: string }) {
  return (
    <View className="flex-1 rounded-xl bg-slate-100 p-4">
      <Text className="text-lg text-slate-500">{title}</Text>
      <Text className="mt-1 text-lg font-bold text-slate-900">{value}</Text>
    </View>
  );
}




