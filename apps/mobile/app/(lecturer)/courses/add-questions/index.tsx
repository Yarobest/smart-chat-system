import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';

const QUESTION_TYPES = ['Multiple Choice', 'True / False', 'Short Answer'] as const;

interface Question {
  id: number;
  type: typeof QUESTION_TYPES[number];
  text: string;
  answers: string[];
  correctIndex: number;
  points: number;
  isEditing: boolean;
}

export default function AddQuestionsScreen() {
  const router = useRouter();
  const [activeType, setActiveType] = useState<typeof QUESTION_TYPES[number]>('Multiple Choice');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      type: 'Multiple Choice',
      text: 'What is the time complexity of searching in a balanced AVL tree?',
      answers: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'],
      correctIndex: 0,
      points: 1,
      isEditing: false,
    },
    {
      id: 2,
      type: 'Multiple Choice',
      text: 'In a min-heap, the parent node is always _____ than its children.',
      answers: ['Greater', 'Less than', 'Equal to', 'Smaller or equal'],
      correctIndex: 1,
      points: 1,
      isEditing: true,
    },
  ]);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: questions.length + 1,
      type: activeType,
      text: '',
      answers: ['', '', '', ''],
      correctIndex: 0,
      points: 1,
      isEditing: true,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handlePublish = () => {
    router.push('/(lecturer)/courses/set-quiz');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="bg-[#051839] px-4 pb-4 pt-4">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-3">
          <Text className="text-2xl text-white">‹</Text>
          <View>
            <Text className="text-2xl font-extrabold text-white">Add Questions</Text>
            <Text className="text-sm text-slate-300">CS301 Quiz · {questions.length} total</Text>
          </View>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 bg-[#F5F7FA]"
        contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Type Tabs */}
        <View className="flex-row gap-2">
          {QUESTION_TYPES.map((type) => (
            <Pressable
              key={type}
              onPress={() => setActiveType(type)}
              className={`rounded-full px-4 py-2 ${
                activeType === type ? 'bg-blue-600' : 'bg-slate-100'
              }`}
            >
              <Text className={`text-sm font-semibold ${activeType === type ? 'text-white' : 'text-slate-600'}`}>
                {type}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Progress Slider */}
        <View className="h-1 rounded-full bg-slate-200 overflow-hidden">
          <View
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${(questions.filter(q => !q.isEditing).length / questions.length) * 100}%` }}
          />
        </View>

        {/* Questions */}
        {questions.map((question) => (
          <View
            key={question.id}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 overflow-hidden"
            style={{
              shadowColor: '#000',
              shadowOpacity: 0.06,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 3,
              borderLeftWidth: 8,
              borderLeftColor: question.isEditing ? '#F59E0B' : '#3B82F6',
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs uppercase tracking-[0.18rem] font-semibold" style={{ color: question.isEditing ? '#F59E0B' : '#3B82F6' }}>
                Q{question.id} of {questions.length} · {question.isEditing ? 'CURRENTLY EDITING' : question.type.toUpperCase()}
              </Text>
            </View>

            <Text className="text-base font-semibold text-slate-900 mb-3">{question.text}</Text>

            <View className="space-y-2 mb-4">
              {question.answers.map((answer, index) => (
                <View
                  key={answer}
                  className={`rounded-2xl border px-4 py-3 flex-row items-center ${
                    index === question.correctIndex
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                      index === question.correctIndex
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-slate-300'
                    }`}
                  >
                    {index === question.correctIndex && (
                      <View className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </View>
                  <Text className={`flex-1 text-sm font-semibold ${index === question.correctIndex ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {answer}
                  </Text>
                  {index === question.correctIndex && (
                    <Text className="text-xs font-semibold text-emerald-600 ml-2">Correct Answer</Text>
                  )}
                </View>
              ))}
            </View>

            <View className="flex-row items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Text className="text-sm font-semibold text-slate-700">Points: {question.points}</Text>
              <View className="flex-row items-center gap-2">
                <Pressable className="rounded-full border border-slate-200 bg-white px-3 py-2">
                  <Text className="text-sm text-slate-700">✏️ Edit</Text>
                </Pressable>
                <Pressable className="rounded-full border border-red-200 bg-red-50 px-3 py-2">
                  <Text className="text-sm text-red-600">🗑️ Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        {/* Add Next Question Button */}
        <Pressable
          onPress={handleAddQuestion}
          className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-4 items-center"
        >
          <Text className="text-base font-semibold text-slate-600">+ Add Next Question</Text>
        </Pressable>

        {/* Publish Assessment Button */}
        <Pressable
          onPress={handlePublish}
          className="rounded-2xl bg-orange-500 px-4 py-4 items-center"
        >
          <Text className="text-base font-semibold text-white">🎓 Publish Assessment → Notify Students</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

