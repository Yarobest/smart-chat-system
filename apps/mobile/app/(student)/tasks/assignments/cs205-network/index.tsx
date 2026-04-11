import React from 'react';
import { SafeAreaView, Text, View, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from '@/src/components/common/StatusBar';

export default function CS205NetworkAssignmentScreen() {
  const handleBack = () => {
    router.back();
  };

  const otherAssignments = [
    {
      id: 1,
      title: 'CS301 Tree Traversal',
      course: 'CS301 · Data Structures',
      dueDate: 'Due: Wed Jan 10, 11:59 PM',
      accent: '#F59E0B',
    },
    {
      id: 2,
      title: 'CS401 Database Design',
      course: 'CS401 · Databases',
      dueDate: 'Due: Mon Jan 15, 5:00 PM',
      accent: '#10B981',
    },
    {
      id: 3,
      title: 'CS102 Intro to Web Dev',
      course: 'CS102 · Web Development',
      dueDate: 'Due: Fri Jan 12, 3:00 PM',
      accent: '#8B5CF6',
    },
    {
      id: 4,
      title: 'CS205 API Design',
      course: 'CS205 · Computer Networks',
      dueDate: 'Due: Thu Jan 11, 2:00 PM',
      accent: '#EC4899',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F2F4F8]">
      <StatusBar style="dark" backgroundColor="#F2F4F8" />
      
      <View className="border-b border-slate-200 bg-white px-4 py-3 flex-row items-center">
        <Pressable onPress={handleBack} className="mr-3">
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>
        <Text className="text-lg font-bold text-slate-900">CS205 Network Assignment</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 16 }}>
        <View className="mb-6 rounded-2xl bg-white p-4" style={{ borderLeftWidth: 4, borderLeftColor: '#2563EB' }}>
          <Text className="mb-2 text-xs font-bold tracking-wider text-slate-400">ACTIVE — OPEN NOW</Text>
          <Text className="mb-2 text-xl font-extrabold text-slate-900">CS205 Network Assignment</Text>
          <Text className="mb-1 text-base text-slate-500">CS205 · Computer Networks</Text>
          <Text className="mb-2 text-sm font-semibold text-[#2E63DF]">Due: Fri Jan 7, 5PM</Text>
          <Text className="mb-4 text-base text-slate-600">Write a 500-word analysis on OSI vs TCP/IP layers with diagrams.</Text>
          <Pressable className="rounded-xl bg-[#2563EB] px-4 py-3">
            <Text className="text-center text-base font-bold text-white">Open Assignment →</Text>
          </Pressable>
        </View>

        <Text className="mb-4 text-lg font-bold text-slate-900">Other Assignments</Text>
        
        {otherAssignments.map((assignment) => (
          <View
            key={assignment.id}
            className="mb-3 rounded-xl bg-white p-3"
            style={{ borderLeftWidth: 3, borderLeftColor: assignment.accent }}
          >
            <Text className="text-base font-bold text-slate-900">{assignment.title}</Text>
            <Text className="text-sm text-slate-500">{assignment.course}</Text>
            <Text className="mt-1 text-xs font-semibold text-[#2E63DF]">{assignment.dueDate}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
