import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav } from '@/src/components/common/BottomNav';
import { StatusBar } from '@/src/components/common/StatusBar';

const filters = ['This Month', 'Last Month', 'Semester', 'Custom'] as const;

const summaryCards = [
  { label: 'Total Users', value: '1,248', accent: '#3E73E6' },
  { label: 'Online', value: '342', accent: '#4BC391' },
  { label: 'Msgs', value: '8.4K', accent: '#E7A430' },
] as const;

const departmentEngagement = [
  { label: 'Comp. Sci', value: 85, color: '#3E73E6' },
  { label: 'Eng. Tech', value: 62, color: '#4BC391' },
  { label: 'Business', value: 47, color: '#E7A430' },
  { label: 'Hospitality', value: 33, color: '#7C5CF4' },
] as const;

const userRoles = [
  { label: 'Students', value: '1,102', color: '#3E73E6' },
  { label: 'Lecturers', value: '140', color: '#F1B545' },
  { label: 'Admin', value: '6', color: '#F06157' },
] as const;

const activityBars = [
  { label: '6am', height: 10, active: false },
  { label: '', height: 8, active: false },
  { label: '', height: 16, active: false },
  { label: '', height: 34, active: false },
  { label: '', height: 52, active: false },
  { label: '12pm', height: 64, active: true },
  { label: '', height: 62, active: true },
  { label: '', height: 46, active: false },
  { label: '', height: 68, active: true },
  { label: '', height: 50, active: false },
  { label: '', height: 36, active: false },
  { label: '6pm', height: 20, active: false },
] as const;

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <View className="w-[31.5%] rounded-[20px] bg-white px-3 py-4 shadow-sm shadow-slate-200">
      <View className="mb-3 h-1.5 w-12 rounded-full" style={{ backgroundColor: accent }} />
      <Text className="text-2xl font-extrabold text-slate-900">{value}</Text>
      <Text className="mt-2 text-xs font-medium text-slate-400">{label}</Text>
    </View>
  );
}

export default function AuditLogScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('This Month');

  return (
    <SafeAreaView className="flex-1 bg-[#1A2E57]" edges={['top']}>
      <StatusBar style="light" backgroundColor="#1A2E57" />
      <View className="flex-1 bg-[#EEF3FB]">
        <View
          className="bg-[#1A2E57] px-5 pb-6"
          style={{ paddingTop: Math.max(insets.top, 4) }}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="-mt-4 text-3xl font-extrabold text-white">
                Reports & Analytics
              </Text>
              <Text className="mt-1 text-sm font-medium text-white/70">January 2025 · HTU</Text>
            </View>

            <Pressable className="mt-1 h-11 w-11 items-center justify-center rounded-2xl bg-white/10 active:bg-white/20">
              <Text className="text-lg text-white">⇩</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 pb-6 pt-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 12 }}
            >
              {filters.map((filter) => {
                const active = filter === activeFilter;
                return (
                  <Pressable
                    key={filter}
                    onPress={() => setActiveFilter(filter)}
                    className={`mr-3 rounded-full border px-5 py-3 ${
                      active
                        ? 'border-blue-500 bg-[#3E73E6]'
                        : 'border-slate-200 bg-[#F6F8FC]'
                    }`}
                  >
                    <Text
                      className={`text-sm font-bold ${
                        active ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View className="mt-5 flex-row justify-between">
              {summaryCards.map((card) => (
                <SummaryCard key={card.label} {...card} />
              ))}
            </View>

            <View className="mt-5 rounded-[24px] bg-white px-4 py-5 shadow-sm shadow-slate-200">
              <Text className="text-xl font-extrabold text-slate-900">
                Engagement by Department
              </Text>

              <View className="mt-5">
                {departmentEngagement.map((item) => (
                  <View key={item.label} className="mb-4 last:mb-0">
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="text-base font-medium text-slate-500">{item.label}</Text>
                      <Text className="text-base font-extrabold text-slate-500">{item.value}%</Text>
                    </View>

                    <View className="h-3 overflow-hidden rounded-full bg-[#E8EEF9]">
                      <View
                        className="h-full rounded-full"
                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View className="mt-5 rounded-[24px] bg-white px-4 py-5 shadow-sm shadow-slate-200">
              <Text className="text-xl font-extrabold text-slate-900">User Role Breakdown</Text>

              <View className="mt-5 flex-row items-center">
                <View className="flex-1 pr-3">
                  {userRoles.map((role) => (
                    <View key={role.label} className="mb-4 flex-row items-center last:mb-0">
                      <View
                        className="mr-3 h-3.5 w-3.5 rounded-full"
                        style={{ backgroundColor: role.color }}
                      />
                      <Text className="flex-1 text-base font-medium text-slate-500">
                        {role.label}
                      </Text>
                      <Text className="text-base font-extrabold text-slate-800">{role.value}</Text>
                    </View>
                  ))}
                </View>

                <View className="items-center justify-center">
                  <View className="h-28 w-28 items-center justify-center rounded-full border-[10px] border-[#3E73E6]">
                    <View className="absolute h-28 w-28 rounded-full border-[10px] border-[#F1B545] border-l-transparent border-b-transparent" />
                    <View className="absolute h-28 w-28 rounded-full border-[10px] border-[#F06157] border-r-transparent border-b-transparent" />
                    <Text className="text-2xl font-extrabold text-slate-900">88%</Text>
                    <Text className="-mt-1 text-sm font-medium text-slate-400">Students</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="mt-5 rounded-[24px] bg-white px-4 py-5 shadow-sm shadow-slate-200">
              <Text className="text-xl font-extrabold text-slate-900">Peak Activity Hours</Text>

              <View className="mt-6">
                <View className="flex-row items-end justify-between">
                  {activityBars.map((bar, index) => (
                    <View key={`${bar.label}-${index}`} className="items-center">
                      <View
                        className={`w-5 rounded-t-[8px] ${
                          bar.active ? 'bg-[#3E73E6]' : 'bg-[#C9D8FA]'
                        }`}
                        style={{ height: bar.height }}
                      />
                    </View>
                  ))}
                </View>

                <View className="mt-3 flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-slate-300">6am</Text>
                  <Text className="text-sm font-extrabold text-[#3E73E6]">12pm</Text>
                  <Text className="text-sm font-semibold text-slate-300">6pm</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <BottomNav
          items={[
            { label: 'Home', icon: '🏠', onPress: () => router.replace('/(admin)/dashboard') },
            { label: 'Users', icon: '👥', onPress: () => router.replace('/(admin)/users') },
            { label: 'Reports', icon: '📊', active: true, badge: 3, onPress: () => router.replace('/(admin)/audit') },
            { label: 'Settings', icon: '⚙️', onPress: () => router.replace('/(admin)/broadcast') },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}
