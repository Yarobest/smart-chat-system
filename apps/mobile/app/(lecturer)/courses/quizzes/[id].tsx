import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { PageLoader } from '@/src/components/common/PageLoader';
import { quizService } from '@/src/services/quiz.service';
import { Quiz } from '@/src/types/quiz.types';

type Action = { label: string; tone: string; textTone: string; onPress: () => void };

export default function LecturerQuizDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    if (id) quizService.detail(id).then(setQuiz).catch((error) => Alert.alert('Could not load quiz', error.message));
  }, [id]);
  useEffect(() => { load(); }, [load]);

  if (!quiz) return <SafeAreaView className="flex-1 bg-[#F5F7FA]"><PageLoader label="Loading quiz..." /></SafeAreaView>;

  const changeStatus = async (status: Quiz['status']) => {
    try {
      setBusy(true);
      setQuiz(await quizService.updateStatus(quiz.id, status));
    } catch (error) {
      Alert.alert('Could not update quiz', error instanceof Error ? error.message : 'Please try again.');
    } finally { setBusy(false); }
  };

  const remove = () => Alert.alert('Delete Quiz', 'This permanently deletes the quiz and cannot be undone.', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete', style: 'destructive', onPress: () => quizService.remove(quiz.id)
        .then(() => router.replace('/(lecturer)/tasks' as any))
        .catch((error) => Alert.alert('Could not delete', error.message)),
    },
  ]);

  const actions: Action[] = [];
  if (quiz.status !== 'archived') actions.push({ label: 'Edit Quiz', tone: 'border border-blue-600 bg-white', textTone: 'text-blue-700', onPress: () => router.push({ pathname: '/(lecturer)/courses/set-quiz', params: { quizId: quiz.id } } as any) });
  if (quiz.status !== 'draft') actions.push({ label: 'View Attempts', tone: 'bg-blue-600', textTone: 'text-white', onPress: () => router.push({ pathname: '/(lecturer)/courses/quiz-attempts', params: { quizId: quiz.id } } as any) });
  if (quiz.status === 'draft') {
    actions.push({ label: 'Publish Quiz', tone: 'bg-blue-600', textTone: 'text-white', onPress: () => void changeStatus('published') });
    actions.push({ label: 'Delete Quiz', tone: 'bg-red-50', textTone: 'text-red-700', onPress: remove });
  }
  if (quiz.status === 'published') {
    actions.push({ label: 'Close Quiz', tone: 'bg-amber-100', textTone: 'text-amber-800', onPress: () => void changeStatus('closed') });
    actions.push(quiz.attemptCount === 0
      ? { label: 'Delete Quiz', tone: 'bg-red-50', textTone: 'text-red-700', onPress: remove }
      : { label: 'Archive Quiz', tone: 'bg-slate-200', textTone: 'text-slate-700', onPress: () => void changeStatus('archived') });
  }
  if (quiz.status === 'closed') {
    actions.push({ label: 'Reopen Quiz', tone: 'bg-emerald-600', textTone: 'text-white', onPress: () => void changeStatus('published') });
    actions.push({ label: 'Archive Quiz', tone: 'bg-slate-200', textTone: 'text-slate-700', onPress: () => void changeStatus('archived') });
  }
  if (quiz.status === 'archived') actions.push({ label: 'Restore Quiz', tone: 'bg-blue-600', textTone: 'text-white', onPress: () => void changeStatus('closed') });

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title={quiz.title} fallbackRoute="/(lecturer)/tasks" />
      <ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}>
        <View className="rounded-2xl bg-white p-4">
          <View className="flex-row justify-between">
            <Text className="font-bold text-blue-600">{quiz.course.code} · {quiz.course.name}</Text>
            <Text className="rounded-md bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">{quiz.status}</Text>
          </View>
          <Text className="mt-4 text-sm leading-6 text-slate-700">{quiz.instructions}</Text>
          <View className="mt-4 rounded-xl bg-slate-50 p-3">
            <Text className="text-sm text-slate-600">Opens: {new Date(quiz.startAt).toLocaleString()}</Text>
            <Text className="mt-1 text-sm text-slate-600">Closes: {new Date(quiz.endAt).toLocaleString()}</Text>
            <Text className="mt-1 text-sm text-slate-600">{quiz.questionCount} questions · {quiz.totalMarks} marks · {quiz.durationMinutes} minutes</Text>
            <Text className="mt-1 text-sm text-slate-600">{quiz.attemptCount} attempts</Text>
          </View>
        </View>

        <View className="rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="mb-3 text-sm font-extrabold uppercase tracking-wider text-slate-500">Quiz Actions</Text>
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {actions.map((action) => (
              <Pressable
                key={action.label}
                disabled={busy}
                onPress={action.onPress}
                className={`w-[48.5%] items-center rounded-lg px-3 py-3 ${action.tone} ${busy ? 'opacity-50' : ''}`}
              >
                <Text numberOfLines={1} adjustsFontSizeToFit className={`text-sm font-bold ${action.textTone}`}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="rounded-2xl bg-white p-4">
          <Text className="font-extrabold text-slate-900">Questions</Text>
          {quiz.questions.map((question, index) => (
            <View key={question.id} className="mt-3 border-t border-slate-100 pt-3">
              <Text className="text-xs font-bold text-blue-600">QUESTION {index + 1} · {question.marks} MARKS</Text>
              <Text className="mt-1 text-sm font-semibold text-slate-800">{question.text}</Text>
              {question.type === 'short_answer' ? (
                <View className="mt-3 rounded-lg bg-amber-50 px-3 py-2"><Text className="text-xs font-bold text-amber-700">Manual grading required</Text></View>
              ) : (
                <View className="mt-3 gap-2">
                  {question.options.map((option) => {
                    const correct = String(question.correctAnswer) === option;
                    return <View key={option} className={`flex-row items-center rounded-lg border px-3 py-2 ${correct ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}><View className={`mr-2 h-5 w-5 items-center justify-center rounded-full border ${correct ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'}`}>{correct ? <Text className="text-xs font-bold text-white">✓</Text> : null}</View><Text className={`flex-1 text-sm font-semibold ${correct ? 'text-emerald-800' : 'text-slate-600'}`}>{option}</Text>{correct ? <Text className="text-xs font-extrabold text-emerald-700">CORRECT</Text> : null}</View>;
                  })}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
