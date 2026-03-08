import { Pressable, Text } from 'react-native';

export function FilterChip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} className={`rounded-full border px-4 py-2 ${active ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-slate-100'}`}>
      <Text className={`${active ? 'text-white' : 'text-slate-700'} font-semibold`}>{label}</Text>
    </Pressable>
  );
}
