import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BroadcastScreen() {
  const [audience, setAudience] = useState('All Campus');
  const [priority, setPriority] = useState('Urgent');
  const [scheduleLater, setScheduleLater] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#0F2341]">
      <ScrollView className="flex-1 bg-[#EEF3FB]" contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="bg-[#0F2341] px-5 pb-5 pt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-extrabold text-white">‹ Campus Broadcast</Text>
              <Text className="mt-1 text-xs font-semibold text-blue-200">
                Reach the entire campus
              </Text>
            </View>

            <Pressable
                onPress={() => router.push('/(admin)/broadcast/broad-cast-history' as any)}
                className="rounded-full bg-white/10 px-3 py-2"
                >
                <Text className="text-xs font-extrabold text-orange-400">
                    📜 History
                </Text>
                </Pressable>
          </View>
        </View>

        <View className="px-5 pt-5">
          <View className="rounded-[16px] border border-rose-200 bg-rose-50 p-4">
            <View className="flex-row items-center">
              <Text className="mr-3 text-2xl">⚠️</Text>
              <View className="flex-1">
                <Text className="text-sm font-extrabold text-rose-500">
                  This reaches all 1,248 users.
                </Text>
                <Text className="mt-1 text-xs text-slate-500">
                  This action is logged and cannot be undone.
                </Text>
              </View>
            </View>
          </View>

          <Text className="mt-4 mb-2 text-xs font-extrabold text-slate-700">Title</Text>
          <TextInput
            value="Campus Network Maintenance – Jan 18"
            className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700"
          />

          <Text className="mt-4 mb-2 text-xs font-extrabold text-slate-700">Message</Text>
          <TextInput
            value={
              'The campus Wi-Fi will undergo maintenance on Saturday, January 18 from 10PM to 2AM. Campus Chat may be unavailable.'
            }
            multiline
            textAlignVertical="top"
            className="min-h-[115px] rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm leading-5 text-slate-700"
          />

          <Text className="mt-4 mb-2 text-xs font-extrabold text-slate-700">Target Audience</Text>
          <View className="flex-row flex-wrap">
            {['All Campus', 'Students Only', 'Lecturers Only'].map((item) => {
              const active = audience === item;

              return (
                <Pressable
                  key={item}
                  onPress={() => setAudience(item)}
                  className={`mb-2 mr-2 rounded-full border px-4 py-2 ${
                    active ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'
                  }`}
                >
                  <Text
                    className={`text-xs font-extrabold ${
                      active ? 'text-blue-600' : 'text-slate-600'
                    }`}
                  >
                    {active ? '✓ ' : ''}
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text className="mt-3 mb-2 text-xs font-extrabold text-slate-700">Priority</Text>
          <View className="flex-row justify-between">
            {[
              { label: 'Normal', dot: 'bg-blue-500' },
              { label: 'Important', dot: 'bg-yellow-400' },
              { label: 'Urgent', dot: 'bg-red-500' },
            ].map((item) => {
              const active = priority === item.label;

              return (
                <Pressable
                  key={item.label}
                  onPress={() => setPriority(item.label)}
                  className={`w-[31%] rounded-xl border px-3 py-4 ${
                    active ? 'border-red-500 bg-rose-50' : 'border-slate-300 bg-white'
                  }`}
                >
                  <View className="flex-row items-center justify-center">
                    <View className={`mr-2 h-3 w-3 rounded-full ${item.dot}`} />
                    <Text className="text-xs font-bold text-slate-700">{item.label}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-4 flex-row items-center justify-between rounded-xl bg-white px-4 py-3">
            <View>
              <Text className="text-sm font-extrabold text-slate-900">🗓️ Schedule for later</Text>
              <Text className="mt-1 text-xs text-slate-400">Send at a specific time</Text>
            </View>

            <Switch value={scheduleLater} onValueChange={setScheduleLater} />
          </View>

          <Pressable className="mt-4 rounded-2xl bg-blue-600 py-4 active:opacity-90">
            <Text className="text-center text-sm font-extrabold text-white">
              📣 Send Campus Broadcast
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}