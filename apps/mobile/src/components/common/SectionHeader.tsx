import { Pressable, Text, View } from 'react-native';

export function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <View className="mb-2 mt-6 flex-row items-center justify-between px-4">
      <Text className="text-lg font-bold text-slate-900">{title}</Text>
      {onSeeAll ? (
        <Pressable onPress={onSeeAll}><Text className="font-semibold text-blue-600">See All</Text></Pressable>
      ) : null}
    </View>
  );
}


