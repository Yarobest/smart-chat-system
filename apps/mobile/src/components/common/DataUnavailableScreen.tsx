import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "./ScreenHeader";
import { StatusBar } from "./StatusBar";

export function DataUnavailableScreen({
  title,
  fallbackRoute,
  message = "No live backend data is available for this page yet.",
}: {
  title: string;
  fallbackRoute: string;
  message?: string;
}) {
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title={title} fallbackRoute={fallbackRoute} />
      <View className="flex-1 items-center justify-center bg-[#F5F7FA] px-8">
        <Ionicons name="folder-open-outline" size={48} color="#94A3B8" />
        <Text className="mt-4 text-center text-base font-extrabold text-slate-800">
          Nothing to display yet
        </Text>
        <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
          {message}
        </Text>
      </View>
    </SafeAreaView>
  );
}
