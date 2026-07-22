import { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  right?: ReactNode;
};

export function AdminPageHeader({ title, subtitle, right }: Props) {
  return (
    <View className="bg-[#051839] px-5 pb-5 pt-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-xl font-extrabold text-white" numberOfLines={1}>
            {title}
          </Text>
          <Text
            className="mt-1 text-sm font-medium text-white/65"
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        </View>
        {right}
      </View>
    </View>
  );
}
