import { Pressable, Text } from 'react-native';

export function PrimaryButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} className="items-center rounded-xl bg-blue-600 px-4 py-4 active:bg-blue-700">
      <Text className="font-bold text-white">{label}</Text>
    </Pressable>
  );
}
