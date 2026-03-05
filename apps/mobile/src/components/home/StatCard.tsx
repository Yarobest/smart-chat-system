import { Text, View } from 'react-native';

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 rounded-2xl border border-white/20 bg-white/10 p-4">
      <Text className="text-lg font-extrabold text-orange-300">{value}</Text>
      <Text className="mt-1 text-lg text-white/80">{label}</Text>
    </View>
  );
}




