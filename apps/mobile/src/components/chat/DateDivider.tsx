import { Text, View } from 'react-native';

export function DateDivider({ label }: { label: string }) {
  return (
    <View className="my-3 items-center">
      <Text className="rounded-full bg-slate-200 px-3 py-1 text-lg text-slate-500">{label}</Text>
    </View>
  );
}



