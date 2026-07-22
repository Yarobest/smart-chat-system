import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { AssignmentAttachments } from '@/src/components/assignments/AssignmentAttachments';
import { materialService } from '@/src/services/material.service';
import { CourseMaterial } from '@/src/types/material.types';

export default function LecturerMaterialDetail() {
  const { id } = useLocalSearchParams<{ id: string }>(); const [item, setItem] = useState<CourseMaterial | null>(null); const [busy, setBusy] = useState(false);
  const load = useCallback(() => { if (id) materialService.detail(id).then(setItem).catch((e) => Alert.alert('Could not load material', e instanceof Error ? e.message : 'Try again.')); }, [id]);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  const update = async (status: string) => { if (!id) return; setBusy(true); try { setItem(await materialService.update(id, { status })); } finally { setBusy(false); } };
  const remove = () => Alert.alert('Delete material?', 'This is permanent. Published material can only be deleted before students open it.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { if (!id) return; try { await materialService.remove(id); router.replace('/(lecturer)/courses/materials' as any); } catch (e) { Alert.alert('Cannot delete', e instanceof Error ? e.message : 'Archive this material instead.'); } } }]);
  if (!item) return <SafeAreaView className="flex-1 items-center justify-center bg-white"><ActivityIndicator color="#2563EB"/></SafeAreaView>;
  const actions = [{ label: 'Edit', show: item.status !== 'archived', run: () => router.push({ pathname: '/(lecturer)/courses/push-note', params: { materialId: item.id } } as any) }, { label: 'Publish', show: item.status === 'draft', run: () => void update('published'), primary: true }, { label: 'Archive', show: item.status === 'published', run: () => void update('archived') }, { label: 'Restore', show: item.status === 'archived', run: () => void update('published'), primary: true }, { label: 'Delete', show: item.status === 'draft' || item.viewCount === 0, run: remove, danger: true }].filter((a) => a.show);
  return <SafeAreaView className="flex-1 bg-[#051839]"><StatusBar style="light" backgroundColor="#051839"/><ScreenHeader title={item.title} fallbackRoute="/(lecturer)/courses/materials"/><ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 14 }}>
    <View className="rounded-2xl border border-slate-200 bg-white p-4"><View className="flex-row justify-between"><Text className="flex-1 text-lg font-extrabold text-slate-900">{item.course.code} · {item.course.name}</Text><Text className="text-xs font-bold uppercase text-blue-700">{item.status}</Text></View><Text className="mt-3 text-sm text-slate-600">{item.description || 'No description provided.'}</Text><View className="mt-4 rounded-xl bg-slate-50 p-3"><Text className="text-xs text-slate-500">{item.type.toUpperCase()} · {item.topic || 'General'} · Version {item.version}</Text><Text className="mt-1 text-xs text-slate-500">{item.viewCount} student open{item.viewCount === 1 ? '' : 's'} · {item.allowDownload ? 'Downloads allowed' : 'Preview only'}</Text></View><AssignmentAttachments files={item.files}/></View>
    <View className="flex-row flex-wrap gap-2">{actions.map((action) => <Pressable key={action.label} disabled={busy} onPress={action.run} className={`w-[48%] items-center rounded-lg border py-3 ${action.primary ? 'border-blue-600 bg-blue-600' : action.danger ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'}`}><Text className={`font-bold ${action.primary ? 'text-white' : action.danger ? 'text-red-700' : 'text-slate-700'}`}>{action.label}</Text></Pressable>)}</View>
  </ScrollView></SafeAreaView>;
}
