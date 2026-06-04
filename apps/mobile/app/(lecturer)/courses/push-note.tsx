import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';

export default function PushNoteScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title="Push Note" onBackPress={() => router.back()} />

      <View className="flex-1 bg-[#F5F7FA] px-5 pt-6">
        <View className="rounded-[28px] bg-white px-5 py-6 shadow-lg shadow-black/5" style={{ elevation: 3 }}>
          <Text className="text-xl font-extrabold text-slate-900">Send a note to students</Text>
          <Text className="mt-3 text-sm text-slate-500 leading-6">
            Push a quick note to the course group. Use this for reminders, updates or resources.
          </Text>

          <View className="mt-6 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
            <Text className="text-sm font-semibold text-slate-800">Note</Text>
            <Text className="mt-2 text-base text-slate-700">Write your message and choose the course recipients.</Text>
          </View>

          <Pressable
            onPress={() => router.back()}
            className="mt-6 rounded-full bg-emerald-600 px-5 py-4 items-center"
          >
            <Text className="text-sm font-semibold text-white">Push Note</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
