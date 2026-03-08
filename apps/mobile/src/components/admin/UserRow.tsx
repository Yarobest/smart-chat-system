import { Text, View } from 'react-native';

export function UserRow({ name, role }: { name: string; role: string }) {
  return (
    <View className="flex-row items-center justify-between border-b border-slate-200 py-3">
      <Text className="font-medium text-slate-900">{name}</Text>
      <Text className="text-lg text-slate-500">{role}</Text>
    </View>
  );
}



