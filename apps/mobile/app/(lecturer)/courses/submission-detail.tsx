import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { AssignmentAttachments } from '@/src/components/assignments/AssignmentAttachments';
import { assignmentService } from '@/src/services/assignment.service';
import { Assignment, AssignmentSubmission } from '@/src/types/assignment.types';

type StudentData = {
  student: { id: string; name: string; studentId?: string | null };
  submissions: AssignmentSubmission[];
};

export default function SubmissionDetailScreen() {
  const { assignmentId, studentId } = useLocalSearchParams<{ assignmentId: string; studentId: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    if (!assignmentId || !studentId) return;
    assignmentService.submissions(assignmentId).then((result) => {
      setAssignment(result.assignment);
      const row = result.students.find((item) => item.student.id === studentId);
      if (!row) throw new Error('Student submission not found');
      setStudent({ student: row.student, submissions: row.submissions });
    }).catch((error) => Alert.alert('Could not load submission', error instanceof Error ? error.message : 'Please try again.'));
  }, [assignmentId, studentId]);

  useEffect(() => { load(); }, [load]);

  const grade = async (submission: AssignmentSubmission) => {
    if (!assignment) return;
    try {
      setSaving(true);
      await assignmentService.grade(assignment.id, submission.id, Number(score), feedback, true);
      setGradingId(null);
      setScore('');
      setFeedback('');
      load();
      Alert.alert('Result released', 'The student can now see the mark and feedback.');
    } catch (error) {
      Alert.alert('Could not save grade', error instanceof Error ? error.message : 'Please try again.');
    } finally { setSaving(false); }
  };

  if (!assignment || !student) return <SafeAreaView className="flex-1 bg-[#F5F7FA]" />;

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title="Submission Details" fallbackRoute="/(lecturer)/courses/submissions" />
      <ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 14 }}>
        <View className="rounded-2xl bg-[#0B2A59] p-4">
          <Text className="text-lg font-extrabold text-white">{student.student.name}</Text>
          <Text className="mt-1 text-sm text-blue-100">{student.student.studentId ?? 'Student'}</Text>
          <Text className="mt-3 text-sm font-bold text-white">{assignment.title}</Text>
          <Text className="mt-1 text-xs text-blue-200">{assignment.course.code} · {student.submissions.length} submission version{student.submissions.length === 1 ? '' : 's'}</Text>
        </View>

        {student.submissions.map((submission, index) => (
          <View key={submission.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <View className="flex-row items-center justify-between gap-3">
              <Text className="font-extrabold text-slate-900">Version {submission.version}</Text>
              <Text className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${submission.status === 'graded' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{submission.status}</Text>
            </View>
            <Text className="mt-1 text-xs text-slate-400">Submitted {new Date(submission.submittedAt).toLocaleString()}</Text>

            {submission.textResponse ? (
              <View className="mt-4 rounded-xl bg-slate-50 p-3">
                <Text className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Written response</Text>
                <Text className="mt-2 text-sm leading-6 text-slate-700">{submission.textResponse}</Text>
              </View>
            ) : (
              <Text className="mt-4 text-sm italic text-slate-400">No written response was submitted.</Text>
            )}

            <AssignmentAttachments files={submission.attachments} />

            {submission.attachments.length === 0 ? <Text className="mt-3 text-sm italic text-slate-400">No document was uploaded.</Text> : null}

            {submission.score !== null && submission.score !== undefined ? (
              <View className="mt-4 rounded-xl bg-emerald-50 p-3">
                <Text className="font-extrabold text-emerald-800">Awarded: {submission.score}/{assignment.totalMarks}</Text>
                {submission.feedback ? <Text className="mt-1 text-sm text-emerald-700">{submission.feedback}</Text> : null}
              </View>
            ) : null}

            {index === 0 ? (
              <Pressable
                onPress={() => { setGradingId(submission.id); setScore(submission.score?.toString() ?? ''); setFeedback(submission.feedback ?? ''); }}
                className="mt-4 items-center rounded-full bg-blue-50 py-3"
              >
                <Text className="font-bold text-blue-700">{submission.status === 'graded' ? 'Update Latest Grade' : 'Grade Latest Submission'}</Text>
              </Pressable>
            ) : (
              <Text className="mt-4 text-center text-xs font-semibold text-slate-400">Previous version · View only</Text>
            )}

            {gradingId === submission.id ? (
              <View className="mt-4 gap-3 border-t border-slate-100 pt-4">
                <TextInput value={score} onChangeText={setScore} keyboardType="number-pad" placeholder={`Score out of ${assignment.totalMarks}`} className="rounded-xl border border-slate-200 px-3 py-3" />
                <TextInput value={feedback} onChangeText={setFeedback} multiline textAlignVertical="top" placeholder="Feedback for the student" className="min-h-24 rounded-xl border border-slate-200 px-3 py-3" />
                <Pressable disabled={saving || !score.trim()} onPress={() => void grade(submission)} className={`items-center rounded-full py-3 ${saving || !score.trim() ? 'bg-slate-300' : 'bg-blue-600'}`}>
                  <Text className="font-bold text-white">{saving ? 'Saving...' : 'Save and Release Grade'}</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
