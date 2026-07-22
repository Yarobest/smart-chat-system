import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from '@/src/components/common/StatusBar';
import { StudentBottomNav } from '@/src/components/common/StudentBottomNav';
import { PageHeader } from '@/src/components/common/PageHeader';
import { useLiveThreads } from '@/src/hooks/useLiveThreads';
import { assignmentService } from '@/src/services/assignment.service';
import { Assignment } from '@/src/types/assignment.types';
import { quizService } from '@/src/services/quiz.service';
import { Quiz } from '@/src/types/quiz.types';
import { materialService } from '@/src/services/material.service';
import { CourseMaterial } from '@/src/types/material.types';

export default function TaskScreen() {
  const { unreadCount } = useLiveThreads();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);

  useFocusEffect(useCallback(() => {
    let mounted = true;
    const load = () => Promise.all([assignmentService.list(), quizService.list(), materialService.list()])
      .then(([items, quizItems, materialItems]) => { if (mounted) { setAssignments(items); setQuizzes(quizItems); setMaterials(materialItems); } })
      .catch(() => undefined)
      .finally(() => { if (mounted) setLoading(false); });
    void load();
    const interval = setInterval(load, 10000);
    return () => { mounted = false; clearInterval(interval); };
  }, []));

  const pending = assignments.filter((item) => item.status === 'published' && !item.submission).length;
  const graded = assignments.filter((item) => item.recordedScore !== null && item.recordedScore !== undefined).length;
  const availableQuizzes = quizzes.filter((item) => item.status === 'published' && Date.now() >= new Date(item.startAt).getTime() && Date.now() <= new Date(item.endAt).getTime() && !item.attempt?.submittedAt).length;
  const categories = [
    {
      title: 'Assignments',
      description: 'View, submit and track graded coursework.',
      icon: '📋',
      tone: 'bg-blue-50 border-blue-100',
      badge: pending > 0 ? `${pending} pending` : `${assignments.length} available`,
      badgeTone: pending > 0 ? 'text-amber-700 bg-amber-100' : 'text-blue-700 bg-blue-100',
      detail: graded > 0 ? `${graded} graded` : 'Live from your lecturers',
      onPress: () => router.push('/(student)/tasks/assignments' as any),
      available: true,
    },
    { title: 'Notes & Slides', description: 'Course notes and lecturer slides.', icon: '📚', tone: 'bg-emerald-50 border-emerald-100', available: true, badge: materials.some(x=>x.isNew) ? `${materials.filter(x=>x.isNew).length} new` : `${materials.length} available`, badgeTone: 'text-emerald-700 bg-emerald-100', detail: 'Live from your lecturers', onPress: () => router.push('/(student)/tasks/notes' as any) },
    { title: 'Quizzes', description: 'Available and completed course quizzes.', icon: '🧪', tone: 'bg-amber-50 border-amber-100', available: true, badge: availableQuizzes > 0 ? `${availableQuizzes} available` : `${quizzes.length} published`, badgeTone: 'text-amber-700 bg-amber-100', detail: 'Timed and autosaved', onPress: () => router.push('/(student)/tasks/quizzes' as any) },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <PageHeader title="Coursework" subtitle="Your learning activities and course materials" />
      <ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{ padding: 16, paddingBottom: 28, gap: 12 }} showsVerticalScrollIndicator={false}>
        <View className="mb-1">
          <Text className="text-lg font-extrabold text-slate-900">What do you need?</Text>
          <Text className="mt-1 text-sm text-slate-500">Choose a category to continue.</Text>
        </View>

        {loading ? <ActivityIndicator color="#2563EB" /> : null}

        {categories.map((category) => (
          <Pressable
            key={category.title}
            disabled={!category.available}
            onPress={category.onPress}
            className={`rounded-2xl border p-4 ${category.tone} ${!category.available ? 'opacity-70' : ''}`}
          >
            <View className="flex-row items-start">
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-white">
                <Text className="text-2xl">{category.icon}</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-start justify-between gap-2">
                  <Text className="flex-1 text-base font-extrabold text-slate-900">{category.title}</Text>
                  {category.available ? (
                    <Text className={`rounded-full px-2.5 py-1 text-xs font-bold ${category.badgeTone}`}>{category.badge}</Text>
                  ) : (
                    <Text className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-500">Coming soon</Text>
                  )}
                </View>
                <Text className="mt-1 text-sm leading-5 text-slate-600">{category.description}</Text>
                <Text className="mt-3 text-xs font-bold text-slate-500">{category.available ? category.detail : 'No backend content published yet'}</Text>
              </View>
              {category.available ? <Text className="ml-2 self-center text-xl text-blue-500">›</Text> : null}
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <StudentBottomNav active="tasks" unreadCount={unreadCount} />
    </SafeAreaView>
  );
}
