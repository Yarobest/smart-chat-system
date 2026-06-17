import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from '@/src/components/common/StatusBar';
import { BackButton } from '@/src/components/common/BackButton';

const filters = ['All', 'Security', 'System', 'Users', 'Alerts'] as const;

const notifications = [
  {
    id: '1',
    section: 'Requires Action',
    category: 'Security',
    title: 'Suspicious Login Blocked',
    icon: '🚨',
    dot: 'bg-red-400',
    accent: 'text-red-500',
    message: 'Kofi Agyemang (0323080310) · 3 failed attempts · IP auto-blocked',
    actions: [
      { label: 'Dismiss', tone: 'bg-slate-100 text-slate-600' },
      { label: 'Review', tone: 'bg-red-50 text-red-500' },
    ],
    meta: '09:28 · just now',
  },
  {
    id: '2',
    section: 'Requires Action',
    category: 'Users',
    title: 'New User Pending Verification',
    icon: '⏳',
    dot: 'bg-blue-500',
    accent: 'text-slate-900',
    message: 'Ama Yeboah (0323080421) · CS Dept · Awaiting your approval',
    actions: [
      { label: 'Reject', tone: 'bg-red-50 text-red-500' },
      { label: 'Approve', tone: 'bg-emerald-50 text-emerald-600' },
    ],
    meta: '09:15 · 26 min ago',
  },
  {
    id: '3',
    section: 'Requires Action',
    category: 'System',
    title: 'Message Flagged for Review',
    icon: '🚩',
    dot: 'bg-violet-500',
    accent: 'text-violet-500',
    message: 'CS301 group · Message ID: msg_8821 · Flagged by 3 students',
    actions: [
      { label: 'View Message', tone: 'bg-violet-50 text-violet-500' },
      { label: 'Remove', tone: 'bg-red-50 text-red-500' },
    ],
    meta: '07:30 · 2h ago',
  },
  {
    id: '4',
    section: 'Informational',
    category: 'System',
    title: 'Storage at 78% Capacity',
    icon: '💾',
    dot: 'bg-amber-400',
    accent: 'text-amber-600',
    message: '3.9 GB / 5 GB · Run auto-archive or expand storage',
    actions: [],
    meta: '6h ago',
  },
  {
    id: '5',
    section: 'Informational',
    category: 'Users',
    title: 'Broadcast Delivered to 1,248',
    icon: '📢',
    dot: 'bg-slate-200',
    accent: 'text-slate-700',
    message: '"Exam Timetable Released" · 79% read rate',
    actions: [],
    meta: 'Jan 15',
  },
  {
    id: '6',
    section: 'Informational',
    category: 'System',
    title: 'Weekly Backup Completed',
    icon: '☁️',
    dot: 'bg-slate-200',
    accent: 'text-slate-700',
    message: '8,421 messages archived · No errors · 4m 12s',
    actions: [],
    meta: 'Jan 13',
  },
] as const;

const securityAlerts = [
  {
    title: 'Suspicious Login',
    level: 'HIGH',
    color: 'text-red-500',
    border: 'border-red-200',
    icon: '🚨',
    summary: '3 failed · Kofi Agyemang · IP 102.89.xx.xx',
    primary: 'Block IP',
    secondary: 'Dismiss',
  },
  {
    title: 'Message Flagged',
    level: 'MEDIUM',
    color: 'text-amber-600',
    border: 'border-amber-200',
    icon: '🚩',
    summary: 'CS301 · Flagged by 3 students · 2h ago',
    primary: 'Remove',
    secondary: 'View Msg',
  },
  {
    title: 'Storage Warning',
    level: 'LOW',
    color: 'text-amber-600',
    border: 'border-amber-100',
    icon: '💾',
    summary: 'Archive at 78% (3.9 GB / 5 GB)',
    primary: 'Auto-Archive',
    secondary: 'View',
  },
] as const;

function SecurityAlertCard({
  title,
  level,
  color,
  border,
  icon,
  summary,
  primary,
  secondary,
}: (typeof securityAlerts)[number]) {
  return (
    <View className={`mb-3 rounded-[22px] border bg-white px-4 py-4 ${border}`}>
      <View className="flex-row items-start justify-between">
        <Text className={`text-base font-extrabold ${color}`}>
          {icon} {title}
        </Text>
        <View className="rounded-full bg-slate-100 px-3 py-1">
          <Text className={`text-xs font-extrabold ${color}`}>{level}</Text>
        </View>
      </View>

      <Text className="mt-2 text-sm leading-5 text-slate-500">{summary}</Text>

      <View className="mt-4 flex-row items-center">
        <Pressable className="flex-1 rounded-xl bg-[#FDECEC] py-3">
          <Text className="text-center text-base font-bold text-slate-900">{primary}</Text>
        </Pressable>
        <Pressable className="ml-2 flex-1 rounded-xl bg-[#EEF2FF] py-3">
          <Text className="text-center text-sm font-bold text-slate-500">{secondary}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function NotificationRow({
  item,
}: {
  item: (typeof notifications)[number];
}) {
  return (
    <View className="border-b border-slate-100 bg-white px-4 py-4">
      <View className="flex-row items-start">
        <View className={`mr-4 mt-2 h-3 w-3 rounded-full ${item.dot}`} />
        <View className="flex-1">
          <Text className={`text-xl font-extrabold ${item.accent}`}>
            {item.icon} {item.title}
          </Text>
          <Text className="mt-2 text-base leading-6 text-slate-500">{item.message}</Text>

          {item.actions.length > 0 ? (
            <View className="mt-4 flex-row items-center">
              {item.actions.map((action, index) => (
                <Pressable
                  key={action.label}
                  className={`rounded-full px-4 py-2 ${action.tone} ${index === 0 ? '' : 'ml-3'}`}
                >
                  <Text className="text-sm font-bold">{action.label}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <Text className="mt-3 text-sm font-medium text-slate-400">{item.meta}</Text>
        </View>
      </View>
    </View>
  );
}

export default function SystemNotificationsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ filter?: string }>();
  const initialFilter =
    params.filter && filters.includes(params.filter as (typeof filters)[number])
      ? (params.filter as (typeof filters)[number])
      : 'All';
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>(initialFilter);

  const unreadCount = notifications.length;
  const actionCount = notifications.filter((item) => item.section === 'Requires Action').length;

  const filteredNotifications = notifications.filter((item) =>
    activeFilter === 'All'
      ? true
      : activeFilter === 'Alerts'
        ? item.section === 'Requires Action'
        : item.category === activeFilter
  );

  const sections = ['Requires Action', 'Informational'] as const;

  return (
    <SafeAreaView className="flex-1 bg-[#203765]" edges={['top']}>
      <StatusBar style="light" backgroundColor="#203765" />
      <View className="flex-1 bg-[#F4F7FD]">
        <View
          className="bg-[#203765] px-5 pb-5"
          style={{ paddingTop: Math.max(insets.top, 4) }}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center">
              <BackButton fallbackRoute="/(admin)/dashboard" />

              <View>
                <Text className="-mt-3 text-2xl font-extrabold text-white">
                  System Notifications
                </Text>
                <Text className="mt-1 text-sm font-medium text-white/65">
                  {unreadCount} unread · {actionCount} require action
                </Text>
              </View>
            </View>

            <Pressable className="rounded-full bg-white/10 px-4 py-2">
              <Text className="text-sm font-bold text-white/80">Clear all</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white px-4 py-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filters.map((filter, index) => {
                const active = filter === activeFilter;
                return (
                  <Pressable
                    key={filter}
                    onPress={() => setActiveFilter(filter)}
                    className={`rounded-full border px-5 py-3 ${
                      active ? 'border-blue-600 bg-[#3D6EE8]' : 'border-slate-200 bg-[#EEF3FB]'
                    } ${index === 0 ? '' : 'ml-3'}`}
                  >
                    <Text
                      className={`text-sm font-bold ${
                        active ? 'text-white' : 'text-slate-600'
                      }`}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {activeFilter === 'Alerts' ? (
            <View className="px-4 pb-4 pt-4">
              <View className="rounded-[24px] bg-white px-4 py-4 shadow-sm shadow-slate-200">
                <View className="mb-4 flex-row items-start justify-between">
                  <View>
                    <Text className="text-2xl font-extrabold text-slate-900">Security Center</Text>
                    <Text className="mt-1 text-sm text-slate-400">Threats, flags & access</Text>
                  </View>
                  <View className="rounded-full bg-red-50 px-3 py-1.5">
                    <Text className="text-xs font-extrabold text-red-500">3 ALERTS</Text>
                  </View>
                </View>

                <View className="mb-4 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-4">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-base font-extrabold text-amber-700">
                        ⚠️ Threat Level: LOW
                      </Text>
                      <Text className="mt-1 text-sm text-amber-700/80">
                        3 unresolved · Score 18/100
                      </Text>
                    </View>
                    <Text className="text-2xl font-extrabold text-amber-500">LOW</Text>
                  </View>
                </View>

                <Text className="mb-3 text-base font-extrabold text-slate-900">Active Alerts</Text>
                {securityAlerts.map((alert) => (
                  <SecurityAlertCard key={alert.title} {...alert} />
                ))}
              </View>
            </View>
          ) : (
            sections.map((section) => {
              const sectionItems = filteredNotifications.filter((item) => item.section === section);

              if (sectionItems.length === 0) return null;

              return (
                <View key={section}>
                  <Text className="px-4 pb-3 pt-4 text-sm font-extrabold tracking-wide text-slate-400">
                    {section.toUpperCase()}
                  </Text>

                  <View className="bg-white">
                    {sectionItems.map((item) => (
                      <NotificationRow key={item.id} item={item} />
                    ))}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
