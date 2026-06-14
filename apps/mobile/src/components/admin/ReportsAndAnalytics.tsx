import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const filters = ['This Month', 'Last Month', 'Semester', 'Custom'] as const;

const reportButtons = [
  {
    icon: '📈',
    title: 'User Growth Report',
    subtitle: 'View growth trends',
    route: '/(admin)/analytics/user-growth-report',
    border: 'border-blue-300',
  },
  {
    icon: '🧾',
    title: 'Smart Audit',
    subtitle: 'System audit logs',
    route: '/(admin)/analytics/audith-log-screen',
    border: 'border-rose-300',
  },
  {
    icon: '🏫',
    title: 'Department Management',
    subtitle: 'Manage departments',
    route: '/(admin)/analytics/department-screen',
    border: 'border-emerald-300',
  },
  {
    icon: '📚',
    title: 'Course Overview',
    subtitle: 'Courses and usage',
    route: '/(admin)/analytics/course-overview',
    border: 'border-orange-300',
  },
] as const;

const stats = [
  { value: '1,248', label: 'Total Users', border: 'border-blue-300' },
  { value: '342', label: 'Online', border: 'border-emerald-300' },
  { value: '8.4K', label: 'Msgs', border: 'border-orange-300' },
];

const departments = [
  { name: 'Comp. Sci', rate: '85%', width: 'w-[85%]', color: 'bg-blue-500' },
  { name: 'Eng. Tech', rate: '62%', width: 'w-[62%]', color: 'bg-emerald-500' },
  { name: 'Business', rate: '47%', width: 'w-[47%]', color: 'bg-orange-400' },
  { name: 'Hospitality', rate: '33%', width: 'w-[33%]', color: 'bg-purple-500' },
];

const peakBars = [8, 10, 18, 28, 43, 58, 54, 48, 39, 55, 37, 20, 10];

export default function Analytics() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('This Month');

  return (
    <SafeAreaView className="flex-1 bg-[#0F2341]">
      <ScrollView
        className="flex-1 bg-[#EEF3FB]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View className="bg-[#0F2341] px-5 pb-5 pt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-extrabold text-white">Reports & Analytics</Text>
              <Text className="mt-1 text-xs font-semibold text-blue-200">
                January 2025 · HTU
              </Text>
            </View>

            <View className="h-8 w-8 items-center justify-center rounded-md bg-blue-600">
              <Text className="text-sm font-extrabold text-white">↓</Text>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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

          <View className="mt-4 flex-row flex-wrap justify-between">
            {reportButtons.map((item) => (
              <Pressable
                key={item.title}
                onPress={() => router.push(item.route as any)}
                className={`mb-3 w-[48.5%] rounded-[18px] border bg-white p-4 shadow-sm shadow-slate-200 ${item.border}`}
              >
                <Text className="text-2xl">{item.icon}</Text>
                <Text className="mt-3 text-sm font-extrabold text-slate-900">
                  {item.title}
                </Text>
                <Text className="mt-1 text-xs font-semibold text-slate-400">
                  {item.subtitle}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="mt-1 flex-row justify-between">
            {stats.map((item) => (
              <View
                key={item.label}
                className={`w-[31%] rounded-[18px] border bg-white px-3 py-4 ${item.border}`}
              >
                <Text className="text-center text-xl font-extrabold text-slate-900">
                  {item.value}
                </Text>
                <Text className="mt-1 text-center text-xs font-semibold text-slate-500">
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-4 rounded-[20px] bg-white p-4 shadow-sm shadow-slate-200">
            <Text className="text-sm font-extrabold text-slate-900">
              Engagement by Department
            </Text>

            {departments.map((dept) => (
              <View key={dept.name} className="mt-4">
                <View className="flex-row items-center">
                  <Text className="w-20 text-xs font-semibold text-slate-500">{dept.name}</Text>

                  <View className="flex-1">
                    <View className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <View className={`h-full rounded-full ${dept.width} ${dept.color}`} />
                    </View>
                  </View>

                  <Text className="ml-3 w-9 text-right text-xs font-bold text-slate-700">
                    {dept.rate}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View className="mt-4 rounded-[20px] bg-white p-4 shadow-sm shadow-slate-200">
            <Text className="text-sm font-extrabold text-slate-900">User Role Breakdown</Text>

            <View className="mt-4 flex-row items-center justify-between">
              <View className="flex-1">
                <View className="mb-3 flex-row items-center">
                  <View className="mr-2 h-3 w-3 rounded-full bg-blue-500" />
                  <Text className="flex-1 text-xs text-slate-500">Students</Text>
                  <Text className="text-xs font-extrabold text-slate-900">1,102</Text>
                </View>

                <View className="mb-3 flex-row items-center">
                  <View className="mr-2 h-3 w-3 rounded-full bg-orange-400" />
                  <Text className="flex-1 text-xs text-slate-500">Lecturers</Text>
                  <Text className="text-xs font-extrabold text-slate-900">140</Text>
                </View>

                <View className="flex-row items-center">
                  <View className="mr-2 h-3 w-3 rounded-full bg-rose-500" />
                  <Text className="flex-1 text-xs text-slate-500">Admin</Text>
                  <Text className="text-xs font-extrabold text-slate-900">6</Text>
                </View>
              </View>

              <View className="ml-5 h-20 w-20 items-center justify-center rounded-full border-[10px] border-blue-500">
                <Text className="text-lg font-extrabold text-slate-900">88%</Text>
                <Text className="text-[10px] font-semibold text-blue-500">Students</Text>
              </View>
            </View>
          </View>

          <View className="mt-4 rounded-[20px] bg-white p-4 shadow-sm shadow-slate-200">
            <Text className="text-sm font-extrabold text-slate-900">Peak Activity Hours</Text>

            <View className="mt-5 flex-row items-end justify-between">
              {peakBars.map((height, index) => (
                <View
                  key={index}
                  style={{ height }}
                  className={`w-4 rounded-t-md ${
                    index >= 4 && index <= 8 ? 'bg-blue-600' : 'bg-blue-200'
                  }`}
                />
              ))}
            </View>

            <View className="mt-2 flex-row justify-between">
              <Text className="text-[10px] text-slate-400">6am</Text>
              <Text className="text-[10px] font-bold text-blue-600">12pm</Text>
              <Text className="text-[10px] text-slate-400">6pm</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}