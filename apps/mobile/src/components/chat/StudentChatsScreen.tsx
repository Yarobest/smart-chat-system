import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ChatListItem } from '@/src/components/chat/ChatListItem';
import { BottomNav } from '@/src/components/common/BottomNav';

const unreadCount = 12;
const groupChats = [
  { id: 'g1', title: 'CS301 · Data Structures', preview: 'Mr. Agordzo: Assignment due Friday...', time: '10:22', unreadCount: 4, avatar: '📚', toneClass: 'bg-[#DCE9F8]' },
  { id: 'g2', title: 'CS205 · Networking', preview: 'Rudolf: Can someone share notes?', time: 'Yesterday', unreadCount: 8, avatar: '📡', toneClass: 'bg-[#F3E9B8]' },
  { id: 'g3', title: 'CS102 · Math for CS', preview: 'You: Thanks everyone!', time: 'Mon', unreadCount: 0, avatar: '🧮', toneClass: 'bg-[#EDDEF3]' },
];
const directChats = [
  { id: 'd1', title: 'Dr. Ama Mensah', preview: 'Your project report looks great!', time: '9:05', unreadCount: 1, avatar: '🧑‍🏫', toneClass: 'bg-[#BDECCD]', online: true },
  { id: 'd2', title: 'Rudolf Gavor', preview: 'Can we meet after class?', time: '8:53', unreadCount: 0, avatar: '🧑‍💻', toneClass: 'bg-[#F2DCE9]' },
];

export default function StudentChatsScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Direct', 'Groups', 'Unread'];

  const showGroups = activeFilter === 'All' || activeFilter === 'Groups' || activeFilter === 'Unread';
  const showDirect = activeFilter === 'All' || activeFilter === 'Direct' || activeFilter === 'Unread';

  const visibleGroupChats = activeFilter === 'Unread' ? groupChats.filter((chat) => chat.unreadCount > 0) : groupChats;
  const visibleDirectChats = activeFilter === 'Unread' ? directChats.filter((chat) => chat.unreadCount > 0) : directChats;

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="bg-[#051839] px-6 pb-5 pt-6">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-lg font-bold text-white">Messages</Text>
            <Text className="text-lg text-white/80">{unreadCount} unread</Text>
          </View>
          <Text className="mt-2 text-lg">✏️</Text>
        </View>
      </View>

      <ScrollView className="flex-1 bg-[#F3F5F8]" contentContainerStyle={{ paddingBottom: 12 }}>
        <View className="mx-4 mt-4 flex-row items-center rounded-2xl border border-[#CFD6E5] bg-[#E5EAF2] px-4 py-2">
          <Text className="mr-3 text-base text-[#7585A5]">🔍</Text>
          <TextInput
            placeholder="Search conversations..."
            placeholderTextColor="#8B97B1"
            className="flex-1 text-sm text-slate-700"
          />
        </View>

        <View className="mb-2 mt-4 flex-row flex-wrap gap-3 px-4">
          {filters.map((filter) => {
            const active = filter === activeFilter;
            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`rounded-full border px-5 py-2 ${active ? 'border-[#2E63DF] bg-[#2E63DF]' : 'border-[#CFD6E5] bg-[#E5EAF2]'}`}>
                <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-[#304567]'}`}>{filter}</Text>
              </Pressable>
            );
          })}
        </View>

        {showGroups ? (
          <View>
            <Text className="border-t border-slate-200 px-4 pb-2 pt-4 text-sm font-extrabold tracking-wider text-[#8C9BB4]">GROUP CHATS</Text>
            {visibleGroupChats.map((chat) => (
              <ChatListItem key={chat.id} {...chat} />
            ))}
          </View>
        ) : null}

        {showDirect ? (
          <View>
            <Text className="px-4 pb-2 pt-4 text-sm font-extrabold tracking-wider text-[#8C9BB4]">DIRECT MESSAGES</Text>
            {visibleDirectChats.map((chat) => (
              <ChatListItem key={chat.id} {...chat} />
            ))}
          </View>
        ) : null}
      </ScrollView>
      <BottomNav
        items={[
          { label: 'Home', icon: '🏠', onPress: () => router.replace('/(student)/home') },
          { label: 'Chats', icon: '💬', active: true, badge: unreadCount, onPress: () => router.replace('/(student)/chats') },
          { label: 'Notices', icon: '📢', onPress: () => router.replace('/(student)/announcements') },
          { label: 'Profile', icon: '👤', onPress: () => router.replace('/(student)/profile') },
        ]}
      />
    </SafeAreaView>
  );
}




