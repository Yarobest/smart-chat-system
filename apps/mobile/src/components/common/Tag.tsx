import { Text, View } from 'react-native';

export function Tag({ label, tone = 'blue' }: { label: string; tone?: 'green' | 'blue' | 'red' }) {
  const styles = tone === 'green' ? 'bg-emerald-100 text-emerald-700' : tone === 'red' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700';
  return (
    <View className="self-start rounded-full px-2 py-1">
      <Text className={`text-sm font-semibold ${styles}`}>{label}</Text>
    </View>
  );
}



