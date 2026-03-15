import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BottomNav } from "@/src/components/common/BottomNav";

const chatItems = [
  {
    id: "1",
    avatar: "📚",
    title: "CS301 · Data Structures",
    preview: "Mr. Agordzo: Assignment due Fri...",
    time: "10:22",
    unread: 4,
    tone: "bg-sky-100",
  },
  {
    id: "2",
    avatar: "👨‍🏫",
    title: "Dr. Mensah",
    preview: "Your project report looks good!",
    time: "9:05",
    unread: 1,
    tone: "bg-emerald-100",
  },
  {
    id: "3",
    avatar: "📖",
    title: "CS205 · Networking",
    preview: "Rudolf: Can someone share...",
    time: "Yesterday",
    unread: 0,
    tone: "bg-amber-100",
  },
];

export default function StudentHomeScreen() {
  const [showRecentChats, setShowRecentChats] = useState(true);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const unreadCount = chatItems.reduce((total, item) => total + item.unread, 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60_000);

    return () => clearInterval(timer);
  }, []);

  const greetingText =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 17
        ? "Good Afternoon"
        : "Good Evening";

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]">
      <StatusBar style="light" hidden={false} />
      <View className="flex-1 bg-white">
        <View className="bg-[#0A1628] px-6 pb-6 pt-6">
          <View className="flex-row items-start justify-between">
            <View>
              <Text
                allowFontScaling
                className="text-lg font-semibold text-white/85"
              >
                {greetingText} 👋
              </Text>
              <Text
                allowFontScaling
                className="text-3xl font-extrabold text-white"
              >
                Stephen Appiah
              </Text>
            </View>
            <View className="mt-1 flex-row items-center gap-3 self-start">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Text allowFontScaling className="text-lg">
                  🔔
                </Text>
              </View>
              <Pressable
                onPress={() => router.push("/(student)/profile")}
                className="h-16 w-16 items-center justify-center rounded-full bg-orange-400"
              >
                <Text allowFontScaling className="text-lg font-bold text-white">
                  SA
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-6 flex-row gap-3">
            <View className="flex-1 rounded-3xl border border-white/15 bg-white/10 p-4">
              <Text
                allowFontScaling
                className="text-2xl font-extrabold text-orange-300"
              >
                5
              </Text>
              <Text
                allowFontScaling
                className="mt-1 text-sm font-medium text-white/80"
              >
                Courses
              </Text>
            </View>
            <View className="flex-1 rounded-3xl border border-white/15 bg-white/10 p-4">
              <Text
                allowFontScaling
                className="text-2xl font-extrabold text-orange-300"
              >
                {unreadCount}
              </Text>
              <Text
                allowFontScaling
                className="mt-1 text-sm font-medium text-white/80"
              >
                Unread
              </Text>
            </View>
            <View className="flex-1 rounded-3xl border border-white/15 bg-white/10 p-4">
              <Text
                allowFontScaling
                className="text-2xl font-extrabold text-orange-300"
              >
                3
              </Text>
              <Text
                allowFontScaling
                className="mt-1 text-sm font-medium text-white/80"
              >
                Alerts
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1 bg-white px-6 pt-6"
          contentContainerStyle={{ paddingBottom: 18 }}
        >
          <View className="rounded-3xl border-l-[6px] border-amber-500 bg-amber-100 px-4 py-4">
            <View className="flex-row items-start gap-3">
              <Text allowFontScaling className="pt-1 text-lg">
                🔈
              </Text>
              <View className="flex-1">
                <Text
                  allowFontScaling
                  className="text-lg font-bold text-amber-900"
                >
                  Exam Timetable Released!
                </Text>
                <Text
                  allowFontScaling
                  className="mt-1 text-sm text-amber-900/85"
                >
                  End of semester exams begin Jan 20. Check notice board.
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-2 mt-7 flex-row items-center justify-between">
            <Text
              allowFontScaling
              className="text-sm font-extrabold text-slate-900"
            >
              Recent Chats
            </Text>
            <Pressable onPress={() => setShowRecentChats((prev) => !prev)}>
              <Text
                allowFontScaling
                className="text-sm font-bold text-blue-600"
              >
                {showRecentChats ? "Hide" : "See All"}
              </Text>
            </Pressable>
          </View>

          {showRecentChats ? (
            <View className="mt-1">
              {chatItems.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    item.id === "2"
                      ? router.push("/(student)/chats/d1")
                      : router.push(`/(student)/chats/group/g${item.id}`)
                  }
                  className="flex-row items-center border-b border-slate-200 px-1 py-5"
                >
                  <View className="relative">
                    <View
                      className={`h-14 w-14 items-center justify-center rounded-full ${item.tone}`}
                    >
                      <Text allowFontScaling className="text-lg">
                        {item.avatar}
                      </Text>
                    </View>
                    {item.id === "2" ? (
                      <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                    ) : null}
                  </View>
                  <View className="ml-3 flex-1">
                    <Text
                      allowFontScaling
                      className="text-lg font-bold text-slate-900"
                    >
                      {item.title}
                    </Text>
                    <Text
                      allowFontScaling
                      className="text-sm text-slate-400"
                      numberOfLines={1}
                    >
                      {item.preview}
                    </Text>
                  </View>
                  <View className="items-end self-start pt-0.5">
                    <Text allowFontScaling className="text-sm text-slate-400">
                      {item.time}
                    </Text>
                    {item.unread > 0 ? (
                      <View className="mt-1 min-w-5 rounded-full bg-blue-600 px-1.5 py-0.5">
                        <Text
                          allowFontScaling
                          className="text-center text-sm font-bold text-white"
                        >
                          {item.unread}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </Pressable>
              ))}
            </View>
          ) : null}
        </ScrollView>

        <BottomNav
          items={[
            {
              label: "Home",
              icon: "🏠",
              active: true,
              onPress: () => router.replace("/(student)/home"),
            },
            {
              label: "Chats",
              icon: "💬",
              badge: unreadCount,
              onPress: () => router.replace("/(student)/chats"),
            },
            {
              label: "Notices",
              icon: "📢",
              onPress: () => router.replace("/(student)/announcements"),
            },
            {
              label: "Profile",
              icon: "👤",
              onPress: () => router.replace("/(student)/profile"),
            },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}
