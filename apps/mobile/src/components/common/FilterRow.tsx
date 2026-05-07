import { ScrollView, View } from 'react-native';
import { FilterChip } from './FilterChip';

export function FilterRow({ filters, active, onSelect }: { filters: string[]; active: string; onSelect: (value: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row px-4 py-3">
        {filters.map((filter) => (
          <View key={filter} className="mr-2">
            <FilterChip label={filter} active={filter === active} onPress={() => onSelect(filter)} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
