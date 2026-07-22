import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "../common/StatusBar";
import { AdminBottomNav } from "../common/AdminBottomNav";
import { broadcastService } from "@/src/services/broadcast.service";
import { AdminAnalytics } from "@/src/types/broadcast.types";
export default function AdminAnalyticsScreen() {
  const [data, setData] = useState<AdminAnalytics | null>(null),
    [loading, setLoading] = useState(true);
  useFocusEffect(
    useCallback(() => {
      let live = true;
      setLoading(true);
      broadcastService
        .analytics()
        .then((x) => live && setData(x))
        .finally(() => live && setLoading(false));
      return () => {
        live = false;
      };
    }, []),
  );
  const cards = data
    ? [
        ["Users", data.stats.users, "👥"],
        ["Active Courses", data.stats.activeCourses, "📚"],
        ["Messages", data.stats.messages, "💬"],
        ["Submissions", data.stats.submissions, "📋"],
        ["Quiz Attempts", data.stats.quizAttempts, "🧪"],
        ["Material Opens", data.stats.materialReads, "📖"],
        ["Announcement Reads", data.stats.announcementReads, "📣"],
        ["Broadcast Read Rate", `${data.stats.broadcastReadRate}%`, "📡"],
      ]
    : [];
  const max = Math.max(
    1,
    ...(data?.series.map((x) => Math.max(x.messages, x.registrations)) ?? [1]),
  );
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="bg-[#051839] px-5 pb-5 pt-5">
        <Text className="text-xl font-extrabold text-white">Analytics</Text>
        <Text className="mt-1 text-sm text-white/60">
          Live activity from the system database
        </Text>
      </View>
      <ScrollView
        className="flex-1 bg-[#F5F7FA]"
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
      >
        {loading ? <ActivityIndicator color="#2563EB" /> : null}
        <View className="flex-row flex-wrap justify-between">
          {cards.map(([label, value, icon]) => (
            <View
              key={String(label)}
              className="mb-3 w-[48.5%] rounded-2xl border border-slate-200 bg-white p-4"
            >
              <Text className="text-xl">{icon}</Text>
              <Text className="mt-3 text-2xl font-extrabold text-slate-900">
                {value}
              </Text>
              <Text className="mt-1 text-sm text-slate-500">{label}</Text>
            </View>
          ))}
        </View>
        {data ? (
          <View className="mt-2 rounded-2xl border border-slate-200 bg-white p-4">
            <Text className="text-base font-extrabold text-slate-900">
              Last 7 days
            </Text>
            <Text className="mt-1 text-xs text-slate-400">
              Messages and registrations
            </Text>
            <View
              className="mt-5 flex-row items-end justify-between"
              style={{ height: 150 }}
            >
              {data.series.map((x) => (
                <View
                  key={x.date}
                  className="h-full flex-1 items-center justify-end"
                >
                  <View className="flex-row items-end gap-1">
                    <View
                      className="w-2 rounded-t bg-blue-500"
                      style={{ height: Math.max(4, (x.messages / max) * 115) }}
                    />
                    <View
                      className="w-2 rounded-t bg-emerald-500"
                      style={{
                        height: Math.max(4, (x.registrations / max) * 115),
                      }}
                    />
                  </View>
                  <Text className="mt-2 text-[10px] text-slate-400">
                    {new Date(x.date).toLocaleDateString([], {
                      weekday: "short",
                    })}
                  </Text>
                </View>
              ))}
            </View>
            <View className="mt-4 flex-row gap-4">
              <Text className="text-xs text-blue-600">■ Messages</Text>
              <Text className="text-xs text-emerald-600">■ Registrations</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
      <AdminBottomNav active="analytics" />
    </SafeAreaView>
  );
}
