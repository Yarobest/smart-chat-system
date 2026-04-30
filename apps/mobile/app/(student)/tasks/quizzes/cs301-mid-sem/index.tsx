import React from 'react';
import { SafeAreaView, Text, View, Pressable, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from '@/src/components/common/StatusBar';
import { getReturnPath, clearReturnPath } from '@/src/stores/navigationStore';

export default function CS301MidSemQuizScreen() {
  const navigation = useNavigation();

  const handleBack = () => {
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

  const handleStartQuiz = () => {
    // Navigate to actual quiz taking screen
    router.push('/(student)/tasks/quizzes/cs301-mid-sem/take' as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F5F8]">
      <StatusBar style="light" backgroundColor="#051839" />
      
      <View className="border-b border-slate-700 bg-[#051839] px-4 py-3 flex-row items-center">
        <Pressable onPress={handleBack} className="mr-3">
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-lg font-bold text-white">CS301 Mid-Semester Quiz</Text>
          <Text className="text-sm text-slate-400">Data Structures</Text>
        </View>
      </View>

      <ScrollView className="flex-1 bg-[#F4F5F8]" contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}>
        {/* Quiz Details Card */}
        <View className="mb-6 rounded-3xl bg-[#1E3A5F] p-6">
          <View className="mb-4 flex-row items-center">
            <View className="h-12 w-12 items-center justify-center rounded-lg bg-[#7C8BA1]">
              <Ionicons name="document" size={24} color="white" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-xl font-bold text-white">Mid-Semester Quiz</Text>
              <Text className="text-sm text-slate-300">CS301 · Data Structures · Mr. Agordzo</Text>
            </View>
          </View>

          <View className="mb-4 flex-row justify-between">
            <View>
              <Text className="text-sm text-slate-400">Questions</Text>
              <Text className="text-3xl font-bold text-white">15</Text>
            </View>
            <View>
              <Text className="text-sm text-slate-400">Your Time Limit</Text>
              <Text className="text-3xl font-bold text-[#F59E0B]">45 min</Text>
            </View>
          </View>

          <View className="flex-row justify-between border-t border-slate-600 pt-4">
            <View>
              <Text className="text-sm text-slate-400">Closes At</Text>
              <Text className="text-lg font-bold text-white">5:00 PM</Text>
              <Text className="text-xs text-slate-400">today</Text>
            </View>
            <View>
              <Text className="text-sm text-slate-400">Attempts</Text>
              <Text className="text-lg font-bold text-white">1 only</Text>
            </View>
          </View>
        </View>

        {/* Room Code Section */}
        <Text className="mb-2 text-sm font-semibold text-slate-700">Room Code (from your lecturer)</Text>
        <View className="mb-6 rounded-xl border-2 border-[#2563EB] px-4 py-4 bg-white">
          <Text className="text-center text-2xl font-bold tracking-widest text-slate-900">C S 3 0 1</Text>
        </View>

        {/* Student ID Section */}
        <Text className="mb-2 text-sm font-semibold text-slate-700">Confirm Your Student ID</Text>
        <View className="mb-6 rounded-xl border-2 border-[#2563EB] px-4 py-3 bg-white">
          <Text className="text-center text-base font-semibold text-slate-700">0323080542 – Stephen Appiah</Text>
        </View>

        {/* Warning Section */}
        <View className="mb-6 rounded-xl bg-[#FCE4E6] px-4 py-4">
          <View className="mb-3 flex-row items-center">
            <Ionicons name="warning" size={20} color="#E91E63" />
            <Text className="ml-2 text-base font-bold text-[#E91E63]">Before You Begin — Read This</Text>
          </View>
          <View className="space-y-2">
            <Text className="mb-2 text-sm text-slate-700">
              • Your 45-minute timer starts the moment you tap Start
            </Text>
            <Text className="mb-2 text-sm text-slate-700">
              • You have <Text className="font-bold">1 attempt only</Text> — you cannot restart
            </Text>
            <Text className="mb-2 text-sm text-slate-700">
              • Answer all questions before tapping Submit
            </Text>
            <Text className="mb-2 text-sm text-slate-700">
              • Answers are compared to the answer key after submission
            </Text>
            <Text className="text-sm text-slate-700">
              • Your score is shown immediately after you submit
            </Text>
          </View>
        </View>

        {/* Start Quiz Button */}
        <Pressable
          onPress={handleStartQuiz}
          className="mb-6 rounded-xl bg-[#2563EB] px-4 py-4"
        >
          <Text className="text-center text-base font-bold text-white">Start Quiz — Timer Begins Now</Text>
        </Pressable>

        <Text className="text-center text-xs text-slate-500">
          By starting you confirm you are Stephen Appiah (ID: 0323080542)
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
