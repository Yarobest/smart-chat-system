import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { FilterRow } from '@/src/components/common/FilterRow';
import { materialService } from '@/src/services/material.service';
import { CourseMaterial } from '@/src/types/material.types';

export default function NotesScreen() {
  const [items, setItems] = useState<CourseMaterial[]>([]); const [loading, setLoading] = useState(true); const [status, setStatus] = useState('All');
  useFocusEffect(useCallback(() => { let active = true; materialService.list().then((data) => active && setItems(data)).finally(() => active && setLoading(false)); return () => { active = false; }; }, []));
  const filtered = items.filter((item) => status === 'All' || (status === 'New' && item.isNew) || (status === 'Opened' && !item.isNew) || (status === 'Pinned' && item.pinned));
  const groups = Object.values(filtered.reduce((map: Record<string, { code: string; name: string; items: CourseMaterial[] }>, item) => { map[item.course.offeringId] ??= { code: item.course.code, name: item.course.name, items: [] }; map[item.course.offeringId].items.push(item); return map; }, {}));
  return <SafeAreaView className="flex-1 bg-[#051839]"><StatusBar style="light" backgroundColor="#051839"/><ScreenHeader title="Notes & Slides" fallbackRoute="/(student)/tasks"/><View className="bg-white pb-3"><FilterRow filters={['All', 'New', 'Opened', 'Pinned']} active={status} counts={{ New: items.filter((item) => item.isNew).length }} onSelect={setStatus}/></View><ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 30 }}>
    {loading ? <ActivityIndicator color="#2563EB"/> : null}{groups.map((group) => <View key={group.code}><Text className="mb-2 font-extrabold text-slate-700">{group.code} · {group.name}</Text>{group.items.map((item) => <Pressable key={item.id} onPress={() => router.push({ pathname: '/(student)/tasks/material-detail', params: { materialId: item.id } } as any)} className="mb-3 rounded-2xl border border-slate-200 bg-white p-4"><View className="flex-row"><View className="mr-3 h-12 w-12 items-center justify-center rounded-xl bg-emerald-100"><Text className="text-2xl">{item.type === 'slides' ? '📊' : '📄'}</Text></View><View className="flex-1"><View className="flex-row justify-between gap-2"><Text className="flex-1 font-extrabold text-slate-900">{item.title}</Text>{item.isNew ? <Text className="rounded-lg bg-red-100 px-2 py-1 text-xs font-bold text-red-700">NEW</Text> : null}</View><Text className="mt-1 text-xs text-slate-500">{item.type.toUpperCase()} · v{item.version} · {item.files.length} file{item.files.length === 1 ? '' : 's'}</Text>{item.topic ? <Text className="mt-2 text-sm text-slate-600">{item.topic}</Text> : null}</View><Text className="ml-2 self-center text-xl text-slate-400">›</Text></View></Pressable>)}</View>)}
    {!loading && !groups.length ? <View className="items-center py-16"><Text className="text-4xl">📚</Text><Text className="mt-3 font-bold text-slate-600">No materials in this filter</Text></View> : null}
  </ScrollView></SafeAreaView>;
}
