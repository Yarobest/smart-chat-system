import { Pressable, Text } from 'react-native';

type FilterChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  filled?: boolean;
};

export function FilterChip({ label, active, onPress, filled }: FilterChipProps) {
  const highlighted = active || filled;

  return (
    <Pressable
      onPress={onPress}
      className={`h-9 items-center justify-center rounded-full border px-4 ${highlighted ? 'border-blue-600 bg-blue-600' : 'border-slate-200 bg-white'}`}
    >
      <Text className={`text-sm font-semibold ${highlighted ? 'text-white' : 'text-slate-600'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
