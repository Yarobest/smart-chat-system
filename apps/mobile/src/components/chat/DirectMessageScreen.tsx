import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { DateDivider } from '@/src/components/chat/DateDivider';
import { MessageBubble } from '@/src/components/chat/MessageBubble';
import { ChatInputBar } from '@/src/components/chat/ChatInputBar';

export default function DirectMessageScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Direct Message" />
      <View className="flex-1 px-4 py-2">
        <DateDivider label="Today" />
        <MessageBubble text="Hello there" />
        <MessageBubble text="Hi!" isMine />
      </View>
      <ChatInputBar />
    </SafeAreaView>
  );
}
