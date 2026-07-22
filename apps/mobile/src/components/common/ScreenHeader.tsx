import { Text, View } from 'react-native';
import { BackButton } from '@/src/components/common/BackButton';

type Props = { title: string; onBackPress?: () => void; fallbackRoute?: string };

export function ScreenHeader({ title, onBackPress, fallbackRoute }: Props) {
  return (
    <View className="flex-row items-center bg-[#0A1628] px-5 pb-4 pt-5">
      <BackButton
        fallbackRoute={fallbackRoute ?? '/'}
        onPress={onBackPress}
        className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-white/10 active:bg-white/20"
      />
      <Text numberOfLines={1} className="flex-1 text-xl font-extrabold text-white">{title}</Text>
    </View>
  );
}



