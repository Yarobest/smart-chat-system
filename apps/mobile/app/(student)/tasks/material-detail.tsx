import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { AssignmentAttachments } from '@/src/components/assignments/AssignmentAttachments';
import { materialService } from '@/src/services/material.service';
import { CourseMaterial } from '@/src/types/material.types';

export default function StudentMaterialDetail() {
  const { materialId } = useLocalSearchParams<{ materialId: string }>(); const [item, setItem] = useState<CourseMaterial | null>(null);
  useFocusEffect(useCallback(() => { if (!materialId) return; let active = true; Promise.all([materialService.detail(materialId), materialService.open(materialId)]).then(([data]) => active && setItem({ ...data, isNew: false })).catch((e) => Alert.alert('Could not open material', e instanceof Error ? e.message : 'Try again.')); return () => { active = false; }; }, [materialId]));
  if (!item) return <SafeAreaView className="flex-1 items-center justify-center bg-white"><ActivityIndicator color="#2563EB"/></SafeAreaView>;
  return <SafeAreaView className="flex-1 bg-[#051839]"><StatusBar style="light" backgroundColor="#051839"/><ScreenHeader title={item.title} fallbackRoute="/(student)/tasks/notes"/><ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}><View className="rounded-2xl border border-slate-200 bg-white p-4"><Text className="text-base font-extrabold text-blue-800">{item.course.code} · {item.course.name}</Text><Text className="mt-2 text-xs font-bold uppercase text-emerald-700">{item.type} · Version {item.version}</Text>{item.topic ? <Text className="mt-4 font-bold text-slate-800">{item.topic}</Text> : null}<Text className="mt-3 text-sm leading-6 text-slate-600">{item.description || 'No description provided.'}</Text><AssignmentAttachments files={item.files}/>{!item.allowDownload ? <Text className="mt-3 text-xs text-slate-400">Files are provided for viewing. Your lecturer has disabled permanent downloads.</Text> : null}</View></ScrollView></SafeAreaView>;
}
