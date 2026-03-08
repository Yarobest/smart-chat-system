import { TextInput, View } from 'react-native';

export function SearchBar({ placeholder = 'Search...' }: { placeholder?: string }) {
  return (
    <View className="mx-4 mt-4 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3">
      <TextInput placeholder={placeholder} placeholderTextColor="#94A3B8" />
    </View>
  );
}
