import { Text, View } from 'react-native';
import { getInitials } from '@/src/utils/getInitials';

type Props = { name: string };

export function Avatar({ name }: Props) {
  return (
    <View className="h-12 w-12 items-center justify-center rounded-full bg-orange-400">
      <Text className="text-lg font-bold text-white">{getInitials(name)}</Text>
    </View>
  );
}



