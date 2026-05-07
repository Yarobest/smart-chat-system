import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from '@/src/components/common/StatusBar';

export default function TakeQuizScreen() {
  const [timeLeft, setTimeLeft] = useState(38 * 60 + 14); // 38:14
  const [currentQuestion, setCurrentQuestion] = useState(4);
  const [selectedAnswer, setSelectedAnswer] = useState(1);
  const questionsAnswered = 4;
  const totalQuestions = 15;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleExit = () => {
    router.back();
  };

  const answers = [
    { id: 0, text: '0 — both subtrees must be equal height' },
    { id: 1, text: '1 — heights may differ by at most 1' },
    { id: 2, text: '2 — heights may differ by at most 2' },
    { id: 3, text: 'No restriction on height difference' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#051839" />
      
      {/* Header with Timer */}
      <View className="border-b border-slate-200 bg-[#051839] px-4 py-3 flex-row items-center justify-between">
        <Text className="text-base font-semibold text-white">CS301 Mid-Semester Quiz</Text>
        <View className="flex-row items-center bg-slate-800 rounded-lg px-3 py-1">
          <Ionicons name="time" size={16} color="#F59E0B" />
          <Text className="ml-2 text-sm font-bold text-[#F59E0B]">
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        {/* Progress Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs font-semibold text-slate-600">Progress</Text>
            <Text className="text-xs font-semibold text-slate-600">{questionsAnswered}/{totalQuestions} answered</Text>
          </View>
          <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <View 
              className="h-full bg-[#2563EB]"
              style={{ width: `${(questionsAnswered / totalQuestions) * 100}%` }}
            />
          </View>
        </View>

        {/* Question Header */}
        <View className="mb-4">
          <Text className="text-xs font-bold text-slate-500 tracking-wide">QUESTION {currentQuestion} OF {totalQuestions} · MULTIPLE CHOICE</Text>
          <Text className="mt-3 text-xl font-bold text-slate-900">
            In an AVL tree, what is the maximum allowed height difference between the left and right subtrees of any node?
          </Text>
        </View>

        {/* Answer Options */}
        <View className="mb-6">
          {answers.map((answer) => (
            <Pressable
              key={answer.id}
              onPress={() => setSelectedAnswer(answer.id)}
              className="mb-3 flex-row items-center rounded-lg border-2 bg-white"
              style={{
                borderColor: selectedAnswer === answer.id ? '#2563EB' : '#E5E7EB',
                backgroundColor: selectedAnswer === answer.id ? '#F0F4FF' : 'white',
              }}
            >
              <View 
                className="ml-4 h-5 w-5 rounded-full border-2 items-center justify-center"
                style={{
                  borderColor: selectedAnswer === answer.id ? '#2563EB' : '#D1D5DB',
                  backgroundColor: selectedAnswer === answer.id ? '#2563EB' : 'transparent',
                }}
              >
                {selectedAnswer === answer.id && (
                  <View className="h-2 w-2 bg-white rounded-full" />
                )}
              </View>
              <Text 
                className="flex-1 py-4 pl-4 text-base font-medium"
                style={{
                  color: selectedAnswer === answer.id ? '#1F2937' : '#6B7280',
                }}
              >
                {answer.id} — {answer.text.split(' — ')[1]}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tip Box */}
        <View className="mb-6 rounded-lg bg-[#DBEAFE] px-4 py-3 flex-row">
          <Ionicons name="bulb" size={20} color="#0284C7" />
          <Text className="flex-1 ml-3 text-xs text-[#0C4A6E] font-medium">
            Tip: You can go back and change answers before submitting. Tap Submit only when you have finished all questions.
          </Text>
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row gap-3">
          <Pressable 
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3"
            onPress={() => currentQuestion > 1 && setCurrentQuestion(currentQuestion - 1)}
          >
            <Text className="text-center text-slate-700 font-bold">← Previous</Text>
          </Pressable>
          <Pressable 
            className="flex-1 rounded-lg bg-[#2563EB] px-4 py-3"
            onPress={() => {
              if (currentQuestion < totalQuestions - 1) {
                setCurrentQuestion(currentQuestion + 1);
              } else if (currentQuestion === totalQuestions - 1) {
                router.push('/(student)/tasks/quizzes/cs301-mid-sem/take/final' as any);
              }
            }}
          >
            <Text className="text-center text-white font-bold">Next →</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
