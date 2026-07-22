import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { assignmentService } from '@/src/services/assignment.service';
import { Assignment, AssignmentFile } from '@/src/types/assignment.types';
import { AssignmentAttachments } from './AssignmentAttachments';

export default function StudentAssignmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [response, setResponse] = useState('');
  const [files, setFiles] = useState<AssignmentFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    if (!id) return;
    assignmentService.detail(id).then(setAssignment).catch((error) => Alert.alert('Could not load assignment', error.message));
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (result.canceled) return;
    try {
      const uploaded = await assignmentService.uploadFile(result.assets[0]);
      setFiles((current) => [...current, uploaded]);
    } catch (error) { Alert.alert('Upload failed', error instanceof Error ? error.message : 'Please try again.'); }
  };

  const submit = async () => {
    if (!id || !assignment) return;
    const hasResponse = (assignment.allowText && Boolean(response.trim())) || (assignment.allowFile && files.length > 0);
    if (!hasResponse) return;
    try {
      setSubmitting(true);
      await assignmentService.submit(id, response, files);
      Alert.alert('Submitted', 'Your submission receipt has been recorded.');
      setResponse(''); setFiles([]); load();
    } catch (error) { Alert.alert('Could not submit', error instanceof Error ? error.message : 'Please try again.'); }
    finally { setSubmitting(false); }
  };

  if (!assignment) return <SafeAreaView className="flex-1 bg-[#F5F7FA]" />;
  const pastDue = Date.now() > new Date(assignment.dueAt).getTime();
  const canSubmitVersion = !assignment.submission || assignment.allowResubmission;
  const submissionOpen = assignment.status === 'published' && canSubmitVersion && (!pastDue || assignment.allowLate);
  const hasResponse = (assignment.allowText && Boolean(response.trim())) || (assignment.allowFile && files.length > 0);
  const submitDisabled = submitting || !hasResponse;

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title={assignment.title} fallbackRoute="/(student)/tasks/assignments" />
      <ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{ padding: 16, gap: 14 }}>
        <View className="rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-xs font-bold text-blue-600">{assignment.course.code} · {assignment.course.name}</Text>
          <Text className="mt-3 text-sm leading-6 text-slate-700">{assignment.instructions}</Text>
          <Text className="mt-3 text-sm font-semibold text-slate-500">Due: {new Date(assignment.dueAt).toLocaleString()}</Text>
          <Text className="mt-1 text-sm font-semibold text-slate-500">Total marks available: {assignment.totalMarks}</Text>
          <AssignmentAttachments files={assignment.attachments} />
        </View>

        {assignment.submission ? (
          <View className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <Text className="font-extrabold text-emerald-800">Submission received</Text>
            <Text className="mt-1 text-sm text-emerald-700">Version {assignment.submission.version} · {new Date(assignment.submission.submittedAt).toLocaleString()}</Text>
            {assignment.recordedScore !== null && assignment.recordedScore !== undefined ? (
              <View className="mt-3">
                <Text className="text-xs font-bold uppercase tracking-wider text-emerald-700">Your awarded score</Text>
                <Text className="mt-1 text-lg font-extrabold text-emerald-900">{assignment.recordedScore} out of {assignment.totalMarks}</Text>
                {assignment.recordedGradeVersion ? <Text className="mt-1 text-xs text-emerald-700">Highest released grade · Version {assignment.recordedGradeVersion}</Text> : null}
              </View>
            ) : <Text className="mt-3 text-sm font-semibold text-emerald-700">Awaiting lecturer grading</Text>}
            {assignment.recordedFeedback ? <Text className="mt-2 text-sm text-emerald-800">Feedback: {assignment.recordedFeedback}</Text> : null}
          </View>
        ) : null}

        {submissionOpen ? (
          <View className="rounded-2xl border border-slate-200 bg-white p-4">
            <Text className="mb-3 font-extrabold text-slate-900">{assignment.submission ? 'Submit a new version' : 'Your submission'}</Text>
            {assignment.allowText ? <TextInput value={response} onChangeText={setResponse} multiline textAlignVertical="top" placeholder="Write your response..." className="min-h-32 rounded-xl border border-slate-200 px-3 py-3 text-sm" /> : null}
            {assignment.allowFile ? <Pressable onPress={pickFile} className="mt-3 items-center rounded-xl border border-dashed border-blue-300 bg-blue-50 py-3"><Text className="font-bold text-blue-700">📎 Upload file</Text></Pressable> : null}
            {files.map((file) => <Text key={file.uri} className="mt-2 text-sm text-slate-600">✓ {file.name}</Text>)}
            {!hasResponse ? (
              <Text className="mt-3 text-center text-xs font-semibold text-slate-400">
                {assignment.allowFile && assignment.allowText ? 'Upload a file or write a response to enable submission.' : assignment.allowFile ? 'Upload a file to enable submission.' : 'Write a response to enable submission.'}
              </Text>
            ) : null}
            <Pressable disabled={submitDisabled} onPress={submit} className={`mt-4 items-center rounded-full py-3 ${submitDisabled ? 'bg-slate-300' : 'bg-blue-600'}`}>
              <Text className={`font-bold ${submitDisabled ? 'text-slate-500' : 'text-white'}`}>{submitting ? 'Submitting...' : 'Submit Assignment'}</Text>
            </Pressable>
          </View>
        ) : (
          <View className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
            <Text className="font-extrabold text-slate-700">Submission unavailable</Text>
            <Text className="mt-1 text-sm text-slate-500">
              {assignment.status === 'closed'
                ? 'The lecturer has closed this assignment. Your submission, grade and feedback remain available above.'
                : pastDue && !assignment.allowLate
                ? 'The deadline has passed and late submissions are not allowed.'
                : 'You have already submitted and this assignment does not allow resubmission.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
