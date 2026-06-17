import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const services = [
  { name: 'API Server', ms: '42ms', status: 'UP', color: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-600' },
  { name: 'Socket.io', ms: '18ms', status: 'UP', color: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-600' },
  { name: 'PostgreSQL', ms: '8ms', status: 'UP', color: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-600' },
  { name: 'Push Notif', ms: '210ms', status: 'SLOW', color: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-600' },
  { name: 'Auth Service', ms: '31ms', status: 'UP', color: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-600' },
];

const resources = [
  { label: 'CPU Usage', value: '34%', width: 'w-[34%]', color: 'bg-emerald-500' },
  { label: 'RAM Usage', value: '61%', width: 'w-[61%]', color: 'bg-orange-400' },
  { label: 'Storage', value: '78%', width: 'w-[78%]', color: 'bg-orange-500' },
  { label: 'Connections (342/2000)', value: '17%', width: 'w-[17%]', color: 'bg-blue-500' },
];

export default function SystemHealth() {
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
              <Text className="text-xl font-extrabold text-white">System Health</Text>
              <Text className="mt-1 text-xs font-semibold text-blue-200">
                Infrastructure status
              </Text>
            </View>

            <View className="rounded-full bg-emerald-100 px-3 py-1">
              <Text className="text-xs font-extrabold text-emerald-600">● LIVE</Text>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <View className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-4">
            <View className="flex-row items-center">
              <Text className="mr-3 text-2xl">✅</Text>

              <View className="flex-1">
                <Text className="text-sm font-extrabold text-slate-900">
                  All Systems Operational
                </Text>
                <Text className="mt-1 text-xs text-slate-500">
                  Last incident 14 days ago · 98.2% uptime
                </Text>
              </View>

              <Text className="text-2xl font-extrabold text-emerald-500">98.2%</Text>
            </View>
          </View>

          <View className="mt-5 flex-row items-center justify-between">
            <Text className="text-sm font-extrabold text-slate-900">Services</Text>
            <Text className="text-xs font-semibold text-slate-400">Live</Text>
          </View>

          <View className="mt-2 rounded-[22px] bg-white px-4 py-4 shadow-sm shadow-slate-200">
            {services.map((service) => (
              <View key={service.name} className="mb-4 flex-row items-center last:mb-0">
                <View className={`mr-2 h-3 w-3 rounded-full ${service.color}`} />
                <Text className="flex-1 text-sm font-semibold text-slate-700">{service.name}</Text>
                <Text
                  className={`mr-3 text-xs font-extrabold ${
                    service.status === 'SLOW' ? 'text-orange-500' : 'text-emerald-500'
                  }`}
                >
                  {service.ms}
                </Text>
                <View className={`rounded-full px-2 py-1 ${service.badge.split(' ')[0]}`}>
                  <Text
                    className={`text-[10px] font-extrabold ${
                      service.status === 'SLOW' ? 'text-yellow-600' : 'text-emerald-600'
                    }`}
                  >
                    {service.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <Text className="mt-6 text-sm font-extrabold text-slate-900">Resource Usage</Text>

          <View className="mt-2 rounded-[22px] bg-white px-4 py-4 shadow-sm shadow-slate-200">
            {resources.map((item) => (
              <View key={item.label} className="mb-4 last:mb-0">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="text-xs font-semibold text-slate-500">{item.label}</Text>
                  <Text
                    className={`text-xs font-extrabold ${
                      item.value === '34%' ? 'text-emerald-500' : item.value === '17%' ? 'text-blue-500' : 'text-orange-500'
                    }`}
                  >
                    {item.value}
                  </Text>
                </View>

                <View className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <View className={`h-full rounded-full ${item.width} ${item.color}`} />
                </View>
              </View>
            ))}
          </View>

          <View className="mt-5 rounded-[22px] bg-white px-4 py-4 shadow-sm shadow-slate-200">
            <Text className="text-sm font-extrabold text-slate-900">30-day uptime</Text>

            <View className="mt-4 flex-row justify-between">
              {Array.from({ length: 30 }).map((_, index) => (
                <View
                  key={index}
                  className={`h-8 w-1.5 rounded-full ${
                    index === 5 || index === 22 ? 'bg-yellow-400' : 'bg-emerald-400'
                  }`}
                />
              ))}
            </View>

            <View className="mt-2 flex-row items-center justify-between">
              <Text className="text-[11px] font-semibold text-slate-400">Jan 1</Text>
              <Text className="text-[11px] font-semibold text-slate-400">Today</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}