import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ChatTopBarProps = {
  title: string;
  subtitle: string;
  avatar: ReactNode;
  onBack: () => void;
  onSearch?: () => void;
  secondaryAction?: ReactNode;
};

export function ChatTopBar({
  title,
  subtitle,
  avatar,
  onBack,
  onSearch,
  secondaryAction,
}: ChatTopBarProps) {
  return (
    <View className="bg-[#051839] px-4 pb-4 pt-4">
      <View className="flex-row items-center">
        <Pressable onPress={onBack} className="mr-3 h-9 w-9 items-center justify-center rounded-full">
          <Ionicons name="chevron-back" size={20} color="white" />
        </Pressable>
        {avatar}
        <View className="ml-3 min-w-0 flex-1">
          <Text
            className="text-xl font-extrabold leading-6 text-white"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <Text className="text-sm text-white/70" numberOfLines={1} ellipsizeMode="tail">
            {subtitle}
          </Text>
        </View>
        {secondaryAction}
        {onSearch ? (
          <Pressable onPress={onSearch} className="ml-2 h-9 w-9 items-center justify-center rounded-full">
            <Ionicons name="search" size={20} color="white" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
