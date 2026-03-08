import { Pressable, TextInput, View } from 'react-native';

export function ChatInputBar() {
  return (
    <View className="flex-row items-center gap-2 border-t border-slate-200 p-3">
      <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"><View /></Pressable>
      <TextInput placeholder="Type a message" className="flex-1 rounded-xl border border-slate-200 px-3 py-2" />
      <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-blue-600"><View /></Pressable>
    </View>
  );
}
