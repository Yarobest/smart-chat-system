import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { goBackOrReplace } from '@/src/utils/navigation';

type Props = {
  fallbackRoute: string;
  color?: string;
  className?: string;
  onPress?: () => void;
};

export function BackButton({
  fallbackRoute,
  color = 'white',
  className = 'mr-3 h-9 w-9 items-center justify-center rounded-xl bg-white/10 active:bg-white/20',
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress ?? (() => goBackOrReplace(fallbackRoute))}
      className={className}
      hitSlop={8}
    >
      <Ionicons name="chevron-back" size={20} color={color} />
    </Pressable>
  );
}
