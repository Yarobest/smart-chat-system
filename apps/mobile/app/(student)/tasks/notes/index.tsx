import React from 'react';
import { SafeAreaView, Text, View, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from '@/src/components/common/StatusBar';

export default function NotesScreen() {
  const handleBack = () => {
    router.back();
  };

  const notes = [
    {
      id: 'cs410-design-patterns',
      courseCode: 'CS410',
      courseTitle: 'Software Engineering',
      title: 'CS410 Design Patterns Notes',
      chapter: 'Chapter 4 – Factory, Observer & Strategy patterns',
      uploadedBy: 'Dr. Mensah',
      uploadedDate: 'Jan 13',
      pages: 12,
      tags: ['LECTURE NOTE', 'CS410', 'CHAPTER 4'],
      route: '/(student)/tasks/notes/cs410-design-patterns',
    },
    {
      id: 'cs301-avl-trees',
      courseCode: 'CS301',
      courseTitle: 'Data Structures',
      title: 'CS301 AVL Trees Notes',
      chapter: 'Chapter 5 – Balanced Binary Search Trees',
      uploadedBy: 'Prof. Kofi',
      uploadedDate: 'Jan 10',
      pages: 8,
      tags: ['LECTURE NOTE', 'CS301', 'CHAPTER 5'],
      route: '/(student)/tasks/notes/cs301-avl-trees',
    },
  ];

  const handleNotePress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F5F8]">
      <StatusBar style="light" backgroundColor="#051839" />

      {/* Header */}
      <View className="border-b border-slate-200 bg-white px-4 py-4 flex-row items-center gap-3">
        <Pressable onPress={handleBack} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#051839" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-lg font-bold text-slate-900">Lecture Notes</Text>
          <Text className="text-xs text-slate-500 mt-0.5">{notes.length} notes available</Text>
        </View>
      </View>

      <ScrollView className="flex-1 bg-[#F4F5F8]" contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        {notes.map((note) => (
          <Pressable
            key={note.id}
            onPress={() => handleNotePress(note.route)}
            className="bg-white rounded-2xl p-4 mb-4 border border-slate-200 active:bg-slate-50"
          >
            <View className="flex-row gap-4">
              {/* Icon */}
              <View className="w-14 h-14 rounded-lg bg-purple-100 items-center justify-center">
                <Ionicons name="document-text" size={28} color="#8B5CF6" />
              </View>

              {/* Content */}
              <View className="flex-1">
                <Text className="text-base font-bold text-slate-900 mb-1">{note.title}</Text>
                <Text className="text-xs text-slate-600 mb-2">
                  {note.courseCode} · {note.courseTitle}
                </Text>
                <Text className="text-xs text-slate-500 mb-2">{note.chapter}</Text>
                <Text className="text-xs text-slate-500">
                  Uploaded by {note.uploadedBy} • {note.uploadedDate} • {note.pages} pages
                </Text>
              </View>

              {/* Arrow */}
              <View className="justify-center">
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </View>
            </View>

            {/* Tags */}
            <View className="flex-row gap-2 mt-3 flex-wrap">
              {note.tags.map((tag, index) => (
                <View
                  key={index}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    index === 0
                      ? 'bg-purple-100'
                      : index === 1
                      ? 'bg-blue-100'
                      : 'bg-orange-100'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      index === 0
                        ? 'text-purple-700'
                        : index === 1
                        ? 'text-blue-700'
                        : 'text-orange-700'
                    }`}
                  >
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
