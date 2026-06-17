import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BackButton } from '@/src/components/common/BackButton';

const filters = ['All', 'Urgent', 'Admin', 'Lecturers'] as const;

const broadcasts = [
  {
    title: '📌 Exam Timetable Released',
    message: 'End of semester exams begin January 20. Check the portal for timetable.',
    tag: 'URGENT',
    tagStyle: 'bg-rose-50 text-rose-500',
    delivered: '1,248',
    read: '987',
    rate: '79%',
    date: 'Jan 15',
  },
  {
    title: '📋 Staff Meeting - Jan 17',
    message: 'All lecturers at departmental meeting Friday Jan 17 at 10AM in Block B.',
    tag: 'STAFF',
    tagStyle: 'bg-orange-50 text-orange-500',
    delivered: '146',
    read: '138',
    rate: '95%',
    date: 'Jan 14',
  },
  {
    title: '🎓 Graduation Ceremony',
    message: '2024 graduation March 15. Confirm gown sizes at Academic Affairs by Feb 1.',
    tag: 'GENERAL',
    tagStyle: 'bg-blue-50 text-blue-500',
    delivered: '1,248',
    read: '742',
    rate: '59%',
    date: 'Jan 10',
  },
];

export default function BroadcastHistory() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All');

  return (
    <SafeAreaView className="flex-1 bg-[#0F2341]">
      <ScrollView
        className="flex-1 bg-[#EEF3FB]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View className="bg-[#0F2341] px-5 pb-5 pt-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <BackButton fallbackRoute="/(admin)/broadcast/broad-cast" />
              <View>
                <Text className="text-xl font-extrabold text-white">Broadcast History</Text>
              <Text className="mt-1 text-xs font-semibold text-blue-200">
                27 announcements sent
              </Text>
              </View>
            </View>

            <View className="h-8 w-8 items-center justify-center rounded-md bg-blue-600">
              <Text className="text-sm font-extrabold text-white">↓</Text>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filter, index) => {
              const active = activeFilter === filter;

              return (
                <Pressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  className={`mr-2 rounded-full px-4 py-2 ${
                    active ? 'bg-blue-600' : 'bg-white'
                  }`}
                >
                  <Text
                    className={`text-xs font-extrabold ${
                      active ? 'text-white' : 'text-slate-600'
                    }`}
                  >
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View className="mt-4">
            {broadcasts.map((item) => (
              <View
                key={item.title}
                className="mb-3 rounded-[20px] bg-white p-4 shadow-sm shadow-slate-200"
              >
                <View className="flex-row items-start justify-between">
                  <Text className="flex-1 text-sm font-extrabold text-slate-900">
                    {item.title}
                  </Text>

                  <View
                    className={`ml-2 rounded-md px-2 py-1 ${
                      item.tag === 'URGENT'
                        ? 'bg-rose-50'
                        : item.tag === 'STAFF'
                          ? 'bg-orange-50'
                          : 'bg-blue-50'
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-extrabold ${
                        item.tag === 'URGENT'
                          ? 'text-rose-500'
                          : item.tag === 'STAFF'
                            ? 'text-orange-500'
                            : 'text-blue-500'
                      }`}
                    >
                      {item.tag}
                    </Text>
                  </View>
                </View>

                <Text className="mt-2 text-xs leading-5 text-slate-500">{item.message}</Text>

                <View className="my-3 h-px bg-slate-100" />

                <View className="flex-row items-end justify-between">
                  <View className="flex-row">
                    <View className="mr-4">
                      <Text className="text-sm font-extrabold text-emerald-500">
                        {item.delivered}
                      </Text>
                      <Text className="text-[10px] text-slate-400">Delivered</Text>
                    </View>

                    <View className="mr-4">
                      <Text className="text-sm font-extrabold text-blue-500">{item.read}</Text>
                      <Text className="text-[10px] text-slate-400">Read</Text>
                    </View>

                    <View>
                      <Text className="text-sm font-extrabold text-slate-900">{item.rate}</Text>
                      <Text className="text-[10px] text-slate-400">Rate</Text>
                    </View>
                  </View>

                  <Text className="text-xs text-slate-400">{item.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
