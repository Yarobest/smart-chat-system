import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { BackButton } from '@/src/components/common/BackButton';

type Props = { title: string; onBackPress?: () => void; fallbackRoute?: string };

function goBack(fallbackRoute?: string) {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace((fallbackRoute ?? '/') as never);
}

export function ScreenHeader({ title, onBackPress, fallbackRoute }: Props) {
  return (
    <View className="flex-row items-center bg-[#0A1628] px-5 pb-4 pt-5">
      <BackButton
        fallbackRoute={fallbackRoute ?? '/'}
        onPress={onBackPress ?? (() => goBack(fallbackRoute))}
        className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
      />
      <Text className="text-lg font-bold text-white">{title}</Text>
    </View>
  );
}



