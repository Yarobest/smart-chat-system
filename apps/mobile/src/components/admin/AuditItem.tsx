import { Text, View } from 'react-native';

export function AuditItem({ action, actor }: { action: string; actor: string }) {
  return (
    <View className="border-b border-slate-200 py-3">
      <Text className="font-medium text-slate-900">{action}</Text>
      <Text className="text-lg text-slate-500">{actor}</Text>
    </View>
  );
}



