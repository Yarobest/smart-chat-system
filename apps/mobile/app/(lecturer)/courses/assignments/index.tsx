import { useCallback, useMemo, useState } from "react";
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
import { StatusBar } from "@/src/components/common/StatusBar";
import { ScreenHeader } from "@/src/components/common/ScreenHeader";
import { assignmentService } from "@/src/services/assignment.service";
import { Assignment } from "@/src/types/assignment.types";

export default function LecturerAssignmentsList() {
  const [items, setItems] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  useFocusEffect(
    useCallback(() => {
      let live = true;
      assignmentService
        .list()
        .then((x) => live && setItems(x))
        .finally(() => live && setLoading(false));
      return () => {
        live = false;
      };
    }, []),
  );
  const groups = useMemo(
    () =>
      Object.values(
        items.reduce(
          (
            map: Record<
              string,
              { code: string; name: string; items: Assignment[] }
            >,
            item,
          ) => {
            const key = item.course.offeringId;
            map[key] ??= {
              code: item.course.code,
              name: item.course.name,
              items: [],
            };
            map[key].items.push(item);
            return map;
          },
          {},
        ),
      ),
    [items],
  );
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title="My Assignments" fallbackRoute="/(lecturer)/tasks" />
      <ScrollView
        className="flex-1 bg-[#F5F7FA]"
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 30 }}
      >
        <Pressable
          onPress={() =>
            router.push("/(lecturer)/courses/create-assignment" as any)
          }
          className="items-center rounded-full bg-blue-600 py-3"
        >
          <Text className="font-bold text-white">+ Create Assignment</Text>
        </Pressable>
        {loading ? <ActivityIndicator color="#2563EB" /> : null}
        {groups.map((group) => (
          <View
            key={group.items[0].course.offeringId}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <View className="bg-blue-50 px-4 py-3">
              <Text className="font-extrabold text-blue-900">
                {group.code} · {group.name}
              </Text>
              <Text className="mt-1 text-xs text-blue-600">
                {group.items.length} assignment
                {group.items.length === 1 ? "" : "s"} ·{" "}
                {group.items.reduce((s, x) => s + x.submissionCount, 0)}{" "}
                submissions
              </Text>
            </View>
            {group.items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() =>
                  router.push(
                    `/(lecturer)/courses/assignments/${item.id}` as any,
                  )
                }
                className="border-t border-slate-100 px-4 py-4"
              >
                <View className="flex-row justify-between gap-3">
                  <View className="flex-1">
                    <Text className="font-extrabold text-slate-900">
                      {item.title}
                    </Text>
                    <Text className="mt-1 text-xs text-slate-500">
                      Due {new Date(item.dueAt).toLocaleString()} ·{" "}
                      {item.submissionCount} submissions
                    </Text>
                  </View>
                  <Text className="text-xs font-bold uppercase text-blue-700">
                    {item.status}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        ))}
        {!loading && !groups.length ? (
          <View className="items-center py-16">
            <Text className="text-4xl">📋</Text>
            <Text className="mt-3 font-bold text-slate-600">
              No assignments created
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
