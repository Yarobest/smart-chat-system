import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BackButton } from '@/src/components/common/BackButton';

const filters = ['All', 'CS Dept', 'ET Dept', 'Low Activity'] as const;

const activeCourses = [
  {
    title: 'Data Structures & Algorithms',
    meta: 'CS301 · Mr. Agordzo · 32 students',
    badge: '🔥 Hot',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-600',
    count: '1,842',
    color: 'bg-blue-500',
    light: 'bg-blue-200',
  },
  {
    title: 'Computer Networks',
    meta: 'CS205 · Mr. Agordzo · 28 students',
    badge: 'Active',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-600',
    count: '1,204',
    color: 'bg-emerald-500',
    light: 'bg-emerald-200',
  },
];

export default function CourseOverview() {
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
              <BackButton fallbackRoute="/(admin)/analytics/reports-and-analytics" />
              <View>
                <Text className="text-xl font-extrabold text-white">Course Overview</Text>
              <Text className="mt-1 text-xs font-semibold text-blue-200">
                48 active courses · HTU
              </Text>
              </View>
            </View>

            <Pressable className="h-9 w-9 items-center justify-center rounded-md bg-blue-600">
              <Text className="text-xl font-bold text-white">+</Text>
            </Pressable>
          </View>
        </View>

        <View className="px-5 pt-4">
          <View className="flex-row items-center rounded-[14px] border border-slate-300 bg-slate-100 px-4 py-3">
            <Text className="mr-2 text-lg">🔍</Text>
            <TextInput
              placeholder="Search courses..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-sm text-slate-700"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
            {filters.map((filter) => {
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

          <Text className="mt-5 text-xs font-extrabold tracking-wide text-slate-400">
            MOST ACTIVE
          </Text>

          {activeCourses.map((course) => (
            <View
              key={course.title}
              className="mt-2 rounded-[20px] border border-blue-500 bg-white p-4 shadow-sm shadow-slate-200"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-base font-extrabold text-slate-900">
                    {course.title}
                  </Text>
                  <Text className="mt-1 text-xs text-slate-400">{course.meta}</Text>
                </View>

                <View className={`rounded-md px-3 py-1 ${course.badgeBg}`}>
                  <Text className={`text-[10px] font-extrabold ${course.badgeText}`}>
                    {course.badge}
                  </Text>
                </View>
              </View>

              <View className="mt-4 flex-row items-end justify-between">
                {[18, 28, 38, 30, 48, 22, 16].map((height, index) => (
                  <View
                    key={index}
                    style={{ height }}
                    className={`w-8 rounded-t-sm ${
                      index === 2 || index === 4 ? course.color : course.light
                    }`}
                  />
                ))}

                <Text className="ml-3 text-sm font-extrabold text-blue-600">
                  {course.count}
                </Text>
              </View>
            </View>
          ))}

          <Text className="mt-5 text-xs font-extrabold tracking-wide text-slate-400">
            NEEDS ATTENTION
          </Text>

          <View className="mt-2 rounded-[20px] border border-blue-500 bg-white p-4 shadow-sm shadow-slate-200">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-base font-extrabold text-slate-900">
                  Tourism Management
                </Text>
                <Text className="mt-1 text-xs text-slate-400">
                  TM201 · 44 students · No lecturer
                </Text>
              </View>

              <View className="rounded-md bg-rose-50 px-3 py-1">
                <Text className="text-[10px] font-extrabold text-rose-500">⚠️ LOW</Text>
              </View>
            </View>

            <Text className="mt-3 text-xs leading-5 text-slate-500">
              Only 12 messages in 30 days. Assign a lecturer to activate group.
            </Text>

            <Pressable className="mt-4 rounded-lg bg-rose-50 py-3">
              <Text className="text-center text-xs font-extrabold text-rose-500">
                Assign Lecturer →
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
