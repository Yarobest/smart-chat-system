import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Pressable, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from '@/src/components/common/StatusBar';
import { getReturnPath, clearReturnPath } from '@/src/stores/navigationStore';

export default function TakeQuizScreen() {
  const [timeLeft, setTimeLeft] = useState(38 * 60 + 14); // 38:14
  const [currentQuestion, setCurrentQuestion] = useState(4);
  const [selectedAnswer, setSelectedAnswer] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress] = useState(new Animated.Value(0));
  const questionsAnswered = 4;
  const totalQuestions = 15;
  const navigation = useNavigation();

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

  // Animate loading progress
  useEffect(() => {
    if (isLoading) {
      Animated.sequence([
        Animated.timing(loadingProgress, {
          toValue: 0.7,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(loadingProgress, {
          toValue: 0.9,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(loadingProgress, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isLoading, loadingProgress]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleExit = () => {
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

  const handleNext = async () => {
    setIsLoading(true);
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      loadingProgress.setValue(0);
    } else if (currentQuestion === totalQuestions) {
      loadingProgress.setValue(0);
      router.push('/(student)/tasks/quizzes/cs301-mid-sem/take/final' as any);
    }
    setIsLoading(false);
  };

  const answers = [
    { id: 0, text: '0 — both subtrees must be equal height' },
    { id: 1, text: '1 — heights may differ by at most 1' },
    { id: 2, text: '2 — heights may differ by at most 2' },
    { id: 3, text: 'No restriction on height difference' },
  ];

  const progressWidth = loadingProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Calculate quiz progress based on current question
  const quizProgressPercent = (currentQuestion / totalQuestions) * 100;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#051839" />
      
      {/* Quiz Progress Bar */}
      <View className="h-1.5 bg-slate-200 overflow-hidden">
        <Animated.View 
          className="h-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]"
          style={{ width: `${quizProgressPercent}%` }}
        />
      </View>
      
      {/* Header with Timer */}
      <View className="border-b border-slate-200 bg-[#051839] px-4 py-3 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-sm font-semibold text-slate-300">CS301 Mid-Semester Quiz</Text>
          <Text className="text-xs font-semibold text-slate-400 mt-0.5">Question {currentQuestion} of {totalQuestions}</Text>
        </View>
        <View className="flex-row items-center bg-slate-700 rounded-lg px-3 py-1.5">
          <Ionicons name="time" size={16} color="#F59E0B" />
          <Text className={`ml-2 text-sm font-bold ${timeLeft < 300 ? 'text-red-400' : 'text-[#F59E0B]'}`}>
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      <ScrollView 
        className="flex-1 bg-white" 
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}
        scrollEnabled={!isLoading}
      >
        {/* Progress Section */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-600">Progress</Text>
            <Text className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
              {currentQuestion}/{totalQuestions}
            </Text>
          </View>
          <View className="h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-sm">
            <View 
              className="h-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]"
              style={{ width: `${quizProgressPercent}%` }}
            />
          </View>
        </View>

        {/* Question Header */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-[#2563EB] tracking-widest mb-2">
            QUESTION {currentQuestion} OF {totalQuestions} • MULTIPLE CHOICE
          </Text>
          <Text className="text-lg font-extrabold text-slate-900 leading-7">
            In an AVL tree, what is the maximum allowed height difference between the left and right subtrees of any node?
          </Text>
        </View>

        {/* Answer Options */}
        <View className="mb-7">
          {answers.map((answer) => (
            <Pressable
              key={answer.id}
              onPress={() => !isLoading && setSelectedAnswer(answer.id)}
              disabled={isLoading}
              className="mb-3 flex-row items-center rounded-xl border-2 bg-white p-4 active:scale-95"
              style={{
                borderColor: selectedAnswer === answer.id ? '#2563EB' : '#E5E7EB',
                backgroundColor: selectedAnswer === answer.id ? '#F0F4FF' : 'white',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              <View 
                className="h-6 w-6 rounded-full border-2 items-center justify-center"
                style={{
                  borderColor: selectedAnswer === answer.id ? '#2563EB' : '#D1D5DB',
                  backgroundColor: selectedAnswer === answer.id ? '#2563EB' : 'transparent',
                }}
              >
                {selectedAnswer === answer.id && (
                  <View className="h-2.5 w-2.5 bg-white rounded-full" />
                )}
              </View>
              <Text 
                className="flex-1 pl-4 text-base font-medium leading-6"
                style={{
                  color: selectedAnswer === answer.id ? '#1F2937' : '#6B7280',
                }}
              >
                {answer.id} {answer.text}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tip Box */}
        <View className="mb-8 rounded-lg bg-[#DBEAFE] px-4 py-3 flex-row border border-[#93C5FD]">
          <Ionicons name="bulb" size={18} color="#0284C7" />
          <Text className="flex-1 ml-3 text-xs text-[#0C4A6E] font-medium leading-4">
            You can go back and change answers before submitting. Tap Submit only when finished.
          </Text>
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row gap-3">
          <Pressable 
            disabled={isLoading || currentQuestion === 1}
            className={`flex-row flex-1 items-center justify-center rounded-lg border-2 px-4 py-3.5 ${
              isLoading || currentQuestion === 1 
                ? 'border-slate-200 bg-slate-50' 
                : 'border-slate-300 bg-white active:bg-slate-50'
            }`}
            onPress={() => currentQuestion > 1 && setCurrentQuestion(currentQuestion - 1)}
          >
            <Ionicons 
              name="chevron-back" 
              size={18} 
              color={isLoading || currentQuestion === 1 ? '#D1D5DB' : '#374151'} 
            />
            <Text 
              className={`ml-1 text-sm font-bold ${
                isLoading || currentQuestion === 1 ? 'text-slate-400' : 'text-slate-700'
              }`}
            >
              Previous
            </Text>
          </Pressable>

          <Pressable 
            disabled={isLoading}
            className={`flex-row flex-1 items-center justify-center rounded-lg px-4 py-3.5 ${
              isLoading 
                ? 'bg-[#1D4ED8] opacity-80' 
                : 'bg-[#2563EB] active:bg-[#1D4ED8]'
            }`}
            onPress={handleNext}
          >
            {isLoading ? (
              <>
                <ActivityIndicator size="small" color="white" />
                <Text className="ml-2 text-sm font-bold text-white">Loading...</Text>
              </>
            ) : (
              <>
                <Text className="text-sm font-bold text-white">
                  {currentQuestion === totalQuestions ? 'Submit' : 'Next'}
                </Text>
                <Ionicons 
                  name={currentQuestion === totalQuestions - 1 ? 'checkmark' : 'chevron-forward'} 
                  size={18} 
                  color="white" 
                  style={{ marginLeft: 6 }}
                />
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
