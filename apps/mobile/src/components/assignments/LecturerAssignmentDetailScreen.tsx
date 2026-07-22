import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { AssignmentAttachments } from './AssignmentAttachments';
import { assignmentService } from '@/src/services/assignment.service';
import { Assignment } from '@/src/types/assignment.types';

export default function LecturerAssignmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [working, setWorking] = useState(false);

  const load = useCallback(() => {
    if (!id) return;
    assignmentService.detail(id).then(setAssignment).catch((error) =>
      Alert.alert('Could not load assignment', error instanceof Error ? error.message : 'Please try again.'),
    );
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const changeStatus = async (status: Assignment['status'], success: string) => {
    if (!assignment) return;
    try {
      setWorking(true);
      const updated = await assignmentService.updateStatus(assignment.id, status);
      setAssignment(updated);
      Alert.alert(success, status === 'published' ? 'Students can now view and submit this assignment.' : 'The assignment status has been updated.');
    } catch (error) {
      Alert.alert('Could not update assignment', error instanceof Error ? error.message : 'Please try again.');
    } finally { setWorking(false); }
  };

  const confirmStatus = (title: string, message: string, status: Assignment['status'], success: string) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: title, onPress: () => void changeStatus(status, success) },
    ]);
  };

  const remove = () => {
    if (!assignment) return;
    Alert.alert('Delete Assignment', 'This permanently deletes the assignment. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            setWorking(true);
            await assignmentService.remove(assignment.id);
            router.replace('/(lecturer)/tasks' as any);
          } catch (error) {
            setWorking(false);
            Alert.alert('Could not delete assignment', error instanceof Error ? error.message : 'Please try again.');
          }
        },
      },
    ]);
  };

  if (!assignment) return <SafeAreaView className="flex-1 bg-[#F5F7FA]" />;

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title={assignment.title} fallbackRoute="/(lecturer)/tasks" />
      <ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 14 }}>
        <View className="rounded-2xl border border-slate-200 bg-white p-4">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="flex-1 text-xs font-bold text-blue-600">{assignment.course.code} · {assignment.course.name}</Text>
            <Text className={`rounded-full px-3 py-1 text-xs font-extrabold ${assignment.status === 'draft' ? 'bg-amber-100 text-amber-700' : assignment.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
              {assignment.status.toUpperCase()}
            </Text>
          </View>
          <Text className="mt-4 text-lg font-extrabold text-slate-900">{assignment.title}</Text>
          <Text className="mt-3 text-sm leading-6 text-slate-700">{assignment.instructions}</Text>
          <View className="mt-4 rounded-xl bg-slate-50 p-3">
            <Text className="text-sm font-semibold text-slate-600">Due: {new Date(assignment.dueAt).toLocaleString()}</Text>
            <Text className="mt-1 text-sm font-semibold text-slate-600">Total marks: {assignment.totalMarks}</Text>
            <Text className="mt-1 text-sm font-semibold text-slate-600">Submissions: {assignment.submissionCount}</Text>
          </View>
          <AssignmentAttachments files={assignment.attachments} />
        </View>

        {assignment.status !== 'archived' ? (
          <Pressable disabled={working} onPress={() => router.push({ pathname: '/(lecturer)/courses/create-assignment', params: { assignmentId: assignment.id } } as any)} className="items-center rounded-full border border-blue-600 bg-white py-3.5">
            <Text className="font-extrabold text-blue-700">Edit Assignment</Text>
          </Pressable>
        ) : null}

        {assignment.status === 'published' || assignment.status === 'closed' ? (
          <Pressable onPress={() => router.push({ pathname: '/(lecturer)/courses/submissions', params: { assignmentId: assignment.id } } as any)} className="items-center rounded-full bg-blue-600 py-3.5">
            <Text className="font-extrabold text-white">Review Submissions</Text>
          </Pressable>
        ) : null}

        {assignment.status === 'draft' ? <>
          <Pressable disabled={working} onPress={() => void changeStatus('published', 'Assignment Published')} className="items-center rounded-full bg-blue-600 py-3.5">
            <Text className="font-extrabold text-white">{working ? 'Please wait...' : 'Publish Assignment'}</Text>
          </Pressable>
          <Pressable disabled={working} onPress={remove} className="items-center rounded-full border border-red-200 bg-red-50 py-3.5">
            <Text className="font-extrabold text-red-700">Delete Assignment</Text>
          </Pressable>
        </> : null}

        {assignment.status === 'published' ? <>
          <Pressable disabled={working} onPress={() => confirmStatus('Close Assignment', 'Students will no longer be able to submit. You can reopen it later.', 'closed', 'Assignment Closed')} className="items-center rounded-full border border-amber-300 bg-amber-50 py-3.5">
            <Text className="font-extrabold text-amber-800">Close Submissions</Text>
          </Pressable>
          {assignment.submissionCount === 0 ? (
            <Pressable disabled={working} onPress={remove} className="items-center rounded-full border border-red-200 bg-red-50 py-3.5">
              <Text className="font-extrabold text-red-700">Delete Assignment</Text>
            </Pressable>
          ) : (
            <Pressable disabled={working} onPress={() => confirmStatus('Archive Assignment', 'The assignment and all submission records will be preserved.', 'archived', 'Assignment Archived')} className="items-center rounded-full border border-slate-300 bg-slate-100 py-3.5">
              <Text className="font-extrabold text-slate-700">Archive Assignment</Text>
            </Pressable>
          )}
        </> : null}

        {assignment.status === 'closed' ? <>
          <Pressable disabled={working} onPress={() => void changeStatus('published', 'Assignment Reopened')} className="items-center rounded-full bg-emerald-600 py-3.5">
            <Text className="font-extrabold text-white">Reopen Assignment</Text>
          </Pressable>
          <Pressable disabled={working} onPress={() => confirmStatus('Archive Assignment', 'The assignment and all submission records will be preserved.', 'archived', 'Assignment Archived')} className="items-center rounded-full border border-slate-300 bg-slate-100 py-3.5">
            <Text className="font-extrabold text-slate-700">Archive Assignment</Text>
          </Pressable>
        </> : null}

        {assignment.status === 'archived' ? (
          <Pressable disabled={working} onPress={() => void changeStatus('closed', 'Assignment Restored')} className="items-center rounded-full bg-blue-600 py-3.5">
            <Text className="font-extrabold text-white">Restore Assignment</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
