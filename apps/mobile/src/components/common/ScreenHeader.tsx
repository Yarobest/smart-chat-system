import { Pressable, Text, View } from 'react-native';

type Props = { title: string; onBackPress?: () => void };

export function ScreenHeader({ title, onBackPress }: Props) {
  return (
    <View className="flex-row items-center bg-[#0A1628] px-5 pb-4 pt-5">
      <Pressable onPress={onBackPress} className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10">
        <Text className="text-white">←</Text>
      </Pressable>
      <Text className="text-lg font-bold text-white">{title}</Text>
    </View>
  );
}



