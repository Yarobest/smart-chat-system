import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { BottomNav } from '@/src/components/common/BottomNav';
import { FilterRow } from '@/src/components/common/FilterRow';
import { Tag } from '@/src/components/common/Tag';

const unreadCount = 12;

const notices = [
  {
    id: '1',
    title: '📌 Exam Timetable Released',
    body: 'End of semester exams begin January 20, 2025. Please check the notice board or student portal for your personal timetable and venue assignments.',
    author: 'Academic Registrar',
    date: 'Jan 15, 2025',
    tone: 'red' as const,
    tag: 'URGENT',
    category: 'Academic',
  },
  {
    id: '2',
    title: '📚 CS301 Assignment Due Reminder',
    body: 'Assignment 3 on Tree Algorithms is due this Friday, January 17 at 5PM. Submit through the student portal. Late submissions will not be accepted.',
    author: 'Mr. G. Agordzo',
    date: 'Jan 14, 2025',
    tone: 'blue' as const,
    tag: 'COURSE',
    category: 'Academic',
  },
  {
    id: '3',
    title: '🎓 Graduation Ceremony Notice',
    body: 'Graduation rehearsal starts next Wednesday at 10AM in the main auditorium. Final-year students should attend.',
    author: 'Student Affairs',
    date: 'Jan 12, 2025',
    tone: 'green' as const,
    tag: 'GENERAL',
    category: 'Events',
  },
];

export default function AnnouncementsListScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Academic', 'Exams', 'Events'];

  const filteredNotices =
    activeFilter === 'All'
      ? notices
      : notices.filter((notice) =>
          activeFilter === 'Exams' ? notice.tag === 'URGENT' : notice.category === activeFilter
        );

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />

      <View className="bg-[#051839] px-6 pb-5 pt-6">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-lg font-bold text-white">Announcements</Text>
            <Text className="text-lg text-white/80">Official campus notices</Text>
          </View>
          <Text className="mt-2 text-lg">🔔</Text>
        </View>
      </View>

      <ScrollView className="flex-1 bg-[#F3F5F8]" contentContainerStyle={{ paddingBottom: 12 }}>
        <View className="pt-2">
          <FilterRow filters={filters} active={activeFilter} onSelect={setActiveFilter} />
        </View>

        <View className="border-t border-slate-200 px-4 pb-2 pt-3">
          {filteredNotices.map((notice) => {
            const borderClass =
              notice.tone === 'red'
                ? 'border-l-red-400'
                : notice.tone === 'green'
                ? 'border-l-emerald-500'
                : 'border-l-blue-500';

            return (
              <View
                key={notice.id}
                className={`mb-3 rounded-3xl border-l-4 ${borderClass} bg-white px-4 py-4`}>
                <View className="flex-row items-center justify-between">
                  <Text className="mr-3 flex-1 text-lg font-bold text-slate-900">{notice.title}</Text>
                  <Tag label={notice.tag} tone={notice.tone} />
                </View>

                <Text className="mt-2 text-sm leading-6 text-slate-600">{notice.body}</Text>

                <View className="mt-3 border-t border-slate-200 pt-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-slate-500">
                      By <Text className="font-semibold text-slate-600">{notice.author}</Text>
                    </Text>
                    <Text className="text-sm text-slate-400">{notice.date}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <BottomNav
        items={[
          { label: 'Home', icon: '🏠', onPress: () => router.replace('/(student)/home') },
          { label: 'Chats', icon: '💬', badge: unreadCount, onPress: () => router.replace('/(student)/chats') },
          { label: 'Notices', icon: '📢', active: true, onPress: () => router.replace('/(student)/announcements') },
          { label: 'Profile', icon: '👤', onPress: () => router.replace('/(student)/profile') },
        ]}
      />
    </SafeAreaView>
  );
}




