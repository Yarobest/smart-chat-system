import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { StatusBar } from '@/src/components/common/StatusBar';
import { BottomNav } from '@/src/components/common/BottomNav';

type FilterTab = 'All' | 'From Admin' | 'My Posts' | 'Urgent';
type BadgeType = 'URGENT' | 'STAFF' | 'YOU POSTED';

interface Announcement {
  id: string;
  title: string;
  body: string;
  by: string;
  date: string;
  badge?: BadgeType;
  borderColor: string;
  icon: string;
  filter: ('All' | 'From Admin' | 'My Posts' | 'Urgent')[];
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Exam Timetable Released',
    body: 'End of semester exams begin January 20. Please ensure all coursework marks are submitted by January 18 to the Academic Registrar.',
    by: 'Academic Registrar',
    date: 'Jan 15',
    badge: 'URGENT',
    borderColor: '#EF4444',
    icon: '🚀',
    filter: ['All', 'From Admin', 'Urgent'],
  },
  {
    id: '2',
    title: 'Staff Meeting – Jan 17',
    body: 'All lecturers are required to attend the departmental staff meeting on Friday January 17 at 10AM in Block B Room 100.',
    by: 'Dept. Head, CS',
    date: 'Jan 14',
    badge: 'STAFF',
    borderColor: '#F59E0B',
    icon: '📋',
    filter: ['All', 'From Admin'],
  },
  {
    id: '3',
    title: 'CS301 Assignment 3 Reminder',
    body: 'Assignment 3 on Tree Algorithms is due Friday January 17 at 5PM. Late submissions will not be accepted.',
    by: 'You — CS301 (32 students)',
    date: 'Jan 14',
    badge: 'YOU POSTED',
    borderColor: '#3B82F6',
    icon: '📘',
    filter: ['All', 'My Posts'],
  },
  {
    id: '4',
    title: 'CS205 Quiz Next Week',
    body: 'There will be a short quiz on OSI model and TCP/IP protocols next Monday. Please revise chapters 3 and 4.',
    by: 'You — CS205 (28 students)',
    date: 'Jan 13',
    badge: 'YOU POSTED',
    borderColor: '#3B82F6',
    icon: '📗',
    filter: ['All', 'My Posts'],
  },
  {
    id: '5',
    title: 'Library Extended Hours',
    body: 'The university library will be open until 10PM from January 13 to January 20 to support students during the exam period.',
    by: 'Library Services',
    date: 'Jan 13',
    borderColor: '#8B5CF6',
    icon: '📚',
    filter: ['All', 'From Admin'],
  },
  {
    id: '6',
    title: 'Grade Submission Deadline',
    body: 'All final grades must be submitted to the Academic Office by January 25. Please use the online portal for submission.',
    by: 'Academic Office',
    date: 'Jan 12',
    badge: 'URGENT',
    borderColor: '#EF4444',
    icon: '⚠️',
    filter: ['All', 'From Admin', 'Urgent'],
  },
];

function getBadgeStyle(badge: BadgeType): { bg: string; text: string } {
  switch (badge) {
    case 'URGENT':
      return { bg: '#FEF2F2', text: '#EF4444' };
    case 'STAFF':
      return { bg: '#FFFBEB', text: '#D97706' };
    case 'YOU POSTED':
      return { bg: '#EFF6FF', text: '#3B82F6' };
  }
}

export default function LecturerAnnouncementsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

  const filters: FilterTab[] = ['All', 'From Admin', 'My Posts', 'Urgent'];

  const filtered = ANNOUNCEMENTS.filter((a) => a.filter.includes(activeFilter));

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="flex-1 bg-white">

        {/* Header */}
        <View className="bg-[#051839] px-4 pb-4 pt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-extrabold text-white">Announcements</Text>
              <Text className="text-xs text-slate-400">Received · 2 unread</Text>
            </View>
            <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Text className="text-base">🔔</Text>
            </Pressable>
          </View>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
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

        {/* Announcements List */}
        <ScrollView
          className="flex-1 bg-[#F5F7FA]"
          contentContainerStyle={{ padding: 16, paddingBottom: 12, gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <View className="mt-20 items-center justify-center">
              <Text className="text-4xl">📭</Text>
              <Text className="mt-3 text-base font-semibold text-slate-400">
                No announcements found
              </Text>
            </View>
          ) : (
            filtered.map((item) => (
              <Pressable
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                style={{ borderLeftWidth: 4, borderLeftColor: item.borderColor }}
              >
                <View className="px-4 pt-4">
                  {/* Title + Badge */}
                  <View className="flex-row items-start justify-between gap-2">
                    <View className="flex-row flex-1 items-center gap-2">
                      <Text className="text-base">{item.icon}</Text>
                      <Text className="flex-1 text-sm font-extrabold text-slate-900">
                        {item.title}
                      </Text>
                    </View>
                    {item.badge && (
                      <View
                        className="rounded-md px-2.5 py-1"
                        style={{ backgroundColor: getBadgeStyle(item.badge).bg }}
                      >
                        <Text
                          className="text-xs font-bold"
                          style={{ color: getBadgeStyle(item.badge).text }}
                        >
                          {item.badge}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Body */}
                  <Text className="mt-2 text-sm leading-5 text-slate-500">{item.body}</Text>
                </View>

                {/* Footer */}
                <View className="mt-3 flex-row items-center justify-between border-t border-slate-100 px-4 py-3">
                  <Text className="text-xs text-slate-400">
                    By <Text className="font-bold text-slate-600">{item.by}</Text>
                  </Text>
                  <Text className="text-xs text-slate-400">{item.date}</Text>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>

        <BottomNav
          items={[
            { label: 'Home', icon: '🏠', onPress: () => router.replace('/(lecturer)/home') },
            { label: 'Chats', icon: '💬', badge: 7, onPress: () => router.replace('/(lecturer)/chats') },
            { label: 'Notices', icon: '📢', active: true, onPress: () => router.replace('/(lecturer)/announcements') },
            { label: 'Profile', icon: '👤', onPress: () => router.replace('/(lecturer)/profile') },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}