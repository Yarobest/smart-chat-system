import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { FilterRow } from '@/src/components/common/FilterRow';
import { assignmentService } from '@/src/services/assignment.service';
import { Assignment } from '@/src/types/assignment.types';

type AssignmentFilter = 'All' | 'Pending' | 'Submitted' | 'Graded';
const filters: AssignmentFilter[] = ['All', 'Pending', 'Submitted', 'Graded'];

export default function StudentAssignmentsScreen() {
  const [items, setItems] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<AssignmentFilter>('All');
  const [activeCourse, setActiveCourse] = useState('All Courses');

  useFocusEffect(useCallback(() => {
    let mounted = true;
    setLoading(true);
    assignmentService.list().then((result) => mounted && setItems(result)).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []));

  const courseFilters = useMemo(() => ['All Courses', ...Array.from(new Set(items.map((item) => item.course.code)))], [items]);
  const scopedItems = activeCourse === 'All Courses' ? items : items.filter((item) => item.course.code === activeCourse);
  const visible = scopedItems.filter((assignment) => {
    if (active === 'Pending') return assignment.status === 'published' && !assignment.submission;
    if (active === 'Submitted') return assignment.submission && (assignment.recordedScore === null || assignment.recordedScore === undefined);
    if (active === 'Graded') return assignment.recordedScore !== null && assignment.recordedScore !== undefined;
    return true;
  }).sort((a, b) => a.course.code.localeCompare(b.course.code) || new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  const counts: Record<AssignmentFilter, number> = {
    All: scopedItems.length,
    Pending: scopedItems.filter((item) => item.status === 'published' && !item.submission).length,
    Submitted: scopedItems.filter((item) => item.submission && (item.recordedScore === null || item.recordedScore === undefined)).length,
    Graded: scopedItems.filter((item) => item.recordedScore !== null && item.recordedScore !== undefined).length,
  };

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title="Assignments" fallbackRoute="/(student)/tasks" />
      <FilterRow filters={courseFilters} active={activeCourse} onSelect={setActiveCourse} />
      <FilterRow filters={filters} active={active} onSelect={setActive} counts={counts} />
      <ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View className="rounded-2xl bg-[#0B2A59] p-4">
          <Text className="text-xs font-bold uppercase tracking-wider text-blue-200">Assignment overview</Text>
          <View className="mt-3 flex-row items-end justify-between">
            <View className="flex-1">
              <Text className="text-3xl font-extrabold text-white">{counts.Pending}</Text>
              <Text className="text-sm text-blue-100">Pending</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-extrabold text-white">{counts.Submitted}</Text>
              <Text className="text-sm text-blue-100">Submitted</Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-2xl font-extrabold text-white">{counts.Graded}</Text>
              <Text className="text-sm text-blue-100">Graded</Text>
            </View>
          </View>
        </View>

        {loading ? <ActivityIndicator color="#2563EB" /> : null}
        {!loading && visible.length === 0 ? (
          <View className="items-center py-20"><Text className="text-4xl">📋</Text><Text className="mt-3 font-bold text-slate-500">No assignments here</Text></View>
        ) : null}
        {visible.map((assignment, index) => {
          const overdue = Date.now() > new Date(assignment.dueAt).getTime();
          const status = assignment.recordedScore !== null && assignment.recordedScore !== undefined
            ? 'graded'
            : assignment.submission?.status ?? (assignment.status === 'closed' ? 'closed' : overdue ? 'missed' : 'pending');
          const showCourseHeading = activeCourse === 'All Courses' && (index === 0 || visible[index - 1].course.code !== assignment.course.code);
          return (
            <View key={assignment.id}>
            {showCourseHeading ? <View className="mb-2 mt-2"><Text className="text-sm font-extrabold text-slate-800">{assignment.course.code} · {assignment.course.name}</Text></View> : null}
            <Pressable onPress={() => router.push(`/(student)/tasks/assignments/${assignment.id}` as any)} className="rounded-2xl border border-slate-200 bg-white p-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1"><Text className="text-base font-extrabold text-slate-900" numberOfLines={2}>{assignment.title}</Text><Text className="mt-1 text-xs font-bold text-blue-600">{assignment.course.code} · {assignment.course.name}</Text></View>
                <View className={`rounded-md px-2 py-1 ${status === 'graded' ? 'bg-emerald-50' : status === 'missed' ? 'bg-red-50' : status === 'pending' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                  <Text className={`text-xs font-bold uppercase ${status === 'graded' ? 'text-emerald-700' : status === 'missed' ? 'text-red-700' : status === 'pending' ? 'text-amber-700' : 'text-blue-700'}`}>{status}</Text>
                </View>
              </View>
              <Text className="mt-3 text-sm text-slate-500">Due {new Date(assignment.dueAt).toLocaleString()} · {assignment.totalMarks} marks</Text>
              <Text className={`mt-2 font-extrabold ${assignment.recordedScore !== null && assignment.recordedScore !== undefined ? 'text-emerald-700' : 'text-slate-500'}`}>
                Score: {assignment.recordedScore ?? '-'}/{assignment.totalMarks}
              </Text>
            </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
