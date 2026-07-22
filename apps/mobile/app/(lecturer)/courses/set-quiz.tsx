import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { quizService } from '@/src/services/quiz.service';
import { QuizCourse, QuizQuestionInput } from '@/src/types/quiz.types';

type DraftQuestion = QuizQuestionInput & { key: string };
const newQuestion = (): DraftQuestion => ({ key: `${Date.now()}-${Math.random()}`, type: 'MULTIPLE_CHOICE', text: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 });

export default function SetQuizScreen() {
  const { quizId } = useLocalSearchParams<{ quizId?: string }>();
  const [courses, setCourses] = useState<QuizCourse[]>([]);
  const [courseId, setCourseId] = useState('');
  const [courseOpen, setCourseOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [startAt, setStartAt] = useState(() => new Date());
  const [endAt, setEndAt] = useState(() => new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [picker, setPicker] = useState<'startDate' | 'startTime' | 'endDate' | 'endTime' | null>(null);
  const [duration, setDuration] = useState('30');
  const [maxAttempts, setMaxAttempts] = useState('1');
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleAnswers, setShuffleAnswers] = useState(false);
  const [questions, setQuestions] = useState<DraftQuestion[]>([newQuestion()]);
  const [saving, setSaving] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const isEditing = Boolean(quizId);

  useEffect(() => {
    const courseRequest = quizService.offerings().then(setCourses);
    const quizRequest = quizId ? quizService.detail(quizId).then((quiz) => {
      setCourseId(quiz.course.offeringId); setTitle(quiz.title); setInstructions(quiz.instructions);
      setStartAt(new Date(quiz.startAt)); setEndAt(new Date(quiz.endAt)); setDuration(String(quiz.durationMinutes)); setMaxAttempts(String(quiz.maxAttempts));
      setAttemptCount(quiz.attemptCount); setQuestions(quiz.questions.map((q) => ({ key: q.id, type: q.type.toUpperCase() as DraftQuestion['type'], text: q.text, options: q.options, correctAnswer: q.correctAnswer, marks: q.marks })));
    }) : Promise.resolve();
    Promise.all([courseRequest, quizRequest]).catch((e) => Alert.alert('Could not load quiz', e.message));
  }, [quizId]);
  const selectedCourse = courses.find((item) => item.id === courseId);
  const updateQuestion = (key: string, change: Partial<DraftQuestion>) => setQuestions((items) => items.map((item) => item.key === key ? { ...item, ...change } : item));

  const changeDate = (selected?: Date) => {
    if (!selected || !picker) { if (Platform.OS !== 'ios') setPicker(null); return; }
    const target = picker.startsWith('start') ? startAt : endAt; const next = new Date(target);
    if (picker.endsWith('Date')) next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
    else next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    picker.startsWith('start') ? setStartAt(next) : setEndAt(next); if (Platform.OS !== 'ios') setPicker(null);
  };

  const save = async (publish: boolean) => {
    if (!courseId || !title.trim() || !instructions.trim()) return Alert.alert('Missing information', 'Select a course and complete the quiz details.');
    const invalid = questions.some((q) => !q.text.trim() || q.marks < 1 || (q.type !== 'SHORT_ANSWER' && !String(q.correctAnswer).trim()) || (q.type === 'MULTIPLE_CHOICE' && q.options?.some((o) => !o.trim())));
    if (invalid) return Alert.alert('Incomplete questions', 'Complete every question, option, correct answer, and mark.');
    try { setSaving(true); const input = { courseOfferingId: courseId, title: title.trim(), instructions: instructions.trim(), startAt: startAt.toISOString(), endAt: endAt.toISOString(), durationMinutes: Number(duration), maxAttempts: Number(maxAttempts), shuffleQuestions, shuffleAnswers, ...(attemptCount === 0 ? { questions: questions.map(({ key: _key, ...q }) => q) } : {}), publish };
      if (quizId) await quizService.update(quizId, input); else await quizService.create({ ...input, questions: questions.map(({ key: _key, ...q }) => q) });
      Alert.alert(isEditing ? 'Quiz updated' : publish ? 'Quiz published' : 'Draft saved', isEditing ? 'Your safe quiz changes have been saved.' : publish ? 'Students will see the quiz in Coursework.' : 'The quiz remains hidden from students.', [{ text: 'Done', onPress: () => router.replace((quizId ? `/(lecturer)/courses/quizzes/${quizId}` : '/(lecturer)/tasks') as any) }]);
    } catch (e) { Alert.alert('Could not save quiz', e instanceof Error ? e.message : 'Please try again.'); } finally { setSaving(false); }
  };

  const field = 'rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900';
  return <SafeAreaView className="flex-1 bg-[#051839]">
    <StatusBar style="light" backgroundColor="#051839" /><ScreenHeader title={isEditing ? 'Edit Quiz' : 'Create Quiz'} fallbackRoute={quizId ? `/(lecturer)/courses/quizzes/${quizId}` : '/(lecturer)/tasks'} />
    <ScrollView className="flex-1 bg-[#F5F7FA]" contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 12 }}>
      <View>
        <Text className="mb-2 text-xs font-extrabold text-slate-500">COURSE</Text>
        <Pressable
          onPress={() => { if (!isEditing) setCourseOpen((current) => !current); }}
          className="flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 py-3"
        >
          <View className="flex-1">
            <Text className={`text-sm font-bold ${selectedCourse ? 'text-slate-900' : 'text-slate-400'}`}>
              {selectedCourse ? `${selectedCourse.courseCode} · ${selectedCourse.courseName}` : 'Select a course'}
            </Text>
            {selectedCourse ? (
              <Text className="mt-1 text-xs text-slate-500">
                {selectedCourse.academicYear} · {selectedCourse.semester.replace('_', ' ')}{isEditing ? ' · Locked' : ''}
              </Text>
            ) : null}
          </View>
          <Ionicons name={isEditing ? 'lock-closed-outline' : courseOpen ? 'chevron-up' : 'chevron-down'} size={19} color="#64748B" />
        </Pressable>

        {courseOpen && !isEditing ? (
          <View className="mt-2 max-h-64 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <ScrollView nestedScrollEnabled>
              {courses.map((course) => (
                <Pressable
                  key={course.id}
                  onPress={() => { setCourseId(course.id); setCourseOpen(false); }}
                  className={`flex-row items-center border-b border-slate-100 px-4 py-3 ${courseId === course.id ? 'bg-blue-50' : 'bg-white'}`}
                >
                  <View className="flex-1">
                    <Text className={`text-sm font-bold ${courseId === course.id ? 'text-blue-700' : 'text-slate-800'}`}>
                      {course.courseCode} · {course.courseName}
                    </Text>
                    <Text className="mt-1 text-xs text-slate-500">
                      {course.academicYear} · {course.semester.replace('_', ' ')}
                    </Text>
                  </View>
                  {courseId === course.id ? <Ionicons name="checkmark" size={19} color="#2563EB" /> : null}
                </Pressable>
              ))}
              {courses.length === 0 ? (
                <Text className="px-4 py-5 text-center text-sm text-slate-500">No active course offerings assigned</Text>
              ) : null}
            </ScrollView>
          </View>
        ) : null}
      </View>
      <TextInput value={title} onChangeText={setTitle} placeholder="Quiz title" className={field} />
      <TextInput value={instructions} onChangeText={setInstructions} multiline textAlignVertical="top" placeholder="Instructions shown before starting" className={`${field} min-h-24`} />
      <Text className="text-xs font-extrabold text-slate-500">AVAILABILITY</Text>
      <View className="flex-row gap-2">{([['startDate','Opens date',startAt.toLocaleDateString()],['startTime','Time',startAt.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})],['endDate','Closes date',endAt.toLocaleDateString()],['endTime','Time',endAt.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})]] as const).map(([key,label,value]) => <Pressable key={key} onPress={() => setPicker(key)} className="flex-1 rounded-xl border border-slate-200 bg-white p-2"><Text className="text-[10px] text-slate-400">{label}</Text><Text className="mt-1 text-xs font-bold text-slate-700">{value}</Text></Pressable>)}</View>
      {picker ? <View className="rounded-xl bg-white p-2"><DateTimePicker value={picker.startsWith('start') ? startAt : endAt} mode={picker.endsWith('Date') ? 'date' : 'time'} onChange={(_e,d) => changeDate(d)} />{Platform.OS === 'ios' ? <Pressable onPress={() => setPicker(null)}><Text className="text-right font-bold text-blue-600">Done</Text></Pressable> : null}</View> : null}
      <View className="flex-row gap-2"><TextInput value={duration} onChangeText={setDuration} keyboardType="number-pad" placeholder="Duration minutes" className={`${field} flex-1`} /><TextInput value={maxAttempts} onChangeText={setMaxAttempts} keyboardType="number-pad" placeholder="Attempts" className={`${field} flex-1`} /></View>
      <View className="rounded-xl bg-white px-4">{[["Shuffle questions",shuffleQuestions,setShuffleQuestions],["Shuffle answers",shuffleAnswers,setShuffleAnswers]].map(([label,value,setter]: any) => <View key={label} className="flex-row items-center justify-between border-b border-slate-100 py-3"><Text className="font-semibold text-slate-700">{label}</Text><Switch value={value} onValueChange={setter} /></View>)}</View>
      <View className="mt-2 flex-row items-center justify-between"><Text className="text-base font-extrabold text-slate-900">Questions ({questions.length})</Text><Text className="font-bold text-blue-700">{questions.reduce((s,q) => s + Number(q.marks || 0), 0)} marks</Text></View>
      {questions.map((q,index) => <View key={q.key} className="rounded-2xl border border-slate-200 bg-white p-4">
        <View className="flex-row items-center justify-between"><Text className="font-extrabold text-slate-800">Question {index+1}</Text>{attemptCount===0?<Pressable onPress={() => setQuestions((x) => x.filter((y) => y.key !== q.key))}><Text className="font-bold text-red-600">Remove</Text></Pressable>:<Text className="text-xs font-bold text-slate-400">Locked</Text>}</View>
        <View className="my-3 flex-row gap-2">{(['MULTIPLE_CHOICE','TRUE_FALSE','SHORT_ANSWER'] as const).map((type) => <Pressable disabled={attemptCount>0} key={type} onPress={() => updateQuestion(q.key,{type,options:type==='MULTIPLE_CHOICE'?['','','','']:type==='TRUE_FALSE'?['True','False']:undefined,correctAnswer:type==='TRUE_FALSE'?'True':''})} className={`flex-1 rounded-lg p-2 ${q.type===type?'bg-blue-600':'bg-slate-100'}`}><Text className={`text-center text-[10px] font-bold ${q.type===type?'text-white':'text-slate-600'}`}>{type==='MULTIPLE_CHOICE'?'Choice':type==='TRUE_FALSE'?'True/False':'Short'}</Text></Pressable>)}</View>
        <TextInput editable={attemptCount===0} value={q.text} onChangeText={(text) => updateQuestion(q.key,{text})} placeholder="Question text" multiline className={field} />
        {q.type === 'MULTIPLE_CHOICE' ? q.options?.map((option,i) => <View key={i} className="mt-2 flex-row items-center"><Pressable onPress={() => updateQuestion(q.key,{correctAnswer:option})} className={`mr-2 h-6 w-6 rounded-full border ${q.correctAnswer===option&&option?'border-blue-600 bg-blue-600':'border-slate-300'}`} /><TextInput value={option} onChangeText={(text) => { const options=[...(q.options??[])]; const old=options[i]; options[i]=text; updateQuestion(q.key,{options,...(q.correctAnswer===old?{correctAnswer:text}:{})}); }} placeholder={`Option ${i+1}`} className={`${field} flex-1`} /></View>) : null}
        {q.type === 'TRUE_FALSE' ? <View className="mt-3 flex-row gap-2">{['True','False'].map((v) => <Pressable key={v} onPress={() => updateQuestion(q.key,{correctAnswer:v})} className={`flex-1 rounded-xl py-3 ${q.correctAnswer===v?'bg-blue-600':'bg-slate-100'}`}><Text className={`text-center font-bold ${q.correctAnswer===v?'text-white':'text-slate-600'}`}>{v}</Text></Pressable>)}</View> : null}
        <TextInput editable={attemptCount===0} value={String(q.marks)} onChangeText={(v) => updateQuestion(q.key,{marks:Number(v)})} keyboardType="number-pad" placeholder="Marks" className={`${field} mt-3`} />
      </View>)}
      {attemptCount===0?<Pressable onPress={() => setQuestions((x) => [...x,newQuestion()])} className="items-center rounded-xl border border-dashed border-blue-300 bg-blue-50 py-3"><Text className="font-bold text-blue-700">+ Add Question</Text></Pressable>:<Text className="text-center text-xs font-semibold text-slate-500">Questions are locked because students have started this quiz. Timing and instructions remain editable.</Text>}
      {isEditing?<Pressable disabled={saving} onPress={() => void save(false)} className="items-center rounded-full bg-blue-600 py-3"><Text className="font-bold text-white">{saving?'Saving...':'Save Changes'}</Text></Pressable>:<View className="flex-row gap-3"><Pressable disabled={saving} onPress={() => void save(false)} className="flex-1 items-center rounded-full border border-blue-600 py-3"><Text className="font-bold text-blue-700">Save Draft</Text></Pressable><Pressable disabled={saving} onPress={() => void save(true)} className="flex-1 items-center rounded-full bg-blue-600 py-3"><Text className="font-bold text-white">{saving?'Saving...':'Publish'}</Text></Pressable></View>}
    </ScrollView>
  </SafeAreaView>;
}
