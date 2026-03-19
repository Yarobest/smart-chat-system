import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { StatusBar } from '@/src/components/common/StatusBar';
import { BottomNav } from '@/src/components/common/BottomNav';

type FilterTab = 'All' | 'Course Groups' | 'Direct' | 'Unread';

const COURSE_GROUPS = [
  {
    id: '1',
    code: 'CS301',
    name: 'Data Structures',
    lastSender: 'Stephen',
    lastMessage: '"Sir, can you clarify Q3?"',
    time: '10:22',
    unread: 5,
    icon: '📚',
    iconBg: '#EEF2FF',
  },
  {
    id: '2',
    code: 'CS205',
    name: 'Networking',
    lastSender: 'Rudolf',
    lastMessage: '"Can someone share OSI..."',
    time: '9:05',
    unread: 1,
    icon: '🛰️',
    iconBg: '#F0FDF4',
  },
  {
    id: '3',
    code: 'CS410',
    name: 'Software Engineering',
    lastSender: 'You',
    lastMessage: '"Project deadline is Friday."',
    time: 'Mon',
    unread: 0,
    icon: '🧑‍💻',
    iconBg: '#FFF7ED',
  },
];

const DIRECT_MESSAGES = [
  {
    id: '1',
    name: 'Stephen Appiah',
    lastMessage: 'Thank you sir, I\'ll resubmit today.',
    time: '9:30',
    unread: 1,
    avatar: '👨‍🎓',
    avatarBg: '#EEF2FF',
    online: true,
  },
  {
    id: '2',
    name: 'Abena Asante',
    lastMessage: 'Sir, can we reschedule office hour...',
    time: '8:50',
    unread: 0,
    avatar: '👩‍🎓',
    avatarBg: '#FDF4FF',
    online: false,
  },
  {
    id: '3',
    name: 'Kwame Mensah',
    lastMessage: 'I have submitted the assignment.',
    time: 'Mon',
    unread: 0,
    avatar: '👨‍💻',
    avatarBg: '#F0FDF4',
    online: false,
  },
  {
    id: '4',
    name: 'Ama Owusu',
    lastMessage: 'Please sir, what is the format for...',
    time: 'Mon',
    unread: 2,
    avatar: '👩‍💻',
    avatarBg: '#FFF7ED',
    online: true,
  },
  {
    id: '5',
    name: 'Kofi Boateng',
    lastMessage: 'Good morning sir, I need help with...',
    time: 'Sun',
    unread: 0,
    avatar: '🧑‍🎓',
    avatarBg: '#FFF1F2',
    online: false,
  },
];

export default function LecturerChatsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [search, setSearch] = useState('');

  const filters: FilterTab[] = ['All', 'Course Groups', 'Direct', 'Unread'];

  const showGroups = activeFilter === 'All' || activeFilter === 'Course Groups';
  const showDirect = activeFilter === 'All' || activeFilter === 'Direct';

  const filteredGroups = COURSE_GROUPS.filter((g) => {
    if (activeFilter === 'Unread') return g.unread > 0;
    if (search) return g.name.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const filteredDirect = DIRECT_MESSAGES.filter((d) => {
    if (activeFilter === 'Unread') return d.unread > 0;
    if (search) return d.name.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="flex-1 bg-white">

        {/* Header */}
        <View className="bg-[#051839] px-4 pb-4 pt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-extrabold text-white">Messages</Text>
              <Text className="text-xs text-slate-400">7 unread</Text>
            </View>
            <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-white/10">
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
          {showGroups && filteredGroups.length > 0 && (
            <View>
              <Text className="px-4 pb-2 pt-4 text-xs font-extrabold tracking-widest text-slate-400">
                MY COURSE GROUPS
              </Text>
              {filteredGroups.map((group) => (
                <Pressable
                  key={group.id}
                  className="flex-row items-center gap-3 border-b border-slate-100 px-4 py-3"
                >
                  {/* Icon */}
                  <View
                    className="h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: group.iconBg }}
                  >
                    <Text className="text-2xl">{group.icon}</Text>
                  </View>

                  {/* Info */}
                  <View className="flex-1">
                    <Text className="text-sm font-extrabold text-slate-900">
                      {group.code} · {group.name}
                    </Text>
                    <Text className="mt-0.5 text-xs text-slate-400" numberOfLines={1}>
                      {group.lastSender}: {group.lastMessage}
                    </Text>
                  </View>

                  {/* Time + Badge */}
                  <View className="items-end gap-1">
                    <Text className="text-xs text-slate-400">{group.time}</Text>
                    {group.unread > 0 && (
                      <View className="h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1">
                        <Text className="text-xs font-bold text-white">{group.unread}</Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* Direct Messages Section */}
          {showDirect && filteredDirect.length > 0 && (
            <View>
              <Text className="px-4 pb-2 pt-4 text-xs font-extrabold tracking-widest text-slate-400">
                DIRECT MESSAGES FROM STUDENTS
              </Text>
              {filteredDirect.map((dm) => (
                <Pressable
                  key={dm.id}
                  className="flex-row items-center gap-3 border-b border-slate-100 px-4 py-3"
                >
                  {/* Avatar */}
                  <View className="relative">
                    <View
                      className="h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: dm.avatarBg }}
                    >
                      <Text className="text-2xl">{dm.avatar}</Text>
                    </View>
                    {dm.online && (
                      <View className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
                    )}
                  </View>

                  {/* Info */}
                  <View className="flex-1">
                    <Text className="text-sm font-extrabold text-slate-900">{dm.name}</Text>
                    <Text className="mt-0.5 text-xs text-slate-400" numberOfLines={1}>
                      {dm.lastMessage}
                    </Text>
                  </View>

                  {/* Time + Badge */}
                  <View className="items-end gap-1">
                    <Text className="text-xs text-slate-400">{dm.time}</Text>
                    {dm.unread > 0 && (
                      <View className="h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1">
                        <Text className="text-xs font-bold text-white">{dm.unread}</Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* Empty state */}
          {filteredGroups.length === 0 && filteredDirect.length === 0 && (
            <View className="mt-20 items-center justify-center">
              <Text className="text-4xl">💬</Text>
              <Text className="mt-3 text-base font-semibold text-slate-400">No conversations found</Text>
            </View>
          )}
        </ScrollView>

        <BottomNav
          items={[
            { label: 'Home', icon: '🏠', onPress: () => router.replace('/(lecturer)/home') },
            { label: 'Chats', icon: '💬', badge: 7, active: true, onPress: () => router.replace('/(lecturer)/chats') },
            { label: 'Notices', icon: '📢', onPress: () => router.replace('/(lecturer)/announcements') },
            { label: 'Profile', icon: '👤', onPress: () => router.replace('/(lecturer)/profile') },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}