import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

type Item = {
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  active?: boolean;
  onPress?: () => void;
  badge?: number;
};
type Props = { items: Item[] };

export function BottomNav({ items }: Props) {
  return (
    <View className="flex-row items-center justify-around border-t border-slate-200 bg-white px-1 pb-3 pt-2">
      {items.map((item) => (
        <Pressable
          key={item.label}
          className="flex-1 items-center px-0.5"
          onPress={item.onPress}
        >
          <View className="relative">
            {item.badge && item.badge > 0 ? (
              <View className="absolute -right-1 -top-0.5 z-10 min-w-4 rounded-full bg-red-500 px-1 py-[1px]">
                <Text className="text-center text-sm font-bold text-white">
                  {item.badge}
                </Text>
              </View>
            ) : null}
            <Ionicons
              name={item.icon}
              size={24}
              color={item.active ? "#2563EB" : "#94A3B8"}
            />
          </View>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            className={`text-[11px] ${item.active ? "font-bold text-blue-600" : "font-semibold text-slate-400"}`}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
