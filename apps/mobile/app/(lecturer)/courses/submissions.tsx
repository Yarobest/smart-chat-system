import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';

const SUBMISSION_DATA = {
  submitted: [
    { id: 1, name: 'Stephen Appiah', initials: 'SA', time: 'Submitted at 10:12 AM', score: '87%', color: '#3B82F6' },
    { id: 2, name: 'Rudolf Gavor', initials: 'RG', time: 'Submitted at 10:34 AM', score: '80%', color: '#10B981' },
    { id: 3, name: 'Abena Asante', initials: 'AA', time: 'Submitted at 11:05 AM', score: '73%', color: '#F59E0B' },
    { id: 4, name: 'Efua Owusu', initials: 'EO', time: 'Submitted at 11:22 AM', score: '67%', color: '#8B5CF6' },
  ],
  notYetSubmitted: [
    { id: 5, name: 'Bright Koffi', initials: 'BK', time: 'Not submitted yet', color: '#EF4444' },
    { id: 6, name: 'Jojo Agyeman', initials: 'JA', time: 'Not submitted yet', color: '#06B6D4' },
    { id: 7, name: 'Mavis Asante', initials: 'MA', time: 'Not submitted yet', color: '#F97316' },
  ],
};

export default function SubmissionsScreen() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'submitted' | 'notyet'>('all');

  const stats = [
    { label: 'Submitted', value: '18', color: '#10B981' },
    { label: 'Not Yet', value: '14', color: '#3B82F6' },
    { label: 'In Progress', value: '0', color: '#D1D5DB' },
    { label: 'Total', value: '32', color: '#6B7280' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="bg-[#051839] px-4 pb-5 pt-6">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-3">
          <Text className="text-2xl text-white">‹</Text>
          <View>
            <Text className="text-2xl font-extrabold text-white">CS301 Submissions</Text>
            <Text className="text-sm text-slate-300">Mid-Semester Quiz</Text>
          </View>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 bg-[#F5F7FA]"
        contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Submission Overview Card */}
        <View className="rounded-[28px] bg-white px-5 py-4 shadow-black/5" style={{ elevation: 3 }}>
          <Text className="text-base font-extrabold text-slate-900 mb-4">Submission Overview</Text>

          {/* Stats Grid */}
          <View className="flex-row flex-wrap gap-3 mb-4">
            {stats.map((stat) => (
              <View key={stat.label} className="flex-1 min-w-[45%] rounded-2xl bg-slate-50 px-3 py-3 items-center">
                <Text className="text-xl font-extrabold" style={{ color: stat.color }}>
                  {stat.value}
                </Text>
                <Text className="text-xs text-slate-500 mt-1">{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Progress Bar */}
          <View className="h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
            <View className="h-full w-[56%] rounded-full" style={{ backgroundColor: '#10B981' }} />
          </View>
          <Text className="text-xs text-slate-500">56% submitted · Closes at 5:00 PM today</Text>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row gap-2">
          {[
            { id: 'all', label: 'All (32)' },
            { id: 'submitted', label: 'Submitted (18)' },
            { id: 'notyet', label: 'Not Yet (14)' },
          ].map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveFilter(tab.id as any)}
              className={`flex-1 rounded-full px-3 py-2 items-center ${
                activeFilter === tab.id ? 'bg-blue-600' : 'bg-slate-100'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${activeFilter === tab.id ? 'text-white' : 'text-slate-600'}`}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Submitted Section */}
        {(activeFilter === 'all' || activeFilter === 'submitted') && (
          <>
            <Text className="text-xs uppercase tracking-[0.18rem] font-semibold text-slate-400">Submitted</Text>
            <View className="space-y-3">
              {SUBMISSION_DATA.submitted.map((student) => (
                <View
                  key={student.id}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center"
                      style={{ backgroundColor: student.color }}
                    >
                      <Text className="text-sm font-bold text-white">{student.initials}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-slate-900">{student.name}</Text>
                      <Text className="text-xs text-slate-500 mt-1">{student.time}</Text>
                    </View>
                  </View>
                  <Text className="text-sm font-bold text-emerald-600">{student.score}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Not Yet Submitted Section */}
        {(activeFilter === 'all' || activeFilter === 'notyet') && (
          <>
            <Text className="text-xs uppercase tracking-[0.18rem] font-semibold text-slate-400 mt-4">
              Not Yet Submitted
            </Text>
            <View className="space-y-3">
              {SUBMISSION_DATA.notYetSubmitted.map((student) => (
                <View
                  key={student.id}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center"
                      style={{ backgroundColor: student.color }}
                    >
                      <Text className="text-sm font-bold text-white">{student.initials}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-slate-900">{student.name}</Text>
                      <Text className="text-xs text-slate-500 mt-1">{student.time}</Text>
                    </View>
                  </View>
                  <Text className="text-xs font-semibold text-slate-400">Pending</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Action Buttons */}
        <View className="flex-col gap-3 mt-4">
          <Pressable
            onPress={() => router.push('/courses/results')}
            className="w-full rounded-full bg-blue-600 px-4 py-3 items-center"
          >
            <Text className="text-sm font-semibold text-white">📊 View Course Results</Text>
          </Pressable>
          <View className="flex-row gap-3">
            <Pressable className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 items-center">
              <Text className="text-sm font-semibold text-slate-700">📊 Export CSV</Text>
            </Pressable>
            <Pressable className="flex-1 rounded-full bg-slate-600 px-4 py-3 items-center">
              <Text className="text-sm font-semibold text-white">📈 Full Report</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
