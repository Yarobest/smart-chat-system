import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AdminBottomNav } from '@/src/components/common/AdminBottomNav';
import { StatusBar } from '@/src/components/common/StatusBar';
import { AdminCourseOffering, adminService } from '@/src/services/admin.service';

export default function CourseAssignmentsScreen() {
  const insets = useSafeAreaInsets();
  const [offerings, setOfferings] = useState<AdminCourseOffering[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const offeringData = await adminService.offerings();
    setOfferings(offeringData.offerings);
  };

  useEffect(() => {
    load()
      .catch((error) =>
        Alert.alert('Courses failed', error instanceof Error ? error.message : 'Unable to load courses'),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#203765]" edges={['top']}>
      <StatusBar style="light" backgroundColor="#203765" />
      <View className="flex-1 bg-[#F3F6FD]">
        <View className="bg-[#203765] px-5 pb-5" style={{ paddingTop: Math.max(insets.top, 4) }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="-mt-3 text-2xl font-extrabold text-white">Courses</Text>
              <Text className="mt-1 text-sm font-medium text-white/65" numberOfLines={2}>
                Create courses, assign lecturers, and auto-create chat groups
              </Text>
            </View>
            <Pressable
              onPress={() => router.push('/(admin)/courses/create' as never)}
              className="rounded-2xl bg-white/15 px-4 py-3 active:bg-white/20"
            >
              <Text className="text-sm font-extrabold text-white">+ Course</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
          <View className="mb-4 rounded-[24px] bg-white p-4 shadow-sm shadow-slate-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-base font-extrabold text-slate-900" numberOfLines={1}>Assign Course</Text>
                <Text className="mt-1 text-sm font-semibold text-slate-500" numberOfLines={2}>
                  Select the academic group, level, academic year, and semester.
                </Text>
              </View>
              <Pressable
                onPress={() => router.push('/(admin)/courses/assign' as never)}
                className="rounded-2xl bg-[#0F766E] px-4 py-3 active:opacity-90"
              >
                <Text className="text-sm font-extrabold text-white">Assign</Text>
              </Pressable>
            </View>
          </View>

          <Text className="mb-3 text-base font-extrabold text-slate-900">Active Assignments</Text>
          {offerings.map((offering) => (
            <View key={offering.id} className="mb-3 rounded-[22px] bg-white p-4 shadow-sm shadow-slate-200">
              <View className="flex-row justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-base font-extrabold text-slate-900" numberOfLines={2}>
                    {offering.course.code} · {offering.course.name}
                  </Text>
                  <Text className="mt-1 text-sm text-slate-500">
                    {offering.academicYear} · {offering.semester}
                  </Text>
                  <Text className="mt-1 text-sm text-slate-500">
                    {offering.lecturer.name} · {offering.group.memberCount} members
                  </Text>
                </View>
                <View className="rounded-full bg-emerald-50 px-3 py-1 self-start">
                  <Text className="text-xs font-extrabold text-emerald-600">{offering.status}</Text>
                </View>
              </View>
            </View>
          ))}
          {!offerings.length ? (
            <Text className="text-center text-sm font-semibold text-slate-400">
              {loading ? 'Loading assignments...' : 'No course assignments yet.'}
            </Text>
          ) : null}
        </ScrollView>

        <AdminBottomNav active="courses" />
      </View>
    </SafeAreaView>
  );
}
