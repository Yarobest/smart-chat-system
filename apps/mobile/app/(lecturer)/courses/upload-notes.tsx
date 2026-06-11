import { Pressable, SafeAreaView, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';

export default function UploadNoteScreen() {
  const [noteTitle, setNoteTitle] = useState('Design Patterns — Chapter 4');
  const [selectedCourse, setSelectedCourse] = useState('CS410 · Software Engineering');
  const [description, setDescription] = useState(
    'Factory, Observer and Strategy patterns with Java examples. Covers GOF design principles.'
  );
  const [attachedFile, setAttachedFile] = useState({
    name: 'design-patterns-ch4.pdf',
    size: '2.4 MB',
    ready: true,
  });
  const [visibleFrom, setVisibleFrom] = useState('Mon Jan 13 · 8:00 AM');
  const [notifyAllStudents, setNotifyAllStudents] = useState(true);
  const [allowComments, setAllowComments] = useState(false);
  const [allowDownload, setAllowDownload] = useState(true);

  const courses = [
    'CS301 · Data Structures & Algorithms',
    'CS205 · Computer Networks',
    'CS410 · Software Engineering',
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title="Upload Note" onBackPress={() => router.back()} />

      <ScrollView
        className="flex-1 bg-[#F5F7FA] px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card */}
        <View className="mt-4 rounded-[28px] bg-white px-5 py-5 shadow-black/5" style={{ elevation: 3 }}>
          {/* Note Title */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-slate-700 mb-2">Note Title</Text>
            <TextInput
              value={noteTitle}
              onChangeText={setNoteTitle}
              placeholder="Enter note title"
              placeholderTextColor="#94A3B8"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900"
            />
          </View>

          {/* Course Selection */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-slate-700 mb-2">Course</Text>
            <Pressable className="rounded-2xl border border-slate-200 bg-white px-4 py-3 flex-row items-center justify-between">
              <Text className="text-base text-slate-900">{selectedCourse}</Text>
              <Text className="text-lg">›</Text>
            </Pressable>
          </View>

          {/* Description */}
          <View className="mb-5">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-semibold text-slate-700">Description (optional)</Text>
              <Text className="text-xs text-slate-400">0/500</Text>
            </View>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="Add a description"
              placeholderTextColor="#94A3B8"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900"
            />
          </View>

          {/* Attach File */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-slate-700 mb-3">Attach File</Text>
            <View className="rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 px-5 py-8 items-center justify-center">
              {attachedFile ? (
                <>
                  <Text className="text-3xl mb-2">📄</Text>
                  <Text className="text-sm font-semibold text-slate-900">{attachedFile.name}</Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <View className="w-2 h-2 rounded-full bg-emerald-500" />
                    <Text className="text-xs text-slate-600">{attachedFile.size} · Ready to upload</Text>
                  </View>
                  <Pressable className="mt-3">
                    <Text className="text-sm font-semibold text-blue-600">Replace File</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text className="text-2xl mb-2">📁</Text>
                  <Text className="text-sm font-semibold text-slate-900">Select a file to upload</Text>
                  <Text className="text-xs text-slate-500 mt-1">Or drag and drop</Text>
                </>
              )}
            </View>
          </View>

          {/* Visible to students from */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-slate-700 mb-2">Visible to students from</Text>
            <Pressable className="rounded-2xl border border-slate-200 bg-white px-4 py-3 flex-row items-center justify-between">
              <Text className="text-base text-slate-900">{visibleFrom}</Text>
              <Text className="text-lg">📅</Text>
            </Pressable>
          </View>

          {/* Options */}
          <View className="border-t border-slate-100 pt-5">
            <Text className="text-sm font-semibold text-slate-700 mb-4">Options</Text>

            {/* Notify All Students */}
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <View className="flex-row items-center gap-2 flex-1">
                <Text className="text-lg">🔔</Text>
                <Text className="text-sm font-semibold text-slate-900 flex-1">Notify all enrolled students</Text>
              </View>
              <Switch
                value={notifyAllStudents}
                onValueChange={setNotifyAllStudents}
                trackColor={{ false: '#cbd5e1', true: '#3b82f6' }}
                thumbColor={notifyAllStudents ? '#3b82f6' : '#f1f5f9'}
              />
            </View>

            {/* Allow Comments */}
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <View className="flex-row items-center gap-2 flex-1">
                <Text className="text-lg">💬</Text>
                <Text className="text-sm font-semibold text-slate-900 flex-1">Allow students to comment</Text>
              </View>
              <Switch
                value={allowComments}
                onValueChange={setAllowComments}
                trackColor={{ false: '#cbd5e1', true: '#3b82f6' }}
                thumbColor={allowComments ? '#3b82f6' : '#f1f5f9'}
              />
            </View>

            {/* Allow Download */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2 flex-1">
                <Text className="text-lg">📥</Text>
                <Text className="text-sm font-semibold text-slate-900 flex-1">Allow download</Text>
              </View>
              <Switch
                value={allowDownload}
                onValueChange={setAllowDownload}
                trackColor={{ false: '#cbd5e1', true: '#3b82f6' }}
                thumbColor={allowDownload ? '#3b82f6' : '#f1f5f9'}
              />
            </View>
          </View>
        </View>

        {/* Upload Button */}
        <View className="mt-6 gap-2">
          <Pressable className="rounded-full bg-blue-600 px-5 py-4 items-center flex-row justify-center gap-2">
            <Text className="text-lg">📤</Text>
            <Text className="text-base font-semibold text-white">Upload & Notify Students</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
