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
import { AdminBottomNav } from "../common/AdminBottomNav";
import { FilterRow } from "../common/FilterRow";
import { broadcastService } from "@/src/services/broadcast.service";
import { InstitutionalBroadcast } from "@/src/types/broadcast.types";
export default function BroadcastManagementScreen() {
  const [items, setItems] = useState<InstitutionalBroadcast[]>([]),
    [loading, setLoading] = useState(true),
    [active, setActive] = useState("All");
  useFocusEffect(
    useCallback(() => {
      let live = true;
      setLoading(true);
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
    (x) => active === "All" || x.status === active.toLowerCase(),
  );
  const published = items.filter((x) => x.status === "published");
  const delivered = published.reduce((s, x) => s + x.recipientCount, 0),
    reads = published.reduce((s, x) => s + x.readCount, 0);
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="bg-[#051839] px-5 pb-5 pt-5">
        <Text className="text-xl font-extrabold text-white">
          Institutional Broadcasts
        </Text>
        <Text className="mt-1 text-sm text-white/60">
          Official communication across the school
        </Text>
      </View>
      <FilterRow
        filters={["All", "Draft", "Scheduled", "Published", "Archived"]}
        active={active}
        counts={{
          Draft: items.filter((x) => x.status === "draft").length,
          Scheduled: items.filter((x) => x.status === "scheduled").length,
        }}
        onSelect={setActive}
      />
      <ScrollView
        className="flex-1 bg-[#F5F7FA]"
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 28 }}
      >
        <View className="rounded-2xl bg-[#0B2A59] p-4">
          <Text className="text-xs font-extrabold uppercase text-blue-200">
            Broadcast overview
          </Text>
          <View className="mt-3 flex-row">
            <View className="flex-1">
              <Text className="text-2xl font-extrabold text-white">
                {items.length}
              </Text>
              <Text className="text-xs text-blue-100">Total</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-extrabold text-white">
                {delivered}
              </Text>
              <Text className="text-xs text-blue-100">Delivered</Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-2xl font-extrabold text-white">
                {delivered ? Math.round((reads / delivered) * 100) : 0}%
              </Text>
              <Text className="text-xs text-blue-100">Read rate</Text>
            </View>
          </View>
        </View>
        <Pressable
          onPress={() => router.push("/(admin)/broadcast/create" as any)}
          className="items-center rounded-lg bg-blue-600 py-3"
        >
          <Text className="text-base font-bold text-white">
            + Create Broadcast
          </Text>
        </Pressable>
        {loading ? <ActivityIndicator color="#2563EB" /> : null}
        {visible.map((x) => (
          <Pressable
            key={x.id}
            onPress={() => router.push(`/(admin)/broadcast/${x.id}` as any)}
            className={`rounded-2xl border-l-4 bg-white p-4 ${x.priority === "urgent" ? "border-l-red-500" : x.priority === "important" ? "border-l-amber-500" : "border-l-blue-500"}`}
          >
            <View className="flex-row justify-between gap-2">
              <Text
                numberOfLines={2}
                className="flex-1 text-base font-extrabold text-slate-900"
              >
                {x.pinned ? "📌 " : ""}
                {x.title}
              </Text>
              <Text className="text-xs font-bold uppercase text-blue-700">
                {x.status}
              </Text>
            </View>
            <Text
              numberOfLines={2}
              className="mt-2 text-sm leading-5 text-slate-600"
            >
              {x.body}
            </Text>
            <Text className="mt-3 text-xs text-slate-400">
              {x.audienceLabel} · {x.readCount}/{x.recipientCount} reads
            </Text>
          </Pressable>
        ))}
        {!loading && !visible.length ? (
          <View className="items-center py-16">
            <Text className="text-4xl">📣</Text>
            <Text className="mt-3 text-base font-bold text-slate-500">
              No broadcasts here
            </Text>
          </View>
        ) : null}
      </ScrollView>
      <AdminBottomNav active="broadcast" />
    </SafeAreaView>
  );
}
