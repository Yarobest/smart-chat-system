import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const chatItems = [
  {
    id: '1',
    avatar: '📚',
    title: 'CS301 · Data Structures',
    preview: 'Mr. Agordzo: Assignment due Fri...',
    time: '10:22',
    unread: 4,
    tone: 'bg-sky-100',
  },
  {
    id: '2',
    avatar: '👨‍🏫',
    title: 'Dr. Mensah',
    preview: 'Your project report looks good!',
    time: '9:05',
    unread: 1,
    tone: 'bg-emerald-100',
  },
  {
    id: '3',
    avatar: '📖',
    title: 'CS205 · Networking',
    preview: 'Rudolf: Can someone share...',
    time: 'Yesterday',
    unread: 0,
    tone: 'bg-amber-100',
  },
];

export default function HomePageScreen() {
  const [showRecentChats, setShowRecentChats] = useState(true);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const unreadCount = chatItems.reduce((total, item) => total + item.unread, 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60_000);

    return () => clearInterval(timer);
  }, []);

  const greetingText =
    currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]">
      <StatusBar style="light" hidden={false} />
      <View className="flex-1 bg-white">
        <View className="bg-[#0A1628] px-6 pb-6 pt-6">
          <View className="flex-row items-start justify-between">
            <View>
              <Text allowFontScaling className="text-xl font-semibold text-white/85">{greetingText} 👋</Text>
              <Text allowFontScaling className="text-4xl font-extrabold text-white">Stephen Appiah</Text>
            </View>
            <View className="mt-1 flex-row items-center gap-3 self-start">
              <Text allowFontScaling className="text-2xl">🔔</Text>
              <View className="h-16 w-16 items-center justify-center rounded-full bg-orange-400">
                <Text allowFontScaling className="text-2xl font-bold text-white">SA</Text>
              </View>
            </View>
          </View>

          <View className="mt-6 flex-row gap-3">
            <View className="flex-1 rounded-3xl border border-white/15 bg-white/10 p-4">
              <Text allowFontScaling className="text-4xl font-extrabold text-orange-300">5</Text>
              <Text allowFontScaling className="mt-1 text-base font-medium text-white/80">Courses</Text>
            </View>
            <View className="flex-1 rounded-3xl border border-white/15 bg-white/10 p-4">
              <Text allowFontScaling className="text-4xl font-extrabold text-orange-300">{unreadCount}</Text>
              <Text allowFontScaling className="mt-1 text-base font-medium text-white/80">Unread</Text>
            </View>
            <View className="flex-1 rounded-3xl border border-white/15 bg-white/10 p-4">
              <Text allowFontScaling className="text-4xl font-extrabold text-orange-300">3</Text>
              <Text allowFontScaling className="mt-1 text-base font-medium text-white/80">Alerts</Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1 bg-white px-6 pt-6"
          contentContainerStyle={{ paddingBottom: 18 }}>
          <View className="rounded-3xl border-l-[6px] border-amber-500 bg-amber-100 px-4 py-4">
            <View className="flex-row items-start gap-3">
              <Text allowFontScaling className="pt-1 text-2xl">🔈</Text>
              <View className="flex-1">
                <Text allowFontScaling className="text-[22px] font-bold text-amber-900">Exam Timetable Released!</Text>
                <Text allowFontScaling className="mt-1 text-lg text-amber-900/85">
                  End of semester exams begin Jan 20. Check notice board.
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-2 mt-7 flex-row items-center justify-between">
            <Text allowFontScaling className="text-xl font-extrabold text-slate-900">Recent Chats</Text>
            <Pressable onPress={() => setShowRecentChats((prev) => !prev)}>
              <Text allowFontScaling className="text-xl font-bold text-blue-600">
                {showRecentChats ? 'Hide' : 'See All'}
              </Text>
            </Pressable>
          </View>

          {showRecentChats ? (
            <View className="mt-1">
              {chatItems.map((item) => (
                <View
                  key={item.id}
                  className="flex-row items-center border-b border-slate-200 px-1 py-5">
                  <View className={`h-14 w-14 items-center justify-center rounded-full ${item.tone}`}>
                    <Text allowFontScaling className="text-2xl">{item.avatar}</Text>
                  </View>
                  <View className="ml-3 flex-1">
                    <Text allowFontScaling className="text-xl font-bold text-slate-900">{item.title}</Text>
                    <Text allowFontScaling className="text-[15px] text-slate-400" numberOfLines={1}>
                      {item.preview}
                    </Text>
                  </View>
                  <View className="items-end self-start pt-0.5">
                    <Text allowFontScaling className="text-base text-slate-400">{item.time}</Text>
                    {item.unread > 0 ? (
                      <View className="mt-1 min-w-6 rounded-full bg-blue-600 px-2 py-0.5">
                        <Text allowFontScaling className="text-center text-xs font-bold text-white">
                          {item.unread}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </ScrollView>

        <View className="flex-row items-center justify-around border-t border-slate-300 bg-white py-3">
          <View className="items-center">
            <Text allowFontScaling className="text-2xl">🏠</Text>
            <Text allowFontScaling className="text-xs font-bold text-blue-600">Home</Text>
          </View>
          <View className="items-center">
            <View className="absolute -right-3 -top-1 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5">
              <Text allowFontScaling className="text-center text-[10px] font-bold text-white">{unreadCount}</Text>
            </View>
            <Text allowFontScaling className="text-2xl">💬</Text>
            <Text allowFontScaling className="text-xs font-semibold text-slate-400">Chats</Text>
          </View>
          <View className="items-center">
            <Text allowFontScaling className="text-2xl">📢</Text>
            <Text allowFontScaling className="text-xs font-semibold text-slate-400">Notices</Text>
          </View>
          <View className="items-center">
            <Text allowFontScaling className="text-2xl">👤</Text>
            <Text allowFontScaling className="text-xs font-semibold text-slate-400">Profile</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
