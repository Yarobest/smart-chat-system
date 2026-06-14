import { ScrollView, Text, View, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SecurityCenter() {
  return (
    <SafeAreaView className="flex-1 bg-[#0F2341]">
      <ScrollView className="flex-1 bg-[#EEF3FB]" contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="bg-[#0F2341] px-5 pb-5 pt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-extrabold text-white">Security Center</Text>
              <Text className="mt-1 text-xs font-semibold text-blue-200">Threats, flags & access</Text>
            </View>

            <View className="rounded-full bg-rose-900/50 px-3 py-1">
              <Text className="text-xs font-extrabold text-rose-300">3 ALERTS</Text>
            </View>
          </View>
        </View>

        <View className="px-5 pt-4">
          <View className="rounded-[18px] border border-orange-300 bg-orange-50 p-4">
            <View className="flex-row items-center">
              <Text className="mr-3 text-2xl">⚠️</Text>
              <View className="flex-1">
                <Text className="text-sm font-extrabold text-orange-600">Threat Level: LOW</Text>
                <Text className="text-xs text-slate-500">3 unresolved · Score 18/100</Text>
              </View>
              <Text className="text-3xl font-extrabold text-orange-500">LOW</Text>
            </View>
          </View>

          <Text className="mt-5 mb-2 text-sm font-extrabold text-slate-900">Active Alerts</Text>

          <View className="rounded-[18px] border-l-4 border-rose-500 bg-white p-4">
            <View className="flex-row justify-between">
              <Text className="text-sm font-extrabold text-rose-500">🚨 Suspicious Login</Text>
              <Text className="text-xs font-extrabold text-rose-500">HIGH</Text>
            </View>
            <Text className="mt-2 text-xs text-slate-500">3 failed · Kofi Agyemang · IP 102.89.xx.xx</Text>
            <View className="mt-3 flex-row gap-3">
              <Pressable className="flex-1 rounded-lg bg-rose-50 py-2">
                <Text className="text-center font-bold text-rose-700">Block IP</Text>
              </Pressable>
              <Pressable className="flex-1 rounded-lg bg-slate-100 py-2">
                <Text className="text-center font-bold text-slate-600">Dismiss</Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-3 rounded-[18px] border-l-4 border-orange-400 bg-white p-4">
            <View className="flex-row justify-between">
              <Text className="text-sm font-extrabold text-orange-500">🚩 Message Flagged</Text>
              <Text className="text-xs font-extrabold text-orange-500">MEDIUM</Text>
            </View>
            <Text className="mt-2 text-xs text-slate-500">CS301 · Flagged by 3 students · 2h ago</Text>
            <View className="mt-3 flex-row gap-3">
              <Pressable className="flex-1 rounded-lg bg-orange-50 py-2">
                <Text className="text-center font-bold text-orange-700">Remove</Text>
              </Pressable>
              <Pressable className="flex-1 rounded-lg bg-slate-100 py-2">
                <Text className="text-center font-bold text-slate-600">View Msg</Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-3 rounded-[18px] border-l-4 border-orange-400 bg-white p-4">
            <View className="flex-row justify-between">
              <Text className="text-sm font-extrabold text-orange-500">🗂️ Storage Warning</Text>
              <Text className="text-xs font-extrabold text-orange-500">LOW</Text>
            </View>
            <Text className="mt-2 text-xs text-slate-500">Archive at 78% (3.9 GB / 5 GB)</Text>
            <View className="mt-3 flex-row gap-3">
              <Pressable className="flex-1 rounded-lg bg-orange-50 py-2">
                <Text className="text-center font-bold text-orange-700">Auto-Archive</Text>
              </Pressable>
              <Pressable className="flex-1 rounded-lg bg-slate-100 py-2">
                <Text className="text-center font-bold text-slate-600">View</Text>
              </Pressable>
            </View>
          </View>

          <Text className="mt-6 mb-2 text-xs font-extrabold tracking-wide text-slate-400">
            SECURITY SETTINGS
          </Text>

          <View className="gap-3">
            <View className="flex-row items-center justify-between rounded-[16px] bg-white p-4">
              <Text className="font-bold text-slate-800">⏱️ Session Timeout</Text>
              <Text className="text-xs text-slate-400">30 min</Text>
            </View>

            <View className="flex-row items-center justify-between rounded-[16px] bg-white p-4">
              <Text className="font-bold text-slate-800">🛡️ 2FA Enforcement</Text>
              <Switch value={false} />
            </View>

            <View className="flex-row items-center justify-between rounded-[16px] bg-white p-4">
              <Text className="font-bold text-slate-800">🚫 Profanity Filter</Text>
              <Switch value />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}