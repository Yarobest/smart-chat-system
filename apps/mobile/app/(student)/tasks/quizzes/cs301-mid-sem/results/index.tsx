import React, { useState } from 'react';
import { SafeAreaView, Text, View, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from '@/src/components/common/StatusBar';
import { getReturnPath, clearReturnPath } from '@/src/stores/navigationStore';

export default function QuizResultsScreen() {
  // Mock data - replace with actual data from store/route params
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const navigation = useNavigation();

  const quizResult = {
    title: 'CS301 - Mid-Semester Quiz',
    courseCode: 'CS301',
    score: 12,
    totalQuestions: 15,
    correctAnswers: 12,
    wrongAnswers: 2,
    skippedAnswers: 1,
    percentage: 87,
    timeTaken: '29:18',
    studentName: 'Stephen Appiah',
    userRank: 1,
  };

  const questions = [
    {
      id: 1,
      text: 'Array Indexing',
      userAnswer: 'O(1)',
      correctAnswer: 'O(1)',
      isCorrect: true,
    },
    {
      id: 2,
      text: 'Linked List',
      userAnswer: 'O(n)',
      correctAnswer: 'O(n)',
      isCorrect: true,
    },
    {
      id: 4,
      text: 'AVL Height Diff',
      userAnswer: '1',
      correctAnswer: '1',
      isCorrect: true,
    },
    {
      id: 7,
      text: 'Heap Type',
      userAnswer: 'Min-Heap',
      correctAnswer: 'Max-Heap',
      isCorrect: false,
    },
    {
      id: 11,
      text: 'BFS/DFS',
      userAnswer: 'BFS uses stack',
      correctAnswer: 'BFS uses queue',
      isCorrect: false,
    },
  ];

  const leaderboard = [
    {
      rank: 1,
      name: 'Stephen Appiah',
      score: 87,
      initials: 'SA',
      color: '#3B82F6',
    },
    {
      rank: 2,
      name: 'Rudolf Favor',
      score: 80,
      initials: 'RG',
      color: '#10B981',
    },
    {
      rank: 3,
      name: 'Abena Asante',
      score: 73,
      initials: 'AA',
      color: '#F59E0B',
    },
  ];

  const getScoreGradeColor = () => {
    if (quizResult.percentage >= 80) return '#10B981';
    if (quizResult.percentage >= 70) return '#3B82F6';
    if (quizResult.percentage >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const handleBackToLMS = () => {
    // Check if we have a return path in the navigation store
    const returnPath = getReturnPath();
    
    if (returnPath) {
      // Navigate back to the specified return path (e.g., group chat)
      clearReturnPath();
      router.navigate(returnPath as any);
    } else if (navigation.canGoBack()) {
      // Try to go back using navigation stack
      router.back();
    } else {
      // Fallback to home if nothing else works
      router.navigate("/(student)/home" as any);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F5F8]">
      <StatusBar style="light" backgroundColor="#051839" />

      {/* Static Dark Background Section */}
      <View className="bg-[#051839] px-4 py-6">
        {/* Header */}
        <Text className="text-sm font-semibold text-slate-300 mb-6 text-center">{quizResult.title}</Text>

        {/* Score Circle and Main Stats */}
        <View className="items-center">
          {/* Score Circle */}
          <View className="relative items-center justify-center mb-6">
            <View
              className="rounded-full bg-white border-8"
              style={{ 
                width: 140, 
                height: 140, 
                borderColor: getScoreGradeColor(),
              }}
            >
              <View className="flex-1 items-center justify-center">
                <Text className="text-4xl font-bold" style={{ color: getScoreGradeColor() }}>
                  {quizResult.percentage}%
                </Text>
                <Text className="text-xs text-slate-500 mt-1">Your Score</Text>
              </View>
            </View>
          </View>

          {/* Congratulation Message */}
          <Text className="text-2xl font-bold text-white mb-1">
            Great work, {quizResult.studentName}! ⭐
          </Text>
          <Text className="text-sm text-slate-300 mb-6">
            {quizResult.correctAnswers} correct · {quizResult.wrongAnswers} wrong · {quizResult.skippedAnswers} skipped
          </Text>

          {/* Stats Grid */}
          <View className="w-full rounded-2xl p-6 flex-row justify-around items-center">
            <View className="items-center">
              <Text className="text-3xl font-bold text-[#10B981]">
                {quizResult.correctAnswers}
              </Text>
              <Text className="text-xs text-slate-400 mt-1">Correct</Text>
            </View>
            <View className="h-12 w-0.5 bg-slate-600" />
            <View className="items-center">
              <Text className="text-3xl font-bold text-[#EF4444]">
                {quizResult.wrongAnswers}
              </Text>
              <Text className="text-xs text-slate-400 mt-1">Wrong</Text>
            </View>
            <View className="h-12 w-0.5 bg-slate-600" />
            <View className="items-center">
              <Text className="text-3xl font-bold text-slate-400">
                {quizResult.skippedAnswers}
              </Text>
              <Text className="text-xs text-slate-400 mt-1">Skipped</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Scrollable Content Section */}
      <ScrollView className="flex-1 bg-[#F4F5F8]" contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}>

        {/* Answer Review Section */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-slate-900 mb-4">Answer Review</Text>

          <View className="bg-white rounded-2xl overflow-hidden">
            {questions.map((question, index) => (
              <View key={question.id}>
                <Pressable
                  className="px-4 py-4 flex-row items-center justify-between"
                  onPress={() =>
                    setExpandedQuestion(
                      expandedQuestion === question.id ? null : question.id
                    )
                  }
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      className={`w-6 h-6 rounded-full items-center justify-center mr-3 ${
                        question.isCorrect ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                      }`}
                    >
                      <Ionicons
                        name={question.isCorrect ? 'checkmark' : 'close'}
                        size={16}
                        color="white"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-slate-900">
                        Q{question.id} — {question.text}
                      </Text>
                    </View>
                  </View>

                  <Ionicons
                    name={
                      expandedQuestion === question.id
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    size={20}
                    color="#9CA3AF"
                  />
                </Pressable>

                {expandedQuestion === question.id && (
                  <View className="px-4 pb-4 border-t border-slate-100">
                    <View className="mt-3">
                      <Text className="text-xs text-slate-500 mb-1">Your answer:</Text>
                      <Text className="text-sm text-slate-700 font-medium">
                        {question.userAnswer}
                      </Text>
                    </View>
                    {!question.isCorrect && (
                      <View className="mt-3">
                        <Text className="text-xs text-slate-500 mb-1">Correct answer:</Text>
                        <Text className="text-sm text-[#10B981] font-medium">
                          {question.correctAnswer}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {index < questions.length - 1 && (
                  <View className="h-0.5 bg-slate-100" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Class Leaderboard Section */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-slate-900 mb-4">Class Leaderboard</Text>

          <View className="bg-white rounded-2xl overflow-hidden p-4">
            {leaderboard.map((entry) => (
              <View
                key={entry.rank}
                className="flex-row items-center justify-between py-3"
              >
                <View className="flex-row items-center flex-1">
                  <Ionicons
                    name={
                      entry.rank === 1
                        ? 'ribbon'
                        : entry.rank === 2
                        ? 'medal'
                        : 'star'
                    }
                    size={20}
                    color={entry.color}
                  />

                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mx-3"
                    style={{ backgroundColor: entry.color }}
                  >
                    <Text className="text-xs font-bold text-white">
                      {entry.initials}
                    </Text>
                  </View>

                  <View>
                    <Text className="font-semibold text-slate-900">
                      {entry.name}
                    </Text>
                  </View>
                </View>

                <Text className="text-sm font-bold text-slate-900">
                  {entry.score}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Back to LMS Button */}
        <Pressable
          className="w-full bg-[#2563EB] rounded-lg px-4 py-4 mb-8 flex-row items-center justify-center"
          onPress={handleBackToLMS}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text className="ml-2 text-center text-base font-bold text-white">
            Back to Quiz
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
