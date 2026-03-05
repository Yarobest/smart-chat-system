import { Text, View } from 'react-native';
import { Badge } from '@/src/components/common/Badge';

type Props = {
  title: string;
  preview: string;
  time: string;
  unreadCount?: number;
  avatar?: string;
  toneClass?: string;
  online?: boolean;
};

export function ChatListItem({
  title,
  preview,
  time,
  unreadCount = 0,
  avatar = '💬',
  toneClass = 'bg-slate-200',
  online = false,
}: Props) {
  return (
    <View className="flex-row items-center border-b border-slate-200 px-4 py-4">
      <View className="relative">
        <View className={`h-14 w-14 items-center justify-center rounded-full ${toneClass}`}>
          <Text className="text-lg">{avatar}</Text>
        </View>
        {online ? <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" /> : null}
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-lg font-bold text-slate-900">{title}</Text>
        <Text numberOfLines={1} className="text-sm text-slate-500">{preview}</Text>
      </View>
      <View className="items-end gap-1">
        <Text className="text-sm text-slate-400">{time}</Text>
        <Badge count={unreadCount} />
      </View>
    </View>
  );
}




