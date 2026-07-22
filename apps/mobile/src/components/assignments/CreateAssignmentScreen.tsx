import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { assignmentService } from '@/src/services/assignment.service';
import { AssignmentCourseOffering, AssignmentFile } from '@/src/types/assignment.types';

export default function CreateAssignmentScreen() {
  const { assignmentId } = useLocalSearchParams<{ assignmentId?: string }>();
  const [offerings, setOfferings] = useState<AssignmentCourseOffering[]>([]);
  const [courseOfferingId, setCourseOfferingId] = useState('');
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueAt, setDueAt] = useState(() => {
    const initial = new Date();
    initial.setDate(initial.getDate() + 7);
    initial.setHours(17, 0, 0, 0);
    return initial;
  });
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time' | null>(null);
  const [totalMarks, setTotalMarks] = useState('100');
  const [allowFile, setAllowFile] = useState(true);
  const [allowText, setAllowText] = useState(false);
  const [allowLate, setAllowLate] = useState(false);
  const [allowResubmission, setAllowResubmission] = useState(false);
  const [attachments, setAttachments] = useState<AssignmentFile[]>([]);
  const [saving, setSaving] = useState(false);
  const [existingSubmissionCount, setExistingSubmissionCount] = useState(0);
  const isEditing = Boolean(assignmentId);

  useEffect(() => {
    const offeringsRequest = assignmentService.courseOfferings().then(setOfferings);
    const assignmentRequest = assignmentId
      ? assignmentService.detail(assignmentId).then((assignment) => {
          setCourseOfferingId(assignment.course.offeringId);
          setTitle(assignment.title);
          setInstructions(assignment.instructions);
          setDueAt(new Date(assignment.dueAt));
          setTotalMarks(String(assignment.totalMarks));
          setAllowFile(assignment.allowFile);
          setAllowText(assignment.allowText);
          setAllowLate(assignment.allowLate);
          setAllowResubmission(assignment.allowResubmission);
          setAttachments(assignment.attachments);
          setExistingSubmissionCount(assignment.submissionCount);
        })
      : Promise.resolve();
    Promise.all([offeringsRequest, assignmentRequest]).catch((error) => {
      Alert.alert('Could not load assignment', error instanceof Error ? error.message : 'Please try again.');
    });
  }, [assignmentId]);

  const attachQuestion = async () => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (result.canceled) return;
    try {
      const uploaded = await assignmentService.uploadFile(result.assets[0]);
      setAttachments((current) => [...current, uploaded]);
    } catch (error) {
      Alert.alert('Upload failed', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const save = async (publish: boolean) => {
    if (!courseOfferingId || !title.trim() || !instructions.trim()) {
      Alert.alert('Missing information', 'Select a course and enter a title and instructions.');
      return;
    }
    try {
      setSaving(true);
      const input = {
        courseOfferingId,
        title: title.trim(),
        instructions: instructions.trim(),
        dueAt: dueAt.toISOString(),
        totalMarks: Number(totalMarks),
        allowFile,
        allowText,
        allowLate,
        allowResubmission,
        allowedFileTypes: [],
        maxFileSizeMb: 10,
        attachments,
        publish,
      };
      if (assignmentId) await assignmentService.update(assignmentId, input);
      else await assignmentService.create(input);
      const heading = isEditing ? 'Assignment updated' : publish ? 'Assignment published' : 'Draft saved';
      const message = isEditing ? 'Your changes have been saved.' : publish ? 'Students can now see this assignment.' : 'Students cannot see this draft.';
      Alert.alert(heading, message, [
        { text: 'Done', onPress: () => router.replace((assignmentId ? `/(lecturer)/courses/assignments/${assignmentId}` : '/(lecturer)/tasks') as any) },
      ]);
    } catch (error) {
      Alert.alert('Could not save assignment', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = 'rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900';
  const selectedCourse = offerings.find((offering) => offering.id === courseOfferingId);

  const changeDeadline = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS !== 'ios') setPickerMode(null);
    if (!selected || !pickerMode) return;

    setDueAt((current) => {
      const next = new Date(current);
      if (pickerMode === 'date') {
        next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      } else {
        next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      }
      return next;
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title={isEditing ? 'Edit Assignment' : 'Create Assignment'} fallbackRoute={assignmentId ? `/(lecturer)/courses/assignments/${assignmentId}` : '/(lecturer)/tasks'} />
      <ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 14 }}>
        <View>
          <Text className="mb-2 text-xs font-extrabold text-slate-500">COURSE</Text>
          <Pressable
            onPress={() => { if (!isEditing) setCourseDropdownOpen((current) => !current); }}
            className="flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 py-3"
          >
            <View className="flex-1">
              <Text className={`text-sm font-bold ${selectedCourse ? 'text-slate-900' : 'text-slate-400'}`}>
                {selectedCourse ? `${selectedCourse.courseCode} · ${selectedCourse.courseName}` : 'Select a course'}
              </Text>
              {selectedCourse ? (
                <Text className="mt-1 text-xs text-slate-500">
                  {selectedCourse.academicYear} · {selectedCourse.semester.replace('_', ' ')}
                </Text>
              ) : null}
            </View>
            <Ionicons name={isEditing ? 'lock-closed-outline' : courseDropdownOpen ? 'chevron-up' : 'chevron-down'} size={19} color="#64748B" />
          </Pressable>
          {courseDropdownOpen ? (
            <View className="mt-2 max-h-64 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <ScrollView nestedScrollEnabled>
                {offerings.map((offering) => (
                  <Pressable
                    key={offering.id}
                    onPress={() => {
                      setCourseOfferingId(offering.id);
                      setCourseDropdownOpen(false);
                    }}
                    className={`flex-row items-center border-b border-slate-100 px-4 py-3 ${courseOfferingId === offering.id ? 'bg-blue-50' : 'bg-white'}`}
                  >
                    <View className="flex-1">
                      <Text className={`text-sm font-bold ${courseOfferingId === offering.id ? 'text-blue-700' : 'text-slate-800'}`}>
                        {offering.courseCode} · {offering.courseName}
                      </Text>
                      <Text className="mt-1 text-xs text-slate-500">
                        {[offering.programme, offering.yearGroup].filter(Boolean).join(' · ')}
                      </Text>
                    </View>
                    {courseOfferingId === offering.id ? <Ionicons name="checkmark" size={19} color="#2563EB" /> : null}
                  </Pressable>
                ))}
                {offerings.length === 0 ? (
                  <Text className="px-4 py-5 text-center text-sm text-slate-500">No active course offerings assigned</Text>
                ) : null}
              </ScrollView>
            </View>
          ) : null}
        </View>

        <TextInput value={title} onChangeText={setTitle} placeholder="Assignment title" placeholderTextColor="#94A3B8" className={fieldClass} />
        <TextInput value={instructions} onChangeText={setInstructions} placeholder="Instructions" placeholderTextColor="#94A3B8" multiline className={`${fieldClass} min-h-32`} textAlignVertical="top" />
        <View>
          <Text className="mb-2 text-xs font-extrabold text-slate-500">DEADLINE</Text>
          <View className="flex-row gap-3">
            <Pressable onPress={() => setPickerMode('date')} className="flex-1 flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <Ionicons name="calendar-outline" size={19} color="#2563EB" />
              <View className="ml-3 flex-1">
                <Text className="text-xs font-semibold text-slate-400">DATE</Text>
                <Text className="mt-0.5 text-sm font-bold text-slate-800">{dueAt.toLocaleDateString()}</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setPickerMode('time')} className="flex-1 flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <Ionicons name="time-outline" size={19} color="#2563EB" />
              <View className="ml-3 flex-1">
                <Text className="text-xs font-semibold text-slate-400">TIME</Text>
                <Text className="mt-0.5 text-sm font-bold text-slate-800">{dueAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
            </Pressable>
          </View>
          {pickerMode ? (
            <View className="mt-2 rounded-2xl border border-slate-200 bg-white p-2">
              <DateTimePicker
                value={dueAt}
                mode={pickerMode}
                minimumDate={pickerMode === 'date' ? new Date() : undefined}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={changeDeadline}
              />
              {Platform.OS === 'ios' ? (
                <Pressable onPress={() => setPickerMode(null)} className="self-end rounded-full bg-blue-600 px-5 py-2">
                  <Text className="text-sm font-bold text-white">Done</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>
        <View>
          <TextInput
            value={totalMarks}
            onChangeText={setTotalMarks}
            editable={existingSubmissionCount === 0}
            placeholder="Total marks"
            keyboardType="number-pad"
            className={`${fieldClass} ${existingSubmissionCount > 0 ? 'bg-slate-100 text-slate-400' : ''}`}
          />
          {existingSubmissionCount > 0 ? (
            <Text className="mt-2 text-xs font-semibold text-slate-500">
              Total marks are locked because students have already submitted. You can still edit the instructions, deadline, late submissions, and resubmission settings.
            </Text>
          ) : null}
        </View>

        <View className="rounded-2xl border border-slate-200 bg-white px-4">
          {[
            { label: 'Allow file upload', value: allowFile, change: setAllowFile },
            { label: 'Allow written response', value: allowText, change: setAllowText },
            { label: 'Accept late submissions', value: allowLate, change: setAllowLate },
            { label: 'Allow resubmission', value: allowResubmission, change: setAllowResubmission },
          ].map((option) => (
            <View key={option.label} className="flex-row items-center justify-between border-b border-slate-100 py-3">
              <Text className="flex-1 text-sm font-semibold text-slate-700">{option.label}</Text>
              <Switch value={option.value} onValueChange={option.change} trackColor={{ true: '#2563EB' }} />
            </View>
          ))}
        </View>

        <Pressable onPress={attachQuestion} className="items-center rounded-2xl border border-dashed border-blue-300 bg-blue-50 px-4 py-4">
          <Text className="font-bold text-blue-700">📎 Attach question sheet</Text>
        </Pressable>
        {attachments.map((file) => <Text key={file.uri} className="text-sm text-slate-600">✓ {file.name}</Text>)}

        {isEditing ? (
          <Pressable disabled={saving} onPress={() => save(false)} className="items-center rounded-full bg-blue-600 py-3">
            <Text className="font-bold text-white">{saving ? 'Saving...' : 'Save Changes'}</Text>
          </Pressable>
        ) : <View className="flex-row gap-3">
          <Pressable disabled={saving} onPress={() => save(false)} className="flex-1 items-center rounded-full border border-blue-600 bg-white py-3">
            <Text className="font-bold text-blue-700">Save Draft</Text>
          </Pressable>
          <Pressable disabled={saving} onPress={() => save(true)} className="flex-1 items-center rounded-full bg-blue-600 py-3">
            <Text className="font-bold text-white">{saving ? 'Saving...' : 'Publish'}</Text>
          </Pressable>
        </View>}
      </ScrollView>
    </SafeAreaView>
  );
}
