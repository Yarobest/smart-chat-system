import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const summaryCards = [
  { value: '298', label: 'Students', bg: 'bg-blue-50', border: 'border-blue-200' },
  { value: '38', label: 'Lecturers', bg: 'bg-amber-50', border: 'border-amber-200' },
  { value: '6', label: 'Admin', bg: 'bg-rose-50', border: 'border-rose-200' },
];

const activities = [
  {
    color: 'bg-emerald-500',
    title: 'New login · Stephen Appiah',
    desc: 'CS301 · Android · Accra, GH',
    time: 'Just now',
  },
  {
    color: 'bg-blue-500',
    title: 'Message sent · CS301 group',
    desc: 'Rudolf: “Can someone help with Q3?”',
    time: '32s ago',
  },
  {
    color: 'bg-rose-500',
    title: 'Failed login attempt × 3',
    desc: 'Kofi Agyemang · IP: 102.89.xx.xx',
    time: '1m ago',
    badge: 'ALERT',
  },
  {
    color: 'bg-amber-500',
    title: 'Announcement posted',
    desc: 'Mr. Agordzo → CS301 · Assign. 3 reminder',
    time: '4m ago',
  },
  {
    color: 'bg-emerald-500',
    title: 'New registration',
    desc: 'Ama Yeboah · 0323080421 · CS Dept',
    time: '8m ago',
  },
  {
    color: 'bg-purple-500',
    title: 'Message flagged',
    desc: 'CS301 · Flagged by 3 students',
    time: '2h ago',
    badge: 'REVIEW',
  },
  {
    color: 'bg-blue-500',
    title: 'Campus broadcast sent',
    desc: 'Admin → All 1,248 users · Exam timetable',
    time: '3h ago',
  },
];

export default function LiveActivityScreen() {
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
              <Text className="text-xl font-extrabold text-white">Live Activity</Text>
              <Text className="mt-1 text-xs font-semibold text-blue-200">
                Real-time system events
              </Text>
            </View>

            <View className="rounded-full bg-emerald-100 px-3 py-1">
              <Text className="text-xs font-extrabold text-emerald-600">● LIVE</Text>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <View className="flex-row justify-between">
            {summaryCards.map((item) => (
              <View
                key={item.label}
                className={`w-[31%] rounded-xl border px-3 py-4 ${item.bg} ${item.border}`}
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

          <Text className="mt-5 text-xs font-extrabold tracking-wide text-slate-400">
            LIVE FEED · AUTO-REFRESHING
          </Text>

          <View className="mt-2 overflow-hidden rounded-[20px] bg-white shadow-sm shadow-slate-200">
            {activities.map((item, index) => (
              <View
                key={index}
                className={`flex-row px-4 py-4 ${
                  index !== activities.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <View className={`mr-3 mt-1 h-3 w-3 rounded-full ${item.color}`} />

                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 text-sm font-extrabold text-slate-900">
                      {item.title}
                    </Text>

                    {item.badge && (
                      <View className="ml-2 rounded-md bg-rose-50 px-2 py-1">
                        <Text
                          className={`text-[10px] font-extrabold ${
                            item.badge === 'REVIEW' ? 'text-purple-500' : 'text-rose-500'
                          }`}
                        >
                          {item.badge}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text className="mt-1 text-xs leading-4 text-slate-500">{item.desc}</Text>
                  <Text className="mt-1 text-[11px] font-semibold text-slate-400">
                    {item.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}