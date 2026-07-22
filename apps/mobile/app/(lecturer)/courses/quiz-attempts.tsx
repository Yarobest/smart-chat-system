import { useCallback,useEffect,useState } from 'react';
import { Alert,Pressable,ScrollView,Text,View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router,useLocalSearchParams } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { quizService } from '@/src/services/quiz.service';

export default function QuizAttemptsScreen(){
  const{quizId}=useLocalSearchParams<{quizId:string}>(); const[data,setData]=useState<any>(null);
  const load=useCallback(()=>{if(quizId)quizService.attempts(quizId).then(setData).catch(e=>Alert.alert('Could not load attempts',e.message));},[quizId]); useEffect(()=>load(),[load]);
  if(!data)return <SafeAreaView className="flex-1 bg-[#F5F7FA]"/>;
  const totalMarks=data.questions.reduce((sum:number,q:any)=>sum+q.marks,0);
  const release=()=>quizService.release(data.id).then(()=>{Alert.alert('Results released','Students can now see their scores.');load()}).catch(e=>Alert.alert('Cannot release results',e.message));
  return <SafeAreaView className="flex-1 bg-[#051839]"><StatusBar style="light" backgroundColor="#051839"/><ScreenHeader title="Quiz Attempts" fallbackRoute={`/(lecturer)/courses/quizzes/${quizId}`}/><ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{padding:16,gap:12,paddingBottom:30}}>
    <View className="rounded-2xl bg-[#0B2A59] p-4"><Text className="text-lg font-extrabold text-white">{data.title}</Text><Text className="mt-1 text-blue-100">{data.attempts.length} attempt{data.attempts.length===1?'':'s'} · {totalMarks} marks</Text><Pressable onPress={()=>void release()} className="mt-4 items-center rounded-full bg-white py-3"><Text className="font-bold text-blue-700">Release All Graded Results</Text></Pressable></View>
    {data.attempts.map((attempt:any)=>{const started=new Date(attempt.startedAt);const ended=attempt.submittedAt?new Date(attempt.submittedAt):new Date();const minutes=Math.max(1,Math.ceil((ended.getTime()-started.getTime())/60000));return <Pressable key={attempt.id} onPress={()=>router.push({pathname:'/(lecturer)/courses/quiz-attempt-detail',params:{quizId:data.id,attemptId:attempt.id}} as any)} className="rounded-2xl border border-slate-200 bg-white p-4"><View className="flex-row items-start justify-between gap-3"><View className="flex-1"><Text className="font-extrabold text-slate-900">{attempt.student.name}</Text><Text className="mt-1 text-xs text-slate-400">{attempt.student.studentId??'Student'} · Attempt {attempt.attemptNumber}</Text></View><Text className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${attempt.status==='GRADED'?'bg-emerald-100 text-emerald-700':'bg-blue-100 text-blue-700'}`}>{attempt.status}</Text></View><View className="mt-3 flex-row justify-between border-t border-slate-100 pt-3"><View><Text className="text-lg font-extrabold text-slate-800">{attempt.totalScore??'-'}/{totalMarks}</Text><Text className="text-xs text-slate-400">Score</Text></View><View className="items-center"><Text className="font-bold text-slate-700">{minutes} min</Text><Text className="text-xs text-slate-400">Time used</Text></View><View className="items-end"><Text className="font-bold text-blue-700">View Attempt ›</Text><Text className="text-xs text-slate-400">{attempt.answers.length}/{data.questions.length} answered</Text></View></View></Pressable>})}
    {data.attempts.length===0?<View className="items-center py-20"><Text className="text-4xl">🧪</Text><Text className="mt-3 font-bold text-slate-500">No attempts yet</Text></View>:null}
  </ScrollView></SafeAreaView>;
}
