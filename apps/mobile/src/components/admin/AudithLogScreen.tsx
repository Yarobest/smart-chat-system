import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const filters = ['All', 'Security', 'Broadcasts', 'Users', 'System'] as const;

const logs = [
  {
    icon: '🚨',
    title: 'Login attempt blocked',
    time: '09:28',
    message: 'Kofi Agyemang (0323080310) · 3 failed attempts · IP auto-blocked',
    tags: ['SECURITY', 'AUTO-BLOCK'],
    color: 'rose',
  },
  {
    icon: '👤',
    title: 'New user registered',
    time: '09:15',
    message: 'Ama Yeboah (0323080421) · Student · CS Dept · Awaiting verification',
    tags: ['REGISTRATION', 'PENDING'],
    color: 'amber',
  },
  {
    icon: '📣',
    title: 'Announcement posted',
    time: '08:45',
    message: 'Mr. Agordzo → CS301 (32 recipients) · Assignment 3 deadline',
    tags: ['ANNOUNCEMENT', 'CS301'],
    color: 'blue',
  },
  {
    icon: '⚑',
    title: 'Message flagged',
    time: '07:30',
    message: 'CS301 group · Flagged by 3 students · Status: Under review',
    tags: ['FLAGGED', 'REVIEW'],
    color: 'purple',
  },
  {
    icon: '🚫',
    title: 'Account suspended',
    time: 'Jan 14',
    message: 'Kofi Agyemang (0323080310) · Reason: Inappropriate messaging',
    tags: ['SUSPENSION', 'ADMIN ACTION'],
    color: 'rose',
  },
  {
    icon: '📣',
    title: 'Campus broadcast sent',
    time: 'Jan 10',
    message: 'Admin → All 1,248 users · “Exam Timetable Released” · Urgent',
    tags: ['BROADCAST', 'ALL CAMPUS'],
    color: 'emerald',
  },
  {
    icon: '💾',
    title: 'Auto backup completed',
    time: 'Jan 9',
    message: '8,421 messages archived · 3.9 GB · Duration 4m 12s · No errors',
    tags: ['SYSTEM', 'BACKUP'],
    color: 'blue',
  },
];

function tagStyle(color: string) {
  if (color === 'rose') return 'bg-rose-50 text-rose-500';
  if (color === 'amber') return 'bg-amber-50 text-amber-600';
  if (color === 'purple') return 'bg-purple-50 text-purple-500';
  if (color === 'emerald') return 'bg-emerald-50 text-emerald-600';
  return 'bg-blue-50 text-blue-600';
}

export default function AuditLogScreen() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-[#0F2341]">
      <ScrollView
        className="flex-1 bg-[#EEF3FB]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View className="bg-[#0F2341] px-5 pb-5 pt-4">
          <View className="flex-row items-center justify-between">
            <Pressable onPress={() => router.back()} className="flex-row items-center">
              <Text className="mr-2 text-2xl text-white">‹</Text>
              <View>
                <Text className="text-xl font-extrabold text-white">Audit Log</Text>
              <Text className="mt-1 text-xs font-semibold text-blue-200">
                Complete action history
              </Text>
              </View>
            </Pressable>

            <View className="h-8 w-8 items-center justify-center rounded-md bg-blue-600">
              <Text className="text-sm font-extrabold text-white">↓</Text>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <View className="flex-row items-center rounded-[14px] border border-slate-300 bg-slate-100 px-4 py-3">
            <Text className="mr-2 text-lg">🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by user, action, date..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-sm text-slate-700"
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
          >
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

          <View className="mt-4 overflow-hidden rounded-[20px] bg-white shadow-sm shadow-slate-200">
            {logs.map((log, index) => (
              <View
                key={`${log.title}-${index}`}
                className={`px-4 py-4 ${
                  index !== logs.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <View className="flex-row items-start justify-between">
                  <Text className="flex-1 text-sm font-extrabold text-slate-900">
                    {log.icon} {log.title}
                  </Text>

                  <Text className="ml-2 text-xs font-semibold text-slate-400">
                    {log.time}
                  </Text>
                </View>

                <Text className="mt-1 text-xs leading-5 text-slate-500">
                  {log.message}
                </Text>

                <View className="mt-3 flex-row flex-wrap">
                  {log.tags.map((tag) => (
                    <View
                      key={tag}
                      className={`mr-2 mb-2 rounded-md px-2 py-1 ${
                        tagStyle(log.color).split(' ')[0]
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-extrabold ${
                          tagStyle(log.color).split(' ')[1]
                        }`}
                      >
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
