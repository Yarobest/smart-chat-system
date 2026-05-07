import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from '@/src/components/common/StatusBar';

export default function SubmitReviewScreen() {
  const [timeLeft, setTimeLeft] = useState(8 * 60 + 47); // 08:47

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

  const handleSubmit = () => {
    router.push('/(student)/tasks/quizzes/cs301-mid-sem/results' as any);
  };

  const handleGoBackToQ15 = () => {
    router.back();
  };

  const questionStatus = [
    { num: 1, status: 'answered' },
    { num: 2, status: 'answered' },
    { num: 3, status: 'answered' },
    { num: 4, status: 'answered' },
    { num: 5, status: 'answered' },
    { num: 6, status: 'flagged' },
    { num: 7, status: 'flagged' },
    { num: 8, status: 'answered' },
    { num: 9, status: 'answered' },
    { num: 10, status: 'answered' },
    { num: 11, status: 'answered' },
    { num: 12, status: 'answered' },
    { num: 13, status: 'answered' },
    { num: 14, status: 'answered' },
    { num: 15, status: 'skipped' },
  ];

  const getButtonColor = (status: string) => {
    switch(status) {
      case 'answered': return '#10B981';
      case 'flagged': return '#F59E0B';
      case 'skipped': return '#E5E7EB';
      default: return '#E5E7EB';
    }
  };

  const getButtonTextColor = (status: string) => {
    if (status === 'skipped') return '#6B7280';
    return 'white';
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#051839" />
      
      {/* Header with Timer */}
      <View className="border-b border-slate-200 bg-[#051839] px-4 py-3 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-semibold text-white">CS301 Mid-Semester Quiz</Text>
          <Text className="text-xs text-slate-400">Review before submitting</Text>
        </View>
        <View className="flex-row items-center bg-slate-800 rounded-lg px-3 py-1">
          <Ionicons name="time" size={16} color="#F59E0B" />
          <Text className="ml-2 text-sm font-bold text-[#F59E0B]">
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}>
        {/* Question Status Section */}
        <View className="mb-6">
          <Text className="text-base font-bold text-slate-900 mb-3">Question Status</Text>
          
          {/* Question Buttons Grid */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {questionStatus.map((q) => (
              <Pressable
                key={q.num}
                className="h-10 w-10 rounded-lg items-center justify-center"
                style={{
                  backgroundColor: getButtonColor(q.status),
                }}
              >
                <Text 
                  className="font-bold"
                  style={{
                    color: getButtonTextColor(q.status),
                  }}
                >
                  {q.num}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Legend */}
          <View className="flex-row gap-6 pt-3 border-t border-slate-200">
            <View className="flex-row items-center gap-2">
              <View className="h-3 w-3 rounded-full bg-[#10B981]" />
              <Text className="text-xs text-slate-600">Answered (12)</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="h-3 w-3 rounded-full bg-[#F59E0B]" />
              <Text className="text-xs text-slate-600">Flagged (2)</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="h-3 w-3 rounded-full bg-[#E5E7EB]" />
              <Text className="text-xs text-slate-600">Skipped (1)</Text>
            </View>
          </View>
        </View>

        {/* Warning Box */}
        <View className="mb-6 rounded-lg bg-[#FCE4E6] px-4 py-4 border border-[#FBCFE8]">
          <View className="flex-row items-start gap-3">
            <Ionicons name="warning" size={20} color="#E91E63" />
            <View className="flex-1">
              <Text className="text-sm font-bold text-[#C2185B] mb-1">1 question unanswered</Text>
              <Text className="text-xs text-[#880E4F] mb-3">
                Q15 is still blank. You can go back and answer it, or submit now and it will be marked wrong.
              </Text>
              <Pressable onPress={handleGoBackToQ15}>
                <Text className="text-xs font-bold text-[#0284C7]">Go back to Q15</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit}
          className="mb-4 rounded-lg bg-[#10B981] px-4 py-4 flex-row items-center justify-center"
        >
          <Ionicons name="checkmark" size={20} color="white" />
          <Text className="ml-2 text-center text-base font-bold text-white">Submit Quiz — Get My Score</Text>
        </Pressable>

        {/* Footer Text */}
        <Text className="text-center text-xs text-slate-400">
          Once submitted your answers are final and cannot be changed.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
