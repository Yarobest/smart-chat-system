import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const stats = [
  { value: '1,248', label: 'Total Users', trend: '+48 this month' },
  { value: '94%', label: 'Retention Rate', trend: '+2% vs last' },
  { value: '48', label: 'New This Month', trend: '+ from 31' },
  { value: '3', label: 'Suspended', trend: 'Same as last' },
];

const bars = [28, 32, 24, 40, 52, 42, 66];

const registrations = [
  {
    initials: 'AY',
    name: 'Ama Yeboah',
    meta: '0323080421 · Student · CS · 2h ago',
    status: 'Pending',
    color: 'bg-blue-600',
    badge: 'bg-amber-100 text-amber-600',
  },
  {
    initials: 'BK',
    name: 'Bright Koffi',
    meta: '0323080435 · Student · ET · 5h ago',
    status: 'Active',
    color: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-600',
  },
  {
    initials: 'JA',
    name: 'Dr. James Antwi',
    meta: 'STAFF-022 · Lecturer · ET · 2 days',
    status: 'Active',
    color: 'bg-orange-500',
    badge: 'bg-emerald-100 text-emerald-600',
  },
];

export default function UserGrowthReport() {
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
              <Text className="text-xl font-extrabold text-white">‹ User Growth</Text>
              <Text className="mt-1 text-xs font-semibold text-blue-200">
                Registrations & retention
              </Text>
            </View>

            <View className="h-8 w-8 items-center justify-center rounded-md bg-blue-600">
              <Text className="text-sm font-extrabold text-white">↓</Text>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <View className="flex-row flex-wrap justify-between">
            {stats.map((item) => (
              <View
                key={item.label}
                className="mb-3 w-[48.5%] rounded-[18px] bg-white p-4 shadow-sm shadow-slate-200"
              >
                <Text className="text-3xl font-extrabold text-slate-900">{item.value}</Text>
                <Text className="mt-1 text-xs font-semibold text-slate-500">{item.label}</Text>
                <Text className="mt-2 text-xs font-extrabold text-emerald-500">{item.trend}</Text>
              </View>
            ))}
          </View>

          <View className="mt-1 rounded-[20px] bg-white p-4 shadow-sm shadow-slate-200">
            <Text className="text-sm font-extrabold text-slate-900">
              Monthly Registrations
            </Text>

            <View className="mt-5 flex-row items-end justify-between">
              {bars.map((height, index) => (
                <View
                  key={index}
                  style={{ height }}
                  className={`w-9 rounded-t-sm ${
                    index === bars.length - 1 ? 'bg-blue-600' : 'bg-blue-200'
                  }`}
                />
              ))}
            </View>

            <View className="mt-2 flex-row justify-between">
              <Text className="text-[10px] text-slate-400">Jul</Text>
              <Text className="text-[10px] text-slate-400">Sep</Text>
              <Text className="text-[10px] text-slate-400">Nov</Text>
              <Text className="text-[10px] font-bold text-blue-600">Jan</Text>
            </View>
          </View>

          <View className="mt-5 flex-row items-center justify-between">
            <Text className="text-sm font-extrabold text-slate-900">Recent Registrations</Text>
            <Text className="text-xs font-extrabold text-blue-600">View All</Text>
          </View>

          <View className="mt-2 overflow-hidden rounded-[20px] bg-white shadow-sm shadow-slate-200">
            {registrations.map((item, index) => (
              <View
                key={item.name}
                className={`flex-row items-center px-4 py-4 ${
                  index !== registrations.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <View
                  className={`mr-3 h-12 w-12 items-center justify-center rounded-full ${item.color}`}
                >
                  <Text className="text-sm font-extrabold text-white">{item.initials}</Text>
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-extrabold text-slate-900">{item.name}</Text>
                  <Text className="mt-1 text-xs text-slate-400">{item.meta}</Text>
                </View>

                <View
                  className={`rounded-full px-3 py-1 ${
                    item.status === 'Pending' ? 'bg-amber-100' : 'bg-emerald-100'
                  }`}
                >
                  <Text
                    className={`text-[10px] font-extrabold ${
                      item.status === 'Pending' ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    {item.status}
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