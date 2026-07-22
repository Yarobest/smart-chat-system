import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { materialService } from '@/src/services/material.service';
import { CourseMaterial } from '@/src/types/material.types';

export default function LecturerMaterialsList() {
  const [items, setItems] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  useFocusEffect(useCallback(() => { let active = true; materialService.list().then((data) => active && setItems(data)).finally(() => active && setLoading(false)); return () => { active = false; }; }, []));
  const groups = useMemo(() => Object.values(items.reduce((map: Record<string, { code: string; name: string; items: CourseMaterial[] }>, item) => { const key = item.course.offeringId; map[key] ??= { code: item.course.code, name: item.course.name, items: [] }; map[key].items.push(item); return map; }, {})), [items]);
  return <SafeAreaView className="flex-1 bg-[#051839]"><StatusBar style="light" backgroundColor="#051839"/><ScreenHeader title="Notes & Slides" fallbackRoute="/(lecturer)/tasks"/><ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 30 }}>
    <Pressable onPress={() => router.push('/(lecturer)/courses/push-note' as any)} className="items-center rounded-lg bg-blue-600 py-3"><Text className="font-bold text-white">+ Upload Material</Text></Pressable>
    {loading ? <ActivityIndicator color="#2563EB"/> : null}
    {groups.map((group) => <View key={group.code} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><View className="bg-emerald-50 px-4 py-3"><Text className="font-extrabold text-emerald-900">{group.code} · {group.name}</Text><Text className="mt-1 text-xs text-emerald-700">{group.items.length} material{group.items.length === 1 ? '' : 's'} · {group.items.reduce((sum, item) => sum + item.viewCount, 0)} opens</Text></View>{group.items.map((item) => <Pressable key={item.id} onPress={() => router.push(`/(lecturer)/courses/materials/${item.id}` as any)} className="border-t border-slate-100 px-4 py-4"><View className="flex-row justify-between gap-3"><View className="flex-1"><Text className="font-extrabold text-slate-900">{item.title}</Text><Text className="mt-1 text-xs text-slate-500">{item.type.toUpperCase()} · v{item.version} · {item.files.length} file{item.files.length === 1 ? '' : 's'}</Text></View><Text className="text-xs font-bold uppercase text-emerald-700">{item.status}</Text></View></Pressable>)}</View>)}
    {!loading && !groups.length ? <View className="items-center py-16"><Text className="text-4xl">📚</Text><Text className="mt-3 font-bold text-slate-600">No course materials yet</Text></View> : null}
  </ScrollView></SafeAreaView>;
}
