import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { FilterRow } from '@/src/components/common/FilterRow';
import { assignmentService } from '@/src/services/assignment.service';
import { Assignment, AssignmentSubmission } from '@/src/types/assignment.types';

type SubmissionFilter = 'All' | 'Submitted' | 'Not Yet' | 'Graded';
const filters: SubmissionFilter[] = ['All', 'Submitted', 'Not Yet', 'Graded'];

type StudentRow = {
  student: { id: string; name: string; studentId?: string | null };
  submission: AssignmentSubmission | null;
  submissions: AssignmentSubmission[];
};

export default function SubmissionsScreen() {
  const params = useLocalSearchParams<{ assignmentId?: string }>();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [active, setActive] = useState<SubmissionFilter>('All');

  useEffect(() => {
    assignmentService.list().then((items) => {
      setAssignments(items);
      const requested = items.find((item) => item.id === params.assignmentId);
      if (requested) openAssignment(requested);
    }).catch((error) => Alert.alert('Could not load assignments', error.message));
  }, [params.assignmentId]);

  const openAssignment = (assignment: Assignment) => {
    setSelected(assignment);
    assignmentService.submissions(assignment.id).then((result) => setStudents(result.students)).catch((error) => Alert.alert('Could not load submissions', error.message));
  };

  const visible = useMemo(() => students.filter((row) => {
    if (active === 'Not Yet') return !row.submission;
    if (active === 'Submitted') return row.submission && row.submission.status !== 'graded';
    if (active === 'Graded') return row.submission?.status === 'graded';
    return true;
  }), [active, students]);

  if (!selected) {
    return (
      <SafeAreaView className="flex-1 bg-[#051839]">
        <StatusBar style="light" backgroundColor="#051839" />
        <ScreenHeader title="Assignment Submissions" fallbackRoute="/(lecturer)/tasks" />
        <ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{ padding: 16, gap: 12 }}>
          {assignments.length === 0 ? <View className="items-center py-20"><Text className="text-4xl">📥</Text><Text className="mt-3 font-bold text-slate-500">No assignments created yet</Text></View> : null}
          {assignments.map((assignment) => (
            <Pressable key={assignment.id} onPress={() => openAssignment(assignment)} className="rounded-2xl border border-slate-200 bg-white p-4">
              <Text className="text-base font-extrabold text-slate-900">{assignment.title}</Text>
              <Text className="mt-1 text-sm font-semibold text-blue-600">{assignment.course.code} · {assignment.status}</Text>
              <Text className="mt-2 text-sm text-slate-500">{assignment.submissionCount} submissions · Due {new Date(assignment.dueAt).toLocaleDateString()}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  const submitted = students.filter((row) => row.submission).length;
  const graded = students.filter((row) => row.submission?.status === 'graded').length;

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title={selected.title} onBackPress={() => setSelected(null)} />
      <View className="flex-row bg-white px-4 py-3">
        <Text className="flex-1 text-center text-sm font-bold text-emerald-700">{submitted} submitted</Text>
        <Text className="flex-1 text-center text-sm font-bold text-blue-700">{graded} graded</Text>
        <Text className="flex-1 text-center text-sm font-bold text-slate-500">{students.length} students</Text>
      </View>
      <FilterRow filters={filters} active={active} onSelect={setActive} />
      <ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{ padding: 16, gap: 12 }}>
        {visible.map((row) => (
          <View key={row.student.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1"><Text className="font-extrabold text-slate-900">{row.student.name}</Text><Text className="mt-1 text-xs text-slate-500">{row.student.studentId ?? 'Student'}</Text></View>
              <Text className={`text-xs font-bold uppercase ${row.submission ? 'text-emerald-700' : 'text-slate-400'}`}>{row.submission?.status ?? 'Not yet'}</Text>
            </View>
            {row.submission ? (
              <Pressable
                onPress={() => router.push({ pathname: '/(lecturer)/courses/submission-detail', params: { assignmentId: selected.id, studentId: row.student.id } } as any)}
                className="mt-3 flex-row items-center justify-between rounded-xl bg-blue-50 px-4 py-3"
              >
                <Text className="text-sm font-bold text-blue-700">View submission details ({row.submissions.length})</Text>
                <Text className="text-lg text-blue-700">›</Text>
              </Pressable>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
