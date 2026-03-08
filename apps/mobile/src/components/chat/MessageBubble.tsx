import { Text, View } from 'react-native';

export function MessageBubble({ text, isMine = false }: { text: string; isMine?: boolean }) {
  return (
    <View className={`my-1 max-w-[80%] rounded-2xl px-3 py-2 ${isMine ? 'self-end bg-blue-600' : 'self-start bg-slate-200'}`}>
      <Text className={`${isMine ? 'text-white' : 'text-slate-800'}`}>{text}</Text>
    </View>
  );
}
