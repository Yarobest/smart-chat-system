import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const departments = [
  { name: 'Computer Science', value: '145/312', rate: '46%', width: 'w-[46%]', color: 'bg-blue-500' },
  { name: 'Engineering Tech', value: '98/280', rate: '35%', width: 'w-[35%]', color: 'bg-emerald-500' },
  { name: 'Business Studies', value: '72/395', rate: '18%', width: 'w-[18%]', color: 'bg-orange-400' },
  { name: 'Hospitality', value: '21/180', rate: '12%', width: 'w-[12%]', color: 'bg-slate-400' },
];

const bars = [14, 26, 32, 45, 64, 74, 62, 55, 40, 35, 24, 16, 10, 6];

export default function UserPresence() {
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
              <Text className="text-xl font-extrabold text-white">User Presence</Text>
              <Text className="mt-1 text-xs font-semibold text-blue-200">
                Students & Lecturers · Live
              </Text>
            </View>

            <View className="rounded-full bg-emerald-100 px-3 py-1">
              <Text className="text-xs font-extrabold text-emerald-600">● LIVE</Text>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <View className="rounded-[18px] bg-[#0F2341] px-4 py-4">
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-extrabold text-white">1,248</Text>
                <Text className="text-xs text-white/50">Total</Text>
              </View>

              <View className="h-9 w-px bg-white/20" />

              <View className="items-center">
                <Text className="text-2xl font-extrabold text-emerald-400">342</Text>
                <Text className="text-xs text-white/50">Online</Text>
              </View>

              <View className="h-9 w-px bg-white/20" />

              <View className="items-center">
                <Text className="text-2xl font-extrabold text-slate-400">906</Text>
                <Text className="text-xs text-white/50">Offline</Text>
              </View>

              <View className="h-9 w-px bg-white/20" />

              <View className="items-center">
                <Text className="text-2xl font-extrabold text-orange-400">489</Text>
                <Text className="text-xs text-white/50">Peak</Text>
              </View>
            </View>
          </View>

          <View className="mt-3 flex-row justify-between">
            <View className="w-[48.5%] rounded-[18px] border border-blue-300 bg-white p-4">
              <Text className="text-xs font-bold text-slate-500">Students</Text>
              <Text className="mt-1 text-2xl font-extrabold text-slate-900">1,102</Text>
              <View className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <View className="h-full w-[27%] rounded-full bg-blue-500" />
              </View>
              <View className="mt-3 flex-row justify-between">
                <Text className="text-xs font-extrabold text-emerald-500">298{'\n'}Online</Text>
                <Text className="text-xs font-extrabold text-slate-400">804{'\n'}Offline</Text>
              </View>
            </View>

            <View className="w-[48.5%] rounded-[18px] border border-orange-300 bg-white p-4">
              <Text className="text-xs font-bold text-slate-500">Lecturers</Text>
              <Text className="mt-1 text-2xl font-extrabold text-slate-900">140</Text>
              <View className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <View className="h-full w-[27%] rounded-full bg-orange-400" />
              </View>
              <View className="mt-3 flex-row justify-between">
                <Text className="text-xs font-extrabold text-emerald-500">38{'\n'}Online</Text>
                <Text className="text-xs font-extrabold text-slate-400">102{'\n'}Offline</Text>
              </View>
            </View>
          </View>

          <View className="mt-3 rounded-[20px] bg-white p-4 shadow-sm shadow-slate-200">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-extrabold text-slate-900">Active users — today</Text>
              <Text className="text-xs font-semibold text-slate-400">Peak 489 @ 12pm</Text>
            </View>

            <View className="mt-5 flex-row items-end justify-between">
              {bars.map((height, index) => (
                <View
                  key={index}
                  style={{ height }}
                  className={`w-3 rounded-t-md ${
                    index >= 4 && index <= 8 ? 'bg-blue-500' : 'bg-blue-200'
                  }`}
                />
              ))}
            </View>

            <View className="mt-2 flex-row justify-between">
              <Text className="text-[10px] text-slate-400">6am</Text>
              <Text className="text-[10px] text-slate-400">9am</Text>
              <Text className="text-[10px] font-bold text-emerald-500">Now</Text>
              <Text className="text-[10px] text-slate-400">3pm</Text>
              <Text className="text-[10px] text-slate-400">9pm</Text>
            </View>
          </View>

          <View className="mt-3 rounded-[20px] bg-white p-4 shadow-sm shadow-slate-200">
            <Text className="text-sm font-extrabold text-slate-900">Online by department</Text>

            {departments.map((dept) => (
              <View key={dept.name} className="mt-4">
                <View className="flex-row justify-between">
                  <Text className="text-xs font-semibold text-slate-700">{dept.name}</Text>
                  <Text className="text-xs font-extrabold text-slate-500">
                    {dept.value} · {dept.rate}
                  </Text>
                </View>
                <View className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <View className={`h-full rounded-full ${dept.width} ${dept.color}`} />
                </View>
              </View>
            ))}
          </View>

          <View className="mt-3 rounded-[20px] bg-white p-4 shadow-sm shadow-slate-200">
            <Text className="text-sm font-extrabold text-slate-900">Role summary</Text>

            <View className="mt-4 flex-row justify-between">
              <Text className="w-[32%] text-xs font-bold text-slate-400">Role</Text>
              <Text className="w-[17%] text-xs font-bold text-slate-400">Total</Text>
              <Text className="w-[17%] text-xs font-bold text-emerald-500">On</Text>
              <Text className="w-[17%] text-xs font-bold text-slate-400">Off</Text>
              <Text className="w-[17%] text-xs font-bold text-slate-400">Rate</Text>
            </View>

            {[
              ['S', 'Students', '1,102', '298', '804', '27%'],
              ['L', 'Lecturers', '140', '38', '102', '27%'],
              ['#', 'All users', '1,248', '342', '906', '27%'],
            ].map((row) => (
              <View key={row[1]} className="mt-3 flex-row items-center justify-between">
                <Text className="w-[32%] text-xs font-extrabold text-slate-900">
                  {row[0]}  {row[1]}
                </Text>
                <Text className="w-[17%] text-xs font-semibold text-slate-600">{row[2]}</Text>
                <Text className="w-[17%] text-xs font-extrabold text-emerald-500">{row[3]}</Text>
                <Text className="w-[17%] text-xs font-semibold text-slate-400">{row[4]}</Text>
                <Text className="w-[17%] text-xs font-extrabold text-orange-500">{row[5]}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}