import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { quizService } from '@/src/services/quiz.service';
import { Quiz } from '@/src/types/quiz.types';

export default function QuizListScreen() {
  const [items,setItems]=useState<Quiz[]>([]); const [loading,setLoading]=useState(true);
  useFocusEffect(useCallback(()=>{let live=true; quizService.list().then(x=>live&&setItems(x)).finally(()=>live&&setLoading(false)); return()=>{live=false};},[]));
  const visible=[...items].sort((a,b)=>a.course.code.localeCompare(b.course.code)||new Date(a.startAt).getTime()-new Date(b.startAt).getTime());
  const now=Date.now(); const available=items.filter(q=>q.attempt?.status==='in_progress'||(!q.attempt?.submittedAt&&now>=new Date(q.startAt).getTime()&&now<=new Date(q.endAt).getTime())).length; const submitted=items.filter(q=>Boolean(q.attempt?.submittedAt)&&!q.attempt?.resultsReleased).length; const graded=items.filter(q=>Boolean(q.attempt?.resultsReleased)).length;
  return <SafeAreaView className="flex-1 bg-[#051839]"><StatusBar style="light" backgroundColor="#051839"/><ScreenHeader title="Quizzes" fallbackRoute="/(student)/tasks"/>
    <ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{padding:16,gap:12}}><View className="rounded-2xl bg-[#0B2A59] p-4"><Text className="text-xs font-bold uppercase tracking-wider text-blue-200">Quiz overview</Text><View className="mt-3 flex-row items-end justify-between"><View className="flex-1"><Text className="text-3xl font-extrabold text-white">{available}</Text><Text className="text-sm text-blue-100">Available</Text></View><View className="flex-1 items-center"><Text className="text-2xl font-extrabold text-white">{submitted}</Text><Text className="text-sm text-blue-100">Submitted</Text></View><View className="flex-1 items-end"><Text className="text-2xl font-extrabold text-white">{graded}</Text><Text className="text-sm text-blue-100">Graded</Text></View></View></View>{loading?<ActivityIndicator color="#2563EB"/>:null}
      {!loading&&items.length===0?<View className="items-center py-20"><Text className="text-4xl">🧪</Text><Text className="mt-3 font-bold text-slate-600">No quizzes published</Text></View>:null}
      {visible.map((q,index)=>{const state=q.attempt?.status==='in_progress'?'IN PROGRESS':q.attempt?.resultsReleased?'GRADED':q.attempt?.submittedAt?'SUBMITTED':now<new Date(q.startAt).getTime()?'UPCOMING':now>new Date(q.endAt).getTime()?'CLOSED':'AVAILABLE'; return <View key={q.id}>{(index===0||visible[index-1].course.code!==q.course.code)?<Text className="mb-2 mt-2 text-sm font-extrabold text-slate-800">{q.course.code} · {q.course.name}</Text>:null}<Pressable onPress={()=>router.push({pathname:'/(student)/tasks/quiz-detail',params:{quizId:q.id}} as any)} className="rounded-2xl border border-slate-200 bg-white p-4">
        <View className="flex-row justify-between gap-3"><View className="flex-1"><Text className="font-extrabold text-slate-900">{q.title}</Text><Text className="mt-1 text-xs font-bold text-blue-600">{q.course.code} · {q.course.name}</Text></View><Text className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">{state}</Text></View>
        <Text className="mt-3 text-sm text-slate-500">{q.questionCount} questions · {q.durationMinutes} min · {q.attempt?.score??'-'}/{q.totalMarks}</Text>
        <Text className="mt-1 text-xs text-slate-400">Closes {new Date(q.endAt).toLocaleString()}</Text>
      </Pressable></View>})}
    </ScrollView></SafeAreaView>;
}
