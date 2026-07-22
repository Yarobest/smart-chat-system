import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "../common/StatusBar";
import { ScreenHeader } from "../common/ScreenHeader";
import { AssignmentAttachments } from "../assignments/AssignmentAttachments";
import { broadcastService } from "@/src/services/broadcast.service";
import { InstitutionalBroadcast } from "@/src/types/broadcast.types";
export default function BroadcastDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<InstitutionalBroadcast | null>(null),
    [busy, setBusy] = useState(false);
  const load = useCallback(() => {
    if (id)
      broadcastService
        .detail(id)
        .then(setItem)
        .catch((e) => Alert.alert("Could not load", e.message));
  }, [id]);
  useFocusEffect(useCallback(() => load(), [load]));
  if (!item)
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F5F7FA]">
        <ActivityIndicator color="#2563EB" />
      </SafeAreaView>
    );
  const update = async (status: string) => {
    try {
      setBusy(true);
      setItem(await broadcastService.update(item.id, { status }));
    } finally {
      setBusy(false);
    }
  };
  const publish = () =>
    Alert.alert(
      "Publish broadcast?",
      `This will deliver the message to its ${item.audienceLabel} audience.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Publish",
          onPress: async () => {
            try {
              setBusy(true);
              setItem(await broadcastService.publish(item.id));
            } finally {
              setBusy(false);
            }
          },
        },
      ],
    );
  const remove = () =>
    Alert.alert("Delete draft?", undefined, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await broadcastService.remove(item.id);
            router.replace("/(admin)/broadcast/broad-cast" as any);
          } catch (e) {
            Alert.alert(
              "Cannot delete",
              e instanceof Error ? e.message : "Archive it instead.",
            );
          }
        },
      },
    ]);
  const actions = [
    {
      l: "Edit",
      show: item.status === "draft" || item.status === "scheduled",
      run: () =>
        router.push({
          pathname: "/(admin)/broadcast/create",
          params: { broadcastId: item.id },
        } as any),
    },
    {
      l: "Publish",
      show: item.status === "draft" || item.status === "scheduled",
      run: publish,
      primary: true,
    },
    {
      l: "Archive",
      show: item.status === "published",
      run: () => void update("archived"),
    },
    {
      l: "Restore",
      show: item.status === "archived",
      run: () => void update("published"),
      primary: true,
    },
    { l: "Delete", show: item.recipientCount === 0, run: remove, danger: true },
  ].filter((x) => x.show);
  const rate = item.recipientCount
    ? Math.round((item.readCount / item.recipientCount) * 100)
    : 0;
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader
        title={item.title}
        fallbackRoute="/(admin)/broadcast/broad-cast"
      />
      <ScrollView
        className="flex-1 bg-[#F5F7FA]"
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 30 }}
      >
        <View className="rounded-2xl border border-slate-200 bg-white p-5">
          <View className="flex-row justify-between gap-2">
            <Text className="flex-1 text-xs font-extrabold uppercase text-blue-700">
              {item.audienceLabel}
            </Text>
            <Text className="text-xs font-bold uppercase text-slate-500">
              {item.status}
            </Text>
          </View>
          <Text className="mt-4 text-base leading-7 text-slate-700">
            {item.body}
          </Text>
          <Text className="mt-4 text-xs text-slate-400">
            By {item.creator.name} · {item.priority.toUpperCase()}
          </Text>
          {item.scheduledAt ? (
            <Text className="mt-1 text-xs text-slate-400">
              Scheduled {new Date(item.scheduledAt).toLocaleString()}
            </Text>
          ) : null}
          <AssignmentAttachments files={item.attachments} />
        </View>
        <View className="rounded-2xl bg-[#0B2A59] p-4">
          <Text className="text-xs font-extrabold uppercase text-blue-200">
            Delivery report
          </Text>
          <View className="mt-3 flex-row">
            <View className="flex-1">
              <Text className="text-2xl font-extrabold text-white">
                {item.recipientCount}
              </Text>
              <Text className="text-xs text-blue-100">Delivered</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-extrabold text-white">
                {item.readCount}
              </Text>
              <Text className="text-xs text-blue-100">Read</Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-2xl font-extrabold text-white">
                {rate}%
              </Text>
              <Text className="text-xs text-blue-100">Read rate</Text>
            </View>
          </View>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {actions.map((a) => (
            <Pressable
              key={a.l}
              disabled={busy}
              onPress={a.run}
              className={`w-[48%] items-center rounded-lg border py-3 ${a.primary ? "border-blue-600 bg-blue-600" : a.danger ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"} ${busy ? "opacity-50" : ""}`}
            >
              <Text
                className={`font-bold ${a.primary ? "text-white" : a.danger ? "text-red-700" : "text-slate-700"}`}
              >
                {busy ? "Please wait..." : a.l}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
