import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav } from '@/src/components/common/BottomNav';
import { StatusBar } from '@/src/components/common/StatusBar';
import {
  AdminCourse,
  AdminCourseOffering,
  AdminUser,
  adminService,
} from '@/src/services/admin.service';

const yearGroups = ['Level 100', 'Level 200', 'Level 300', 'Level 400'];
const awardTypes = ['HND', 'BTech'];
const semesters = ['Semester 1', 'Semester 2'];

function Field({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      className="mb-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800"
    />
  );
}

function Segments({
  values,
  active,
  onChange,
}: {
  values: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
      {values.map((value) => (
        <Pressable
          key={value}
          onPress={() => onChange(value)}
          className={`mr-2 rounded-full border px-4 py-2 ${
            active === value ? 'border-blue-600 bg-blue-600' : 'border-slate-200 bg-white'
          }`}
        >
          <Text className={`text-sm font-bold ${active === value ? 'text-white' : 'text-slate-600'}`}>
            {value}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export default function CourseAssignmentsScreen() {
  const insets = useSafeAreaInsets();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [lecturers, setLecturers] = useState<AdminUser[]>([]);
  const [offerings, setOfferings] = useState<AdminCourseOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [faculty, setFaculty] = useState('Faculty of Applied Sciences and Technology');
  const [department, setDepartment] = useState('Computer Science');
  const [programme, setProgramme] = useState('Computer Science');
  const [awardType, setAwardType] = useState('HND');
  const [yearGroup, setYearGroup] = useState('Level 100');

  const [academicYear, setAcademicYear] = useState('2026/2027');
  const [semester, setSemester] = useState('Semester 1');
  const [courseId, setCourseId] = useState('');
  const [lecturerId, setLecturerId] = useState('');

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === courseId),
    [courseId, courses],
  );

  const selectedLecturer = useMemo(
    () => lecturers.find((lecturer) => lecturer.id === lecturerId),
    [lecturerId, lecturers],
  );

  const load = async () => {
    const [courseData, lecturerData, offeringData] = await Promise.all([
      adminService.courses(),
      adminService.lecturers(),
      adminService.offerings(),
    ]);

    setCourses(courseData.courses);
    setLecturers(lecturerData.users);
    setOfferings(offeringData.offerings);
    setCourseId((current) => current || courseData.courses[0]?.id || '');
    setLecturerId((current) => current || lecturerData.users[0]?.id || '');
  };

  useEffect(() => {
    load()
      .catch((error) =>
        Alert.alert('Courses failed', error instanceof Error ? error.message : 'Unable to load courses'),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleCreateCourse = async () => {
    if (!code || !name || !faculty || !department || !programme) {
      Alert.alert('Missing details', 'Fill in the course code, name, faculty, department, and programme.');
      return;
    }

    setSaving(true);
    try {
      const result = await adminService.createCourse({
        code,
        name,
        faculty,
        department,
        programme,
        awardType,
        yearGroup,
      });
      await load();
      setCourseId(result.course.id);
      setCode('');
      setName('');
      Alert.alert('Course created', `${result.course.code} is ready for assignment.`);
    } catch (error) {
      Alert.alert('Course failed', error instanceof Error ? error.message : 'Unable to create course');
    } finally {
      setSaving(false);
    }
  };

  const handleAssignCourse = async () => {
    if (!courseId || !lecturerId || !academicYear || !semester) {
      Alert.alert('Missing assignment', 'Select a course, lecturer, academic year, and semester.');
      return;
    }

    setSaving(true);
    try {
      const result = await adminService.createOffering({
        courseId,
        lecturerId,
        academicYear,
        semester,
      });
      await load();
      Alert.alert(
        'Group created',
        `${result.offering.course.code} now has ${result.offering.group.memberCount} members.`,
      );
    } catch (error) {
      Alert.alert('Assignment failed', error instanceof Error ? error.message : 'Unable to assign course');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#203765]" edges={['top']}>
      <StatusBar style="light" backgroundColor="#203765" />
      <View className="flex-1 bg-[#F3F6FD]">
        <View className="bg-[#203765] px-5 pb-5" style={{ paddingTop: Math.max(insets.top, 4) }}>
          <Text className="-mt-3 text-3xl font-extrabold text-white">Courses</Text>
          <Text className="mt-1 text-sm font-medium text-white/65">
            Create courses, assign lecturers, and auto-create chat groups
          </Text>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
          <View className="mb-4 rounded-[24px] bg-white p-4 shadow-sm shadow-slate-200">
            <Text className="mb-3 text-base font-extrabold text-slate-900">Create Custom Course</Text>
            <Field value={code} onChangeText={setCode} placeholder="Course code e.g. CS205" />
            <Field value={name} onChangeText={setName} placeholder="Course name e.g. Operating Systems" />
            <Field value={faculty} onChangeText={setFaculty} placeholder="Faculty" />
            <Field value={department} onChangeText={setDepartment} placeholder="Department" />
            <Field value={programme} onChangeText={setProgramme} placeholder="Programme" />
            <Text className="mb-2 text-xs font-bold uppercase text-slate-400">Award Type</Text>
            <Segments values={awardTypes} active={awardType} onChange={setAwardType} />
            <Text className="mb-2 text-xs font-bold uppercase text-slate-400">Level</Text>
            <Segments values={yearGroups} active={yearGroup} onChange={setYearGroup} />
            <Pressable
              onPress={handleCreateCourse}
              disabled={saving}
              className="mt-1 rounded-2xl bg-[#3D6EE8] px-4 py-4 active:opacity-90"
            >
              <Text className="text-center text-sm font-extrabold text-white">
                {saving ? 'Saving...' : 'Create Course'}
              </Text>
            </Pressable>
          </View>

          <View className="mb-4 rounded-[24px] bg-white p-4 shadow-sm shadow-slate-200">
            <Text className="mb-3 text-base font-extrabold text-slate-900">Assign Course</Text>
            <Field value={academicYear} onChangeText={setAcademicYear} placeholder="Academic year e.g. 2026/2027" />
            <Text className="mb-2 text-xs font-bold uppercase text-slate-400">Semester</Text>
            <Segments values={semesters} active={semester} onChange={setSemester} />

            <Text className="mb-2 text-xs font-bold uppercase text-slate-400">Course</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
              {courses.map((course) => (
                <Pressable
                  key={course.id}
                  onPress={() => setCourseId(course.id)}
                  className={`mr-2 max-w-[260px] rounded-2xl border px-4 py-3 ${
                    courseId === course.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <Text className="text-sm font-extrabold text-slate-900">{course.code}</Text>
                  <Text className="mt-1 text-xs text-slate-500" numberOfLines={1}>{course.name}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text className="mb-2 text-xs font-bold uppercase text-slate-400">Lecturer</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
              {lecturers.map((lecturer) => (
                <Pressable
                  key={lecturer.id}
                  onPress={() => setLecturerId(lecturer.id)}
                  className={`mr-2 max-w-[260px] rounded-2xl border px-4 py-3 ${
                    lecturerId === lecturer.id ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <Text className="text-sm font-extrabold text-slate-900">{lecturer.name}</Text>
                  <Text className="mt-1 text-xs text-slate-500" numberOfLines={1}>{lecturer.email}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <View className="mb-3 rounded-2xl bg-slate-50 px-4 py-3">
              <Text className="text-xs font-bold uppercase text-slate-400">Selected</Text>
              <Text className="mt-1 text-sm font-semibold text-slate-700">
                {selectedCourse?.code ?? 'No course'} · {selectedLecturer?.name ?? 'No lecturer'}
              </Text>
            </View>

            <Pressable
              onPress={handleAssignCourse}
              disabled={saving || loading}
              className="rounded-2xl bg-[#0F766E] px-4 py-4 active:opacity-90"
            >
              <Text className="text-center text-sm font-extrabold text-white">
                {saving ? 'Assigning...' : 'Assign & Create Group'}
              </Text>
            </Pressable>
          </View>

          <Text className="mb-3 text-base font-extrabold text-slate-900">Active Assignments</Text>
          {offerings.map((offering) => (
            <View key={offering.id} className="mb-3 rounded-[22px] bg-white p-4 shadow-sm shadow-slate-200">
              <View className="flex-row justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-base font-extrabold text-slate-900">
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

        <BottomNav
          items={[
            { label: 'Home', icon: '🏠', onPress: () => router.replace('/(admin)/dashboard') },
            { label: 'Users', icon: '👥', onPress: () => router.replace('/(admin)/users') },
            { label: 'Courses', icon: '📚', active: true, onPress: () => router.replace('/(admin)/courses' as never) },
            { label: 'Settings', icon: '⚙️', onPress: () => router.replace('/(admin)/broadcast') },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}
