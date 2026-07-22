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
import { quizService } from "@/src/services/quiz.service";
import { Quiz } from "@/src/types/quiz.types";

export default function LecturerQuizList() {
  const [items, setItems] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  useFocusEffect(
    useCallback(() => {
      let live = true;
      quizService
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
            map: Record<string, { code: string; name: string; items: Quiz[] }>,
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
      <ScreenHeader title="My Quizzes" fallbackRoute="/(lecturer)/tasks" />
      <ScrollView
        className="flex-1 bg-[#F5F7FA]"
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 30 }}
      >
        <Pressable
          onPress={() => router.push("/(lecturer)/courses/set-quiz" as any)}
          className="items-center rounded-full bg-blue-600 py-3"
        >
          <Text className="font-bold text-white">+ Create Quiz</Text>
        </Pressable>
        {loading ? <ActivityIndicator color="#2563EB" /> : null}
        {groups.map((group) => (
          <View
            key={group.items[0].course.offeringId}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <View className="bg-amber-50 px-4 py-3">
              <Text className="font-extrabold text-amber-900">
                {group.code} · {group.name}
              </Text>
              <Text className="mt-1 text-xs text-amber-700">
                {group.items.length} quiz{group.items.length === 1 ? "" : "zes"}{" "}
                · {group.items.reduce((s, x) => s + x.attemptCount, 0)} attempts
              </Text>
            </View>
            {group.items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() =>
                  router.push(`/(lecturer)/courses/quizzes/${item.id}` as any)
                }
                className="border-t border-slate-100 px-4 py-4"
              >
                <View className="flex-row justify-between gap-3">
                  <View className="flex-1">
                    <Text className="font-extrabold text-slate-900">
                      {item.title}
                    </Text>
                    <Text className="mt-1 text-xs text-slate-500">
                      {item.questionCount} questions · {item.totalMarks} marks ·{" "}
                      {item.attemptCount} attempts
                    </Text>
                  </View>
                  <Text className="text-xs font-bold uppercase text-amber-700">
                    {item.status}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        ))}
        {!loading && !groups.length ? (
          <View className="items-center py-16">
            <Text className="text-4xl">🧪</Text>
            <Text className="mt-3 font-bold text-slate-600">
              No quizzes created
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
