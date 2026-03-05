import { Text, View } from "react-native";

export function QuickActions() {
  return (
    <View className="mt-4 flex-row flex-wrap gap-3">
      {["Chat", "Notices", "Courses", "Profile"].map((label) => (
        <View key={label} className="w-[48%] rounded-xl bg-slate-100 p-3">
          <Text className="font-semibold text-slate-800">{label}</Text>
        </View>
      ))}
    </View>
  );
}
