import { useCallback, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/hooks/useAuth";
import { broadcastService } from "@/src/services/broadcast.service";
import { InstitutionalBroadcast } from "@/src/types/broadcast.types";
export function BroadcastHomeBanner() {
  const { user } = useAuth();
  const [item, setItem] = useState<InstitutionalBroadcast | null>(null);
  useFocusEffect(
    useCallback(() => {
      let live = true;
      broadcastService
        .list()
        .then(
          (x) =>
            live &&
            setItem(x.find((n) => !n.isRead && !n.alertDismissed) ?? null),
        )
        .catch(() => undefined);
      return () => {
        live = false;
      };
    }, []),
  );
  if (!item) return null;
  const prefix = user?.role === "lecturer" ? "/(lecturer)" : "/(student)";
  const dismiss = async () => {
    const current = item;
    setItem(null);
    await broadcastService.dismiss(current.id).catch(() => {
      setItem(current);
      Alert.alert("Could not dismiss notice", "Please try again.");
    });
  };
  return (
    <View
      className={`mb-4 rounded-2xl border p-4 ${item.priority === "urgent" ? "border-red-300 bg-red-50" : item.priority === "important" ? "border-amber-300 bg-amber-50" : "border-blue-200 bg-blue-50"}`}
    >
      <View className="flex-row items-start">
        <Text className="mr-3 text-2xl">📣</Text>
        <Pressable
          className="flex-1"
          onPress={() => router.push(`${prefix}/broadcasts/${item.id}` as any)}
        >
          <Text className="text-xs font-extrabold uppercase text-slate-500">
            Institutional notice
          </Text>
          <Text
            numberOfLines={1}
            className="mt-1 text-base font-extrabold text-slate-900"
          >
            {item.title}
          </Text>
          <Text numberOfLines={2} className="mt-1 text-sm text-slate-600">
            {item.body}
          </Text>
        </Pressable>
        <Pressable onPress={() => void dismiss()} hitSlop={8}>
          <Ionicons name="close" size={20} color="#64748B" />
        </Pressable>
      </View>
    </View>
  );
}
