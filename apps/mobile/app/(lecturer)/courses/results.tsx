import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';

const RESULTS_DATA = {
  courseTitle: 'CS301 Results',
  courseStatus: 'Not Submitted Quiz: Closed',
  scoreStats: {
    submitted: { value: 24, total: 32, label: 'Submitted' },
    classAverage: { value: 74, label: 'Class Avg' },
    highest: { value: 87, label: 'Highest' },
    lowest: { value: 45, label: 'Lowest' },
  },
  scoreDistribution: [
    { range: '90-100%', count: 1, percentage: 3 },
    { range: '80-89%', count: 10, percentage: 43 },
    { range: '70-79%', count: 3, percentage: 13 },
    { range: '60-69%', count: 3, percentage: 13 },
    { range: 'Below 60%', count: 5, percentage: 24 },
  ],
  hardestQuestions: [
    { id: 'Q5', title: 'Heap Operations', percentage: 45, difficulty: 'Hard', color: '#EF4444' },
    { id: 'Q9', title: 'BFS vs DFS', percentage: 51, difficulty: 'Hard', color: '#F59E0B' },
    { id: 'Q12', title: 'Red-Black Trees', percentage: 53, difficulty: 'Hard', color: '#F59E0B' },
  ],
  leaderboard: [
    { id: 1, name: 'Stephen Appiah', initials: 'SA', score: 87, color: '#3B82F6' },
    { id: 2, name: 'Rudolf Gavor', initials: 'RG', score: 80, color: '#10B981' },
    { id: 3, name: 'Abena Asante', initials: 'AA', score: 73, color: '#F59E0B' },
    { id: 4, name: 'Efua Owusu', initials: 'EO', score: 67, color: '#8B5CF6' },
    { id: 5, name: 'Bright Koffi', initials: 'BK', score: 60, color: '#EF4444' },
  ],
};

function ScoreDistributionBar({ range, count, percentage }: (typeof RESULTS_DATA.scoreDistribution)[0]) {
  const getBarColor = (range: string) => {
    if (range === '90-100%') return '#10B981';
    if (range === '80-89%') return '#3B82F6';
    if (range === '70-79%') return '#F59E0B';
    if (range === '60-69%') return '#F97316';
    return '#EF4444';
  };

  return (
    <View className="flex-row items-center gap-3 mb-4">
      <Text className="w-14 text-xs font-medium text-slate-600">{range}</Text>
      <View className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: getBarColor(range) }}
        />
      </View>
      <Text className="w-6 text-xs font-semibold text-slate-700">{count}</Text>
    </View>
  );
}

function LeaderboardRow({ rank, name, initials, score, color }: (typeof RESULTS_DATA.leaderboard)[0] & { rank: number }) {
  return (
    <View className="flex-row items-center justify-between border-b border-slate-100 py-3">
      <View className="flex-row items-center gap-3 flex-1">
        <Text className="text-lg font-bold text-slate-400 w-6">{rank}</Text>
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Text className="text-xs font-bold text-white">{initials}</Text>
        </View>
        <Text className="text-sm font-semibold text-slate-900 flex-1">{name}</Text>
      </View>
      <Text className="text-sm font-bold text-slate-900">{score}%</Text>
    </View>
  );
}

export default function ResultsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="bg-[#051839] px-4 pb-5 pt-6">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-3">
          <Text className="text-2xl text-white">‹</Text>
          <View>
            <Text className="text-2xl font-extrabold text-white">{RESULTS_DATA.courseTitle}</Text>
            <Text className="text-sm text-slate-300">{RESULTS_DATA.courseStatus}</Text>
          </View>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 bg-[#F5F7FA]"
        contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Score Summary Cards */}
        <View className="grid gap-3" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {/* Submitted */}
          <View className="flex-1 min-w-[45%] rounded-2xl bg-white px-4 py-4 items-center shadow-black/5" style={{ elevation: 2 }}>
            <Text className="text-2xl font-extrabold text-slate-900">{RESULTS_DATA.scoreStats.submitted.value}/{RESULTS_DATA.scoreStats.submitted.total}</Text>
            <Text className="text-xs text-slate-500 mt-2">{RESULTS_DATA.scoreStats.submitted.label}</Text>
          </View>

          {/* Class Average */}
          <View className="flex-1 min-w-[45%] rounded-2xl bg-white px-4 py-4 items-center shadow-black/5" style={{ elevation: 2 }}>
            <Text className="text-2xl font-extrabold" style={{ color: '#10B981' }}>{RESULTS_DATA.scoreStats.classAverage.value}%</Text>
            <Text className="text-xs text-slate-500 mt-2">{RESULTS_DATA.scoreStats.classAverage.label}</Text>
          </View>

          {/* Highest */}
          <View className="flex-1 min-w-[45%] rounded-2xl bg-white px-4 py-4 items-center shadow-black/5" style={{ elevation: 2 }}>
            <Text className="text-2xl font-extrabold" style={{ color: '#F59E0B' }}>{RESULTS_DATA.scoreStats.highest.value}%</Text>
            <Text className="text-xs text-slate-500 mt-2">{RESULTS_DATA.scoreStats.highest.label}</Text>
          </View>

          {/* Lowest */}
          <View className="flex-1 min-w-[45%] rounded-2xl bg-white px-4 py-4 items-center shadow-black/5" style={{ elevation: 2 }}>
            <Text className="text-2xl font-extrabold" style={{ color: '#EF4444' }}>{RESULTS_DATA.scoreStats.lowest.value}%</Text>
            <Text className="text-xs text-slate-500 mt-2">{RESULTS_DATA.scoreStats.lowest.label}</Text>
          </View>
        </View>

        {/* Score Distribution */}
        <View className="rounded-2xl bg-white px-5 py-5 shadow-black/5" style={{ elevation: 2 }}>
          <Text className="text-base font-extrabold text-slate-900 mb-4">Score Distribution</Text>
          {RESULTS_DATA.scoreDistribution.map((item) => (
            <ScoreDistributionBar key={item.range} {...item} />
          ))}
        </View>

        {/* Hardest Questions */}
        <View className="rounded-2xl bg-white px-5 py-5 shadow-black/5" style={{ elevation: 2 }}>
          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-base font-extrabold text-slate-900">🎯</Text>
            <Text className="text-base font-extrabold text-slate-900">Hardest Questions — Needs Re-teaching</Text>
          </View>
          {RESULTS_DATA.hardestQuestions.map((question) => (
            <View key={question.id} className="flex-row items-center justify-between border-b border-slate-100 py-3">
              <View className="flex-1">
                <Text className="text-xs font-semibold text-slate-500">{question.id}</Text>
                <Text className="text-sm font-semibold text-slate-900 mt-1">{question.title}</Text>
              </View>
              <View className="items-end">
                <Text className="text-sm font-bold" style={{ color: question.color }}>
                  {question.percentage}%
                </Text>
                <Text className="text-xs text-slate-500 mt-1">{question.difficulty}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Leaderboard */}
        <View className="rounded-2xl bg-white px-5 py-5 shadow-black/5" style={{ elevation: 2 }}>
          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-base font-extrabold text-slate-900">🏆</Text>
            <Text className="text-base font-extrabold text-slate-900">Leaderboard</Text>
          </View>
          {RESULTS_DATA.leaderboard.map((student, index) => (
            <LeaderboardRow key={student.id} {...student} rank={index + 1} />
          ))}
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-4">
          <Pressable className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 items-center">
            <Text className="text-sm font-semibold text-slate-700">📧 Email Results</Text>
          </Pressable>
          <Pressable className="flex-1 rounded-full bg-blue-600 px-4 py-3 items-center">
            <Text className="text-sm font-semibold text-white">📊 Export CSV</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
