import { Pressable, SafeAreaView, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';

const TIME_OPTIONS = ['45 min', '1 hr', '2 hrs', 'Custom'];
const SETTINGS = [
  { id: 'shuffleQuestions', label: 'Shuffle question order', icon: '🔀' },
  { id: 'shuffleAnswers', label: 'Shuffle answer choices', icon: '🅰️' },
  { id: 'oneAttempt', label: 'One attempt per student', icon: '1️⃣' },
  { id: 'showScore', label: 'Show score after submission', icon: '📊' },
  { id: 'leaderboard', label: 'Show class leaderboard', icon: '🏆' },
  { id: 'requireId', label: 'Require Student ID to access', icon: '🔒' },
];

export default function SetQuizScreen() {
  const [activeTab, setActiveTab] = useState<'Quiz' | 'Assignment' | 'Upload Note'>('Quiz');
  const [title, setTitle] = useState('CS301 Mid-Semester Quiz');
  const [instructions, setInstructions] = useState(
    'This quiz covers Weeks 1–7 material. Read each question carefully. You have 45 minutes from when you start. One attempt only.'
  );
  const [roomCode, setRoomCode] = useState('CS301');
  const [availability, setAvailability] = useState({ opens: 'Mon Jan 15 · 8:00 AM', closes: 'Mon Jan 15 · 5:00 PM' });
  const [selectedTimeLimit, setSelectedTimeLimit] = useState('45 min');
  const [settings, setSettings] = useState<Record<string, boolean>>({
    shuffleQuestions: true,
    shuffleAnswers: false,
    oneAttempt: true,
    showScore: true,
    leaderboard: true,
    requireId: true,
  });

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title="Create Assessment" onBackPress={() => router.back()} />
      <ScrollView
        className="flex-1 bg-[#F5F7FA] px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-[32px] bg-white px-5 py-5 shadow-black/5" style={{ elevation: 4 }}>
          <View className="mb-4">
            <Text className="text-sm font-semibold text-slate-500">CS301 · Data Structures</Text>
            <Text className="text-xl font-extrabold text-slate-900">Create Assessment</Text>
          </View>

          <View className="mb-4 flex-row gap-2">
            {(['Quiz', 'Assignment', 'Upload Note'] as const).map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`flex-1 rounded-2xl border px-3 py-2 items-center ${
                  activeTab === tab ? 'border-blue-600 bg-blue-100' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <Text className={`text-sm font-semibold ${activeTab === tab ? 'text-blue-700' : 'text-slate-600'}`}>
                  {tab === 'Quiz' ? '🧠 Quiz' : tab === 'Assignment' ? '📄 Assignment' : '📤 Upload Note'}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-slate-600">Assessment Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter assessment title"
              placeholderTextColor="#94A3B8"
              className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-slate-600">Instructions</Text>
            <TextInput
              value={instructions}
              onChangeText={setInstructions}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder="Write instructions shown to students before they start"
              placeholderTextColor="#94A3B8"
              className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
            />
          </View>

          <View className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <Text className="text-sm font-semibold text-slate-600">Room Code</Text>
            <View className="mt-3 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <Text className="text-lg font-bold tracking-[0.32rem] text-slate-900">{roomCode.split('').join(' ')}</Text>
              <Pressable
                onPress={() => setRoomCode(`${roomCode.split('').reverse().join('')}`)}
                className="rounded-2xl bg-slate-100 px-3 py-2"
              >
                <Text className="text-sm font-semibold text-slate-700">Change</Text>
              </Pressable>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-slate-600">Availability Window</Text>
            <View className="mt-3 flex-row gap-3">
              <View className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <Text className="text-xs uppercase tracking-[0.12rem] text-slate-400">Opens</Text>
                <Text className="mt-3 text-sm font-semibold text-slate-900">{availability.opens}</Text>
              </View>
              <View className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <Text className="text-xs uppercase tracking-[0.12rem] text-slate-400">Closes</Text>
                <Text className="mt-3 text-sm font-semibold text-slate-900">{availability.closes}</Text>
              </View>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-slate-600">Student Time Limit</Text>
            <View className="mt-3 flex-row flex-wrap gap-2">
              {TIME_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setSelectedTimeLimit(option)}
                  className={`min-w-[45%] rounded-2xl border px-3 py-3 text-center ${
                    selectedTimeLimit === option
                      ? 'border-blue-600 bg-blue-100'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <Text className={`text-sm font-semibold ${selectedTimeLimit === option ? 'text-blue-700' : 'text-slate-600'}`}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="mb-5 space-y-3">
            {SETTINGS.map((setting) => (
              <View
                key={setting.id}
                className="flex-row items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
                    <Text>{setting.icon}</Text>
                  </View>
                  <Text className="text-sm font-semibold text-slate-700">{setting.label}</Text>
                </View>
                <Switch
                  value={settings[setting.id]}
                  onValueChange={() => toggleSetting(setting.id)}
                  trackColor={{ false: '#D1D5DB', true: '#22C55E' }}
                  thumbColor={settings[setting.id] ? '#ffffff' : '#f8fafc'}
                />
              </View>
            ))}
          </View>

          <Pressable
            onPress={() => router.push('/(lecturer)/courses/add-questions')}
            className="rounded-full bg-blue-600 px-5 py-4 items-center"
          >
            <Text className="text-base font-semibold text-white">Next — Add Questions →</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
