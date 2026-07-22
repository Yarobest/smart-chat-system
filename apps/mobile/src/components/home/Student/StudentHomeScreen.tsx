import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StudentBottomNav } from "@/src/components/common/StudentBottomNav";
import { useAuth } from "@/src/hooks/useAuth";
import { useNotifications } from "@/src/hooks/useNotifications";
import { authService } from "@/src/services/auth.service";
import { Thread } from "@/src/types/chat.types";
import { formatTime } from "@/src/utils/formatTime";
import { getInitials } from "@/src/utils/getInitials";
import { useLiveThreads } from "@/src/hooks/useLiveThreads";
import { useFocusEffect } from "@react-navigation/native";
import { assignmentService } from "@/src/services/assignment.service";
import { quizService } from "@/src/services/quiz.service";
import { announcementService } from "@/src/services/announcement.service";

export default function StudentHomeScreen() {
  const { user, token } = useAuth();
  const { unreadCount: notificationCount } = useNotifications();
  const [showRecentChats, setShowRecentChats] = useState(true);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const { threads, unreadCount, groupCount } = useLiveThreads();
  const [pendingAssignments, setPendingAssignments] = useState(0);
  const [availableQuizzes, setAvailableQuizzes] = useState(0);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0);

  useFocusEffect(useCallback(() => {
    let mounted = true;
    Promise.all([assignmentService.list(), quizService.list(), announcementService.list()]).then(([assignments, quizzes, announcements]) => {
      if (!mounted) return;
      const now = Date.now();
      setPendingAssignments(assignments.filter((item) => item.status === 'published' && !item.submission).length);
      setAvailableQuizzes(quizzes.filter((item) => item.status === 'published' && now >= new Date(item.startAt).getTime() && now <= new Date(item.endAt).getTime() && !item.attempt?.submittedAt).length);
      setUnreadAnnouncements(announcements.filter((item) => !item.isRead).length);
    }).catch(() => undefined);
    return () => { mounted = false; };
  }, []));

  useEffect(() => {
    if (token) {
      authService.me().catch(() => null);
    }
  }, [token]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60_000);

    return () => clearInterval(timer);
  }, []);

  const recentThreads = useMemo(() => threads.slice(0, 3), [threads]);
  const displayName = user?.name ?? "Student";
  const initials = getInitials(displayName) || "ST";

  const greetingText =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 17
        ? "Good Afternoon"
        : "Good Evening";

  const openThread = (thread: Thread) => {
    router.push(
      thread.type === "group"
        ? (`/(student)/chats/group/${thread.id}` as any)
        : (`/(student)/chats/${thread.id}` as any),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]">
      <StatusBar style="light" hidden={false} />
      <View className="flex-1 bg-white">
        <View className="bg-[#0A1628] px-6 pb-6 pt-6">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-lg font-semibold text-white/85">
                {greetingText} 👋
              </Text>
              <Text className="text-3xl font-extrabold text-white" numberOfLines={1}>
                {displayName}
              </Text>
            </View>
            <View className="mt-1 flex-row items-center self-start">
              <Pressable
                onPress={() => router.push("/(student)/notifications" as any)}
                className="relative mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-white/10"
              >
                <Text className="text-lg">🔔</Text>
                {notificationCount > 0 ? (
                  <View className="absolute right-1 top-1 min-w-5 rounded-full bg-red-500 px-1">
                    <Text className="text-center text-xs font-bold text-white">{notificationCount}</Text>
                  </View>
                ) : null}
              </Pressable>
              <Pressable
                onPress={() => router.replace("/(student)/profile")}
                className="h-16 w-16 items-center justify-center rounded-full bg-orange-400"
              >
                <Text className="text-lg font-bold text-white">{initials}</Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-6 flex-row">
            <View className="mr-3 flex-1 rounded-3xl border border-white/15 bg-white/10 p-4">
              <Text className="text-2xl font-extrabold text-orange-300">{groupCount}</Text>
              <Text className="mt-1 text-sm font-medium text-white/80">Courses</Text>
            </View>
            <View className="mr-3 flex-1 rounded-3xl border border-white/15 bg-white/10 p-4">
              <Text className="text-2xl font-extrabold text-orange-300">{unreadCount}</Text>
              <Text className="mt-1 text-sm font-medium text-white/80">Unread</Text>
            </View>
            <View className="flex-1 rounded-3xl border border-white/15 bg-white/10 p-4">
              <Text className="text-2xl font-extrabold text-orange-300">{groupCount}</Text>
              <Text className="mt-1 text-sm font-medium text-white/80">Groups</Text>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1 bg-white px-6 pt-6" contentContainerStyle={{ paddingBottom: 18 }}>
          <View className="rounded-3xl border-l-[6px] border-blue-500 bg-blue-50 px-4 py-4">
            <Text className="text-lg font-bold text-blue-900">
              {user?.programme ?? user?.department ?? "Student Portal"}
            </Text>
            <Text className="mt-1 text-sm text-blue-900/80">
              {user?.faculty ?? "Your registered academic profile will appear here."}
            </Text>
          </View>

          <View className="mb-2 mt-7 flex-row items-center justify-between">
            <Text className="text-sm font-extrabold text-slate-900">Quick Links</Text>
            <Text className="text-xs font-semibold text-slate-400">Jump back in</Text>
          </View>
          <View className="flex-row flex-wrap justify-between">
            {[
              { title: 'Assignments', subtitle: pendingAssignments > 0 ? `${pendingAssignments} assignment${pendingAssignments === 1 ? '' : 's'} pending` : 'View your assignments', icon: '📋', tone: 'bg-blue-50', route: '/(student)/tasks/assignments' },
              { title: 'Courses', subtitle: `${groupCount} active course group${groupCount === 1 ? '' : 's'}`, icon: '📚', tone: 'bg-emerald-50', route: '/(student)/courses' },
              { title: 'Quizzes', subtitle: availableQuizzes > 0 ? `${availableQuizzes} available now` : 'View course quizzes', icon: '🧪', tone: 'bg-amber-50', route: '/(student)/tasks/quizzes' },
              { title: 'Announcements', subtitle: unreadAnnouncements > 0 ? `${unreadAnnouncements} unread update${unreadAnnouncements === 1 ? '' : 's'}` : 'View official updates', icon: '📣', tone: 'bg-purple-50', route: '/(student)/announcements' },
            ].map((link) => (
              <Pressable
                key={link.title}
                onPress={() => router.push(link.route as any)}
                className={`mb-3 w-[48.5%] rounded-2xl p-4 ${link.tone}`}
              >
                <Text className="text-2xl">{link.icon}</Text>
                <Text className="mt-3 text-sm font-extrabold text-slate-900">{link.title}</Text>
                <Text className="mt-1 text-xs leading-4 text-slate-500">{link.subtitle}</Text>
              </Pressable>
            ))}
          </View>

          <View className="mb-2 mt-5 flex-row items-center justify-between">
            <Text className="text-sm font-extrabold text-slate-900">Recent Chats</Text>
            <Pressable onPress={() => setShowRecentChats((prev) => !prev)}>
              <Text className="text-sm font-bold text-blue-600">
                {showRecentChats ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>

          {showRecentChats ? (
            <View className="mt-1">
              {recentThreads.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => openThread(item)}
                  className="flex-row items-center border-b border-slate-200 px-1 py-5"
                >
                  <View className="h-14 w-14 items-center justify-center rounded-full bg-sky-100">
                    <Text className="text-lg">{item.type === "group" ? "👥" : "💬"}</Text>
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-lg font-bold text-slate-900" numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text className="text-sm text-slate-400" numberOfLines={1}>
                      {item.lastMessage?.text || "No messages yet"}
                    </Text>
                  </View>
                  <View className="items-end self-start pt-0.5">
                    <Text className="text-sm text-slate-400">
                      {item.lastMessage?.createdAt ? formatTime(item.lastMessage.createdAt) : ""}
                    </Text>
                    {item.unreadCount > 0 ? (
                      <View className="mt-1 min-w-5 rounded-full bg-blue-600 px-1.5 py-0.5">
                        <Text className="text-center text-sm font-bold text-white">
                          {item.unreadCount}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </Pressable>
              ))}
              {recentThreads.length === 0 ? (
                <View className="items-center py-10">
                  <Text className="text-3xl">💬</Text>
                  <Text className="mt-2 text-sm font-semibold text-slate-500">
                    No conversations yet
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </ScrollView>

        <StudentBottomNav active="home" unreadCount={unreadCount} />
      </View>
    </SafeAreaView>
  );
}
