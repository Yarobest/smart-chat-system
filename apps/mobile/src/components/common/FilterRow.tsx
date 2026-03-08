import { ScrollView, View } from 'react-native';
import { FilterChip } from './FilterChip';

export function FilterRow({ filters, active, onSelect }: { filters: string[]; active: string; onSelect: (value: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2 px-4 py-3">
        {filters.map((filter) => (
          <FilterChip key={filter} label={filter} active={filter === active} onPress={() => onSelect(filter)} />
        ))}
      </View>
    </ScrollView>
  );
}
