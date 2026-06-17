import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { StatusBar } from '@/src/components/common/StatusBar';
import { BackButton } from '@/src/components/common/BackButton';

type PriorityType = 'normal' | 'important' | 'urgent';

const COURSES = [
  { id: 'CS301', name: 'CS301' },
  { id: 'CS205', name: 'CS205' },
  { id: 'CS410', name: 'CS410' },
];

export default function ComposeAnnouncementScreen() {
  const [title, setTitle] = useState('Assignment 4 - Due Jan 24');
  const [message, setMessage] = useState(
    'Assignment 4 on Graph Algorithms is due Jan 24 at 5PM. Late submissions attract a 20% penalty.'
  );
  const [selectedCourses, setSelectedCourses] = useState<string[]>(['CS301']);
  const [priority, setPriority] = useState<PriorityType>('normal');

  const toggleCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />

      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#051839] px-4 pb-5 pt-6">
        <BackButton fallbackRoute="/(lecturer)/announcements" />
        <Text className="text-lg font-extrabold text-white">Post Announcement</Text>
        <Pressable onPress={() => {}} className="rounded-full px-4 py-2">
          <Text className="text-sm font-semibold text-orange-500">Send</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 bg-[#F5F7FA]"
        contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card */}
        <View className="rounded-[28px] bg-white px-5 py-5 shadow-black/5" style={{ elevation: 3 }}>
          {/* Title */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-slate-700 mb-2">Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter announcement title"
              placeholderTextColor="#94A3B8"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
            />
          </View>

          {/* Message */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-slate-700 mb-2">Message</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder="Write your announcement message"
              placeholderTextColor="#94A3B8"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
            />
          </View>

          {/* Send To */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-slate-700 mb-3">Send To</Text>
            <View className="flex-row flex-wrap gap-2">
              {COURSES.map((course) => (
                <Pressable
                  key={course.id}
                  onPress={() => toggleCourse(course.id)}
                  className={`rounded-full border-2 px-4 py-2 ${
                    selectedCourses.includes(course.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <View className="flex-row items-center gap-2">
                    {selectedCourses.includes(course.id) && (
                      <Text className="text-blue-600">✓</Text>
                    )}
                    <Text
                      className={`text-sm font-semibold ${
                        selectedCourses.includes(course.id) ? 'text-blue-600' : 'text-slate-600'
                      }`}
                    >
                      {course.name}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Priority */}
          <View>
            <Text className="text-sm font-semibold text-slate-700 mb-3">Priority</Text>
            <View className="flex-row gap-2">
              {[
                { id: 'normal', label: 'Normal', icon: '◉', color: '#3B82F6', bgColor: '#EFF6FF', borderColor: '#3B82F6', textColor: '#1E40AF' },
                { id: 'important', label: 'Important', icon: '⚠️', color: '#F59E0B', bgColor: '#FFFBEB', borderColor: '#F59E0B', textColor: '#B45309' },
                { id: 'urgent', label: 'Urgent', icon: '🔴', color: '#EF4444', bgColor: '#FEE2E2', borderColor: '#EF4444', textColor: '#991B1B' },
              ].map((option) => (
                <Pressable
                  key={option.id}
                  onPress={() => setPriority(option.id as PriorityType)}
                  className="flex-1 rounded-full border-2 px-4 py-3 items-center flex-row justify-center gap-2"
                  style={{
                    borderColor: priority === option.id ? option.borderColor : '#e2e8f0',
                    backgroundColor: priority === option.id ? option.bgColor : '#ffffff',
                  }}
                >
                  <View
                    className="w-4 h-4 rounded-full border-2 items-center justify-center"
                    style={{
                      borderColor: priority === option.id ? option.color : '#cbd5e1',
                    }}
                  >
                    {priority === option.id && (
                      <View
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                  </View>
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: priority === option.id ? option.textColor : '#475569',
                    }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Send Button */}
        <Pressable className="rounded-full bg-blue-600 px-5 py-4 items-center flex-row justify-center gap-2">
          <Text className="text-lg">📤</Text>
          <Text className="text-base font-semibold text-white">Send Announcement</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
 
