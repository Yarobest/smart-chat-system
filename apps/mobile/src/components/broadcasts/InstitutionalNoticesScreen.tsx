import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "../common/StatusBar";
import { ScreenHeader } from "../common/ScreenHeader";
import { FilterRow } from "../common/FilterRow";
import { useAuth } from "@/src/hooks/useAuth";
import { broadcastService } from "@/src/services/broadcast.service";
import { InstitutionalBroadcast } from "@/src/types/broadcast.types";
export default function InstitutionalNoticesScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<InstitutionalBroadcast[]>([]),
    [loading, setLoading] = useState(true),
    [active, setActive] = useState("All");
  useFocusEffect(
    useCallback(() => {
      let live = true;
      broadcastService
        .list()
        .then((x) => live && setItems(x))
        .finally(() => live && setLoading(false));
      return () => {
        live = false;
      };
    }, []),
  );
  const visible = items.filter(
    (x) =>
      active === "All" ||
      (active === "Unread" && !x.isRead) ||
      (active === "Important" && x.priority !== "normal") ||
      (active === "Archived" && x.status === "archived"),
  );
  const prefix = user?.role === "lecturer" ? "/(lecturer)" : "/(student)";
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader
        title="Institutional Notices"
        fallbackRoute={`${prefix}/home`}
      />
      <FilterRow
        filters={["All", "Unread", "Important", "Archived"]}
        active={active}
        counts={{ Unread: items.filter((x) => !x.isRead).length }}
        onSelect={setActive}
      />
      <ScrollView
        className="flex-1 bg-[#F5F7FA]"
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 30 }}
      >
        {loading ? <ActivityIndicator color="#2563EB" /> : null}
        {visible.map((x) => (
          <Pressable
            key={x.id}
            onPress={() => router.push(`${prefix}/broadcasts/${x.id}` as any)}
            className={`rounded-2xl border-l-4 bg-white p-4 ${x.priority === "urgent" ? "border-l-red-500" : x.priority === "important" ? "border-l-amber-500" : "border-l-blue-500"}`}
          >
            <View className="flex-row justify-between gap-2">
              <Text className="flex-1 text-base font-extrabold text-slate-900">
                {x.pinned ? "📌 " : ""}
                {x.title}
              </Text>
              {!x.isRead ? (
                <Text className="rounded-lg bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
                  NEW
                </Text>
              ) : null}
            </View>
            <Text
              numberOfLines={3}
              className="mt-2 text-sm leading-5 text-slate-600"
            >
              {x.body}
            </Text>
            <Text className="mt-3 text-xs text-slate-400">
              {x.priority.toUpperCase()} ·{" "}
              {new Date(x.publishedAt ?? x.createdAt).toLocaleString()}
            </Text>
            {x.attachments.length ? (
              <Text className="mt-2 text-xs text-blue-600">
                📎 {x.attachments.length} attachment
                {x.attachments.length === 1 ? "" : "s"}
              </Text>
            ) : null}
          </Pressable>
        ))}
        {!loading && !visible.length ? (
          <View className="items-center py-16">
            <Text className="text-4xl">📭</Text>
            <Text className="mt-3 text-base font-bold text-slate-500">
              No institutional notices here
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
