import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from '@/src/components/common/StatusBar';
import { LecturerBottomNav } from '@/src/components/common/LecturerBottomNav';
import { PageHeader } from '@/src/components/common/PageHeader';
import { useLiveThreads } from '@/src/hooks/useLiveThreads';
import { assignmentService } from '@/src/services/assignment.service';
import { quizService } from '@/src/services/quiz.service';
import { Assignment } from '@/src/types/assignment.types';
import { Quiz } from '@/src/types/quiz.types';

export default function LecturerTasksScreen() {
  const { unreadCount } = useLiveThreads();
  const [assignments,setAssignments]=useState<Assignment[]>([]); const [quizzes,setQuizzes]=useState<Quiz[]>([]); const [loading,setLoading]=useState(true);
  useFocusEffect(useCallback(()=>{let live=true;Promise.all([assignmentService.list(),quizService.list()]).then(([a,q])=>{if(live){setAssignments(a);setQuizzes(q)}}).finally(()=>live&&setLoading(false));return()=>{live=false}},[]));
  const assignmentDrafts=assignments.filter(x=>x.status==='draft').length; const submissions=assignments.reduce((s,x)=>s+x.submissionCount,0); const quizDrafts=quizzes.filter(x=>x.status==='draft').length; const attempts=quizzes.reduce((s,x)=>s+x.attemptCount,0);
  const cards=[
    {title:'Assignments',icon:'📋',description:'Create, publish and review student work.',summary:`${assignments.length} total · ${assignmentDrafts} draft${assignmentDrafts===1?'':'s'}`,detail:`${submissions} submission${submissions===1?'':'s'}`,tone:'bg-blue-50 border-blue-100',route:'/(lecturer)/courses/assignments',create:'/(lecturer)/courses/create-assignment',available:true},
    {title:'Quizzes',icon:'🧪',description:'Build timed quizzes and review attempts.',summary:`${quizzes.length} total · ${quizDrafts} draft${quizDrafts===1?'':'s'}`,detail:`${attempts} attempt${attempts===1?'':'s'}`,tone:'bg-amber-50 border-amber-100',route:'/(lecturer)/courses/quizzes',create:'/(lecturer)/courses/set-quiz',available:true},
    {title:'Notes & Slides',icon:'📚',description:'Publish course learning materials.',summary:'Backend publishing flow next',detail:'No mock content',tone:'bg-emerald-50 border-emerald-100',available:false},
    {title:'Announcements',icon:'📣',description:'Send official course updates.',summary:'Backend publishing flow next',detail:'No mock content',tone:'bg-purple-50 border-purple-100',available:false},
  ];
  return <SafeAreaView className="flex-1 bg-[#051839]"><StatusBar style="light" backgroundColor="#051839"/><View className="flex-1 bg-white"><PageHeader title="Course Tools" subtitle="Create and manage content across your courses"/><ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{padding:16,paddingBottom:28,gap:12}}>
    <View><Text className="text-lg font-extrabold text-slate-900">Manage coursework</Text><Text className="mt-1 text-sm text-slate-500">Choose a category, then filter its content by course.</Text></View>{loading?<ActivityIndicator color="#2563EB"/>:null}
    {cards.map(card=><Pressable key={card.title} disabled={!card.available} onPress={()=>card.available&&router.push(card.route as any)} className={`rounded-2xl border p-4 ${card.tone} ${!card.available?'opacity-70':''}`}><View className="flex-row"><View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-white"><Text className="text-2xl">{card.icon}</Text></View><View className="flex-1"><View className="flex-row justify-between"><Text className="font-extrabold text-slate-900">{card.title}</Text><Text className="rounded-full bg-white px-2 py-1 text-xs font-bold text-slate-500">{card.available?'MANAGE':'COMING SOON'}</Text></View><Text className="mt-1 text-sm text-slate-600">{card.description}</Text><Text className="mt-3 text-xs font-bold text-slate-700">{card.summary}</Text><Text className="mt-1 text-xs text-slate-500">{card.detail}</Text></View>{card.available?<Text className="ml-2 self-center text-xl text-blue-500">›</Text>:null}</View>{card.available?<Pressable onPress={(e)=>{e.stopPropagation();router.push(card.create as any)}} className="mt-4 items-center rounded-full bg-white py-2.5"><Text className="font-bold text-blue-700">+ Create {card.title==='Assignments'?'Assignment':'Quiz'}</Text></Pressable>:null}</Pressable>)}
  </ScrollView><LecturerBottomNav active="tasks" unreadCount={unreadCount}/></View></SafeAreaView>;
}
