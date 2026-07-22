import { ScrollView } from 'react-native';
import { FilterChip } from './FilterChip';

type FilterRowProps<T extends string> = {
  filters: readonly T[];
  active?: T;
  onSelect: (value: T) => void;
  filled?: boolean;
  counts?: Partial<Record<T, number>>;
};

export function FilterRow<T extends string>({
  filters,
  active,
  onSelect,
  filled = false,
  counts,
}: FilterRowProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-grow-0 border-b border-slate-200 bg-[#F7FAFF]"
      contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 10 }}
    >
      {filters.map((filter) => (
        <FilterChip
          key={filter}
          label={`${filter}${counts?.[filter] ? ` (${counts[filter]})` : ''}`}
          active={filter === active}
          filled={filled}
          onPress={() => onSelect(filter)}
        />
      ))}
    </ScrollView>
  );
}
