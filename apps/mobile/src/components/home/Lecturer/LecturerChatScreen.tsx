import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { StatusBar } from '@/src/components/common/StatusBar';
import { LecturerBottomNav } from '@/src/components/common/LecturerBottomNav';
import { formatTime } from '@/src/utils/formatTime';
import { useLiveThreads } from '@/src/hooks/useLiveThreads';
import { Thread } from '@/src/types/chat.types';

type FilterTab = 'All' | 'Course Groups' | 'Direct' | 'Unread';

export default function LecturerChatsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [search, setSearch] = useState('');
  const { threads, loading, unreadCount: totalUnread } = useLiveThreads();

  const filters: FilterTab[] = ['All', 'Course Groups', 'Direct', 'Unread'];

  const groupThreads = threads.filter((thread) => thread.type === 'group');
  const directThreads = threads.filter((thread) => thread.type === 'direct');
  const sortedThreads = [...threads].sort(
    (first, second) =>
      new Date(second.updatedAt ?? second.createdAt ?? 0).getTime() -
      new Date(first.updatedAt ?? first.createdAt ?? 0).getTime(),
  );

  const filteredGroups = groupThreads.filter((g) => {
    if (activeFilter === 'Unread') return g.unreadCount > 0;
    if (search) return g.title.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const filteredDirect = directThreads.filter((d) => {
    if (activeFilter === 'Unread') return d.unreadCount > 0;
    if (search) return d.title.toLowerCase().includes(search.toLowerCase());
    return true;
  });
  const filteredAll =
    activeFilter === 'Unread'
      ? sortedThreads.filter((thread) => thread.unreadCount > 0)
      : sortedThreads.filter((thread) =>
          search ? thread.title.toLowerCase().includes(search.toLowerCase()) : true,
        );

  const preview = (thread: Thread) =>
    thread.lastMessage
      ? `${thread.lastMessage.sender?.name ?? 'Someone'}: ${thread.lastMessage.text}`
      : 'No messages yet';

  const time = (thread: Thread) =>
    thread.lastMessage?.createdAt
      ? formatTime(thread.lastMessage.createdAt)
      : thread.updatedAt
        ? formatTime(thread.updatedAt)
        : '';

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="flex-1 bg-white">

        {/* Header */}
        <View className="bg-[#051839] px-4 pb-4 pt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-extrabold text-white">Messages</Text>
              <Text className="text-xs text-slate-400">{totalUnread} unread</Text>
            </View>
            <Pressable
              onPress={() => router.push('/(lecturer)/chats/new' as any)}
              className="h-9 w-9 items-center justify-center rounded-full bg-white/10"
            >
              <Text className="text-base text-white">✏️</Text>
            </Pressable>
          </View>

          {/* Search */}
          <View className="mt-3 flex-row items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5">
            <Text className="text-sm text-slate-400">🔍</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search conversations..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-sm text-white"
            />
          </View>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
            contentContainerStyle={{ gap: 8 }}
          >
            {filters.map((filter) => (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-1.5 ${
                  activeFilter === filter ? 'bg-blue-600' : 'bg-white/10'
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    activeFilter === filter ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {filter}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Body */}
        <ScrollView
          className="flex-1 bg-white"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12 }}
        >
          {/* Course Groups Section */}
          {!loading && threads.length === 0 ? (
            <View className="mt-20 items-center justify-center">
              <Text className="text-4xl">💬</Text>
              <Text className="mt-3 text-base font-extrabold text-slate-400">NO MESSAGES YET</Text>
            </View>
          ) : null}

          {threads.length > 0 && (activeFilter === 'All' || activeFilter === 'Unread') && (
            <View>
              <Text className="px-4 pb-2 pt-4 text-xs font-extrabold tracking-widest text-slate-400">
                RECENT MESSAGES
              </Text>
              {filteredAll.map((thread) => (
                <Pressable
                  key={thread.id}
                  onPress={() =>
                    router.push(
                      thread.type === 'group'
                        ? (`/(lecturer)/groups/${thread.id}` as any)
                        : (`/(lecturer)/chats/${thread.id}` as any),
                    )
                  }
                  className="flex-row items-center gap-3 border-b border-slate-100 px-4 py-3"
                >
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                    <Text className="text-2xl">{thread.type === 'group' ? '👥' : '💬'}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-extrabold text-slate-900">{thread.title}</Text>
                    <Text className="mt-0.5 text-xs text-slate-400" numberOfLines={1}>
                      {preview(thread)}
                    </Text>
                  </View>
                  <View className="items-end gap-1">
                    <Text className="text-xs text-slate-400">{time(thread)}</Text>
                    {thread.unreadCount > 0 ? (
                      <View className="h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1">
                        <Text className="text-xs font-bold text-white">{thread.unreadCount}</Text>
                      </View>
                    ) : null}
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {threads.length > 0 && activeFilter === 'Course Groups' && filteredGroups.length > 0 && (
            <View>
              <Text className="px-4 pb-2 pt-4 text-xs font-extrabold tracking-widest text-slate-400">
                MY COURSE GROUPS
              </Text>
              {filteredGroups.map((group) => (
                <Pressable
                  key={group.id}
                  onPress={() => router.push(`/(lecturer)/groups/${group.id}` as any)}
                  className="flex-row items-center gap-3 border-b border-slate-100 px-4 py-3"
                >
                  {/* Icon */}
                  <View
                    className="h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: '#EEF2FF' }}
                  >
                    <Text className="text-2xl">👥</Text>
                  </View>

                  {/* Info */}
                  <View className="flex-1">
                    <Text className="text-sm font-extrabold text-slate-900">
                      {group.title}
                    </Text>
                    <Text className="mt-0.5 text-xs text-slate-400" numberOfLines={1}>
                      {preview(group)}
                    </Text>
                  </View>

                  {/* Time + Badge */}
                  <View className="items-end gap-1">
                    <Text className="text-xs text-slate-400">{time(group)}</Text>
                    {group.unreadCount > 0 && (
                      <View className="h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1">
                        <Text className="text-xs font-bold text-white">{group.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          )}
          {threads.length > 0 && activeFilter === 'Course Groups' && filteredGroups.length === 0 ? (
            <View>
              <Text className="px-4 pb-2 pt-4 text-xs font-extrabold tracking-widest text-slate-400">
                MY COURSE GROUPS
              </Text>
              <View className="mt-16 items-center px-6">
                <Text className="text-center text-lg font-extrabold text-slate-400">
                  NO MESSAGES YET
                </Text>
              </View>
            </View>
          ) : null}

          {/* Direct Messages Section */}
          {threads.length > 0 && activeFilter === 'Direct' && filteredDirect.length > 0 && (
            <View>
              <Text className="px-4 pb-2 pt-4 text-xs font-extrabold tracking-widest text-slate-400">
                DIRECT MESSAGES FROM STUDENTS
              </Text>
              {filteredDirect.map((dm) => (
                <Pressable
                  key={dm.id}
                  onPress={() => router.push(`/(lecturer)/chats/${dm.id}` as any)}
                  className="flex-row items-center gap-3 border-b border-slate-100 px-4 py-3"
                >
                  {/* Avatar */}
                  <View className="relative">
                    <View
                      className="h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: '#F0FDF4' }}
                    >
                      <Text className="text-2xl">💬</Text>
                    </View>
                    {dm.type === 'direct' && (
                      <View className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
                    )}
                  </View>

                  {/* Info */}
                  <View className="flex-1">
                    <Text className="text-sm font-extrabold text-slate-900">{dm.title}</Text>
                    <Text className="mt-0.5 text-xs text-slate-400" numberOfLines={1}>
                      {preview(dm)}
                    </Text>
                  </View>

                  {/* Time + Badge */}
                  <View className="items-end gap-1">
                    <Text className="text-xs text-slate-400">{time(dm)}</Text>
                    {dm.unreadCount > 0 && (
                      <View className="h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1">
                        <Text className="text-xs font-bold text-white">{dm.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          )}
          {threads.length > 0 && activeFilter === 'Direct' && filteredDirect.length === 0 ? (
            <View>
              <Text className="px-4 pb-2 pt-4 text-xs font-extrabold tracking-widest text-slate-400">
                DIRECT MESSAGES FROM STUDENTS
              </Text>
              <View className="mt-16 items-center px-6">
                <Text className="text-center text-lg font-extrabold text-slate-400">
                  NO MESSAGES YET
                </Text>
              </View>
            </View>
          ) : null}

          {/* Empty state */}
          {!loading &&
          threads.length > 0 &&
          filteredAll.length === 0 &&
          filteredGroups.length === 0 &&
          filteredDirect.length === 0 && (
            <View className="mt-20 items-center justify-center">
              <Text className="text-4xl">💬</Text>
              <Text className="mt-3 text-base font-semibold text-slate-400">No conversations found</Text>
            </View>
          )}
        </ScrollView>

        <LecturerBottomNav active="chats" unreadCount={totalUnread} />
      </View>
    </SafeAreaView>
  );
}
