import { Text, View } from 'react-native';

export function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View className="min-w-5 rounded-full bg-blue-600 px-1.5 py-0.5">
      <Text className="text-center text-sm font-bold text-white">{count}</Text>
    </View>
  );
}



