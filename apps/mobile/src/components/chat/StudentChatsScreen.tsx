import { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "@/src/components/common/StatusBar";
import { ChatListItem } from "@/src/components/chat/ChatListItem";
import { BottomNav } from "@/src/components/common/BottomNav";
import { formatTime } from "@/src/utils/formatTime";
import { useLiveThreads } from "@/src/hooks/useLiveThreads";

export default function StudentChatsScreen() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const filters = ["All", "Direct", "Groups", "Unread"];
  const { threads, loading, unreadCount } = useLiveThreads();

  useEffect(() => {
    if (threads.length === 0 && activeFilter !== "All") setActiveFilter("All");
  }, [activeFilter, threads.length]);

  const groupChats = useMemo(
    () => threads.filter((thread) => thread.type === "group"),
    [threads],
  );
  const directChats = useMemo(
    () => threads.filter((thread) => thread.type === "direct"),
    [threads],
  );
  const sortedThreads = useMemo(
    () =>
      [...threads].sort(
        (first, second) =>
          new Date(second.updatedAt ?? second.createdAt ?? 0).getTime() -
          new Date(first.updatedAt ?? first.createdAt ?? 0).getTime(),
      ),
    [threads],
  );

  const matchesSearch = (chat: { title: string }) =>
    chat.title.toLowerCase().includes(search.trim().toLowerCase());

  const visibleAllChats =
    activeFilter === "Unread"
      ? sortedThreads.filter((chat) => chat.unreadCount > 0)
      : sortedThreads.filter(matchesSearch);

  const visibleGroupChats =
    activeFilter === "Unread"
      ? groupChats.filter((chat) => chat.unreadCount > 0)
      : groupChats.filter(matchesSearch);
  const visibleDirectChats =
    activeFilter === "Unread"
      ? directChats.filter((chat) => chat.unreadCount > 0)
      : directChats.filter(matchesSearch);

  const toChatListItem = (chat: Thread) => ({
    title: chat.title,
    preview: chat.lastMessage
      ? `${chat.lastMessage.sender?.name ?? "Someone"}: ${chat.lastMessage.text}`
      : "No messages yet",
    time: chat.lastMessage?.createdAt
      ? formatTime(chat.lastMessage.createdAt)
      : chat.updatedAt
        ? formatTime(chat.updatedAt)
        : "",
    unreadCount: chat.unreadCount,
    avatar: chat.type === "group" ? "👥" : "💬",
    toneClass: chat.type === "group" ? "bg-[#DCE9F8]" : "bg-[#BDECCD]",
    online: chat.type === "direct",
  });

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="bg-[#051839] px-6 pb-5 pt-6">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-lg font-bold text-white">Messages</Text>
            <Text className="text-lg text-white/80">{unreadCount} unread</Text>
          </View>
          <Pressable
            onPress={() => router.push("/(student)/chats/new" as any)}
            className="mt-1 h-10 w-10 items-center justify-center rounded-full bg-white/10"
          >
            <Text className="text-lg">✏️</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-[#F3F5F8]"
        contentContainerStyle={{ paddingBottom: 12 }}
      >
        <View className="mx-4 mt-4 flex-row items-center rounded-2xl border border-[#CFD6E5] bg-[#E5EAF2] px-4 py-2">
          <Text className="mr-3 text-base text-[#7585A5]">🔍</Text>
          <TextInput
            placeholder="Search conversations..."
            placeholderTextColor="#8B97B1"
            value={search}
            onChangeText={setSearch}
            className="flex-1 text-sm text-slate-700"
          />
        </View>

        <View className="mb-2 mt-4 flex-row flex-wrap px-4 -mr-3 -mb-3">
          {filters.map((filter) => {
            const active = filter === activeFilter;
            return (
              <View key={filter} className="mr-3 mb-3">
                <Pressable
                  onPress={() => setActiveFilter(filter)}
                  className={`rounded-full border px-5 py-2 ${active ? "border-[#2E63DF] bg-[#2E63DF]" : "border-[#CFD6E5] bg-[#E5EAF2]"}`}
                >
                  <Text
                    className={`text-sm font-semibold ${active ? "text-white" : "text-[#304567]"}`}
                  >
                    {filter}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        {!loading && threads.length === 0 ? (
          <View className="mt-24 items-center px-6">
            <Text className="text-4xl">💬</Text>
            <Text className="mt-3 text-center text-lg font-extrabold text-slate-600">
              NO MESSAGES YET
            </Text>
          </View>
        ) : null}

        {threads.length > 0 && (activeFilter === "All" || activeFilter === "Unread") ? (
          <View>
            <Text className="border-t border-slate-200 px-4 pb-2 pt-4 text-sm font-extrabold tracking-wider text-[#8C9BB4]">
              RECENT MESSAGES
            </Text>
            {visibleAllChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                {...toChatListItem(chat)}
                onPress={() =>
                  router.push(
                    chat.type === "group"
                      ? (`/(student)/chats/group/${chat.id}` as any)
                      : (`/(student)/chats/${chat.id}` as any),
                  )
                }
              />
            ))}
          </View>
        ) : null}

        {threads.length > 0 && activeFilter === "Groups" ? (
          <View>
            <Text className="border-t border-slate-200 px-4 pb-2 pt-4 text-sm font-extrabold tracking-wider text-[#8C9BB4]">
              GROUP CHATS
            </Text>
            {visibleGroupChats.length === 0 ? (
              <View className="mt-16 items-center px-6">
                <Text className="text-center text-lg font-extrabold text-slate-500">
                  NO MESSAGES YET
                </Text>
              </View>
            ) : null}
            {visibleGroupChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                {...toChatListItem(chat)}
                onPress={() => router.push(`/(student)/chats/group/${chat.id}` as any)}
              />
            ))}
          </View>
        ) : null}

        {threads.length > 0 && activeFilter === "Direct" ? (
          <View>
            <Text className="px-4 pb-2 pt-4 text-sm font-extrabold tracking-wider text-[#8C9BB4]">
              DIRECT MESSAGES
            </Text>
            {visibleDirectChats.length === 0 ? (
              <View className="mt-16 items-center px-6">
                <Text className="text-center text-lg font-extrabold text-slate-500">
                  NO MESSAGES YET
                </Text>
              </View>
            ) : null}
            {visibleDirectChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                {...toChatListItem(chat)}
                onPress={() => router.push(`/(student)/chats/${chat.id}` as any)}
              />
            ))}
          </View>
        ) : null}
        {!loading &&
        threads.length > 0 &&
        visibleAllChats.length === 0 &&
        visibleGroupChats.length === 0 &&
        visibleDirectChats.length === 0 ? (
          <View className="mt-16 items-center px-6">
            <Text className="text-4xl">💬</Text>
            <Text className="mt-3 text-center text-base font-semibold text-slate-500">
              No conversations yet
            </Text>
          </View>
        ) : null}
      </ScrollView>
      <BottomNav
        items={[
          {
            label: "Home",
            icon: "🏠",
            onPress: () => router.replace("/(student)/home"),
          },
          {
            label: "Chats",
            icon: "💬",
            active: true,
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
    </SafeAreaView>
  );
}
