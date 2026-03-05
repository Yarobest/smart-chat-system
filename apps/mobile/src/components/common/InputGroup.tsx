import type React from 'react';
import { Text, View } from 'react-native';

export function InputGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-lg font-semibold text-slate-600">{label}</Text>
      {children}
    </View>
  );
}



