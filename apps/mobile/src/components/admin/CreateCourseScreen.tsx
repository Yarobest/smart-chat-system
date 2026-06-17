import { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { StatusBar } from '@/src/components/common/StatusBar';
import { AdminUser, adminService } from '@/src/services/admin.service';

type Option = {
  label: string;
  value: string;
  description?: string;
};

function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'number-pad';
  multiline?: boolean;
}) {
  return (
    <View className="mb-3">
      <Text className="mb-2 px-1 text-xs font-extrabold uppercase text-slate-400">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        className={`rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 ${
          multiline ? 'min-h-[92px]' : ''
        }`}
      />
    </View>
  );
}

function SelectField({
  label,
  value,
  options,
  isOpen,
  setOpen,
  onSelect,
  placeholder = 'Select',
}: {
  label: string;
  value: string;
  options: Option[];
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  onSelect: (value: string) => void;
  placeholder?: string;
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <View className="mb-3">
      <Text className="mb-2 px-1 text-xs font-extrabold uppercase text-slate-400">{label}</Text>
      <Pressable
        onPress={() => setOpen(!isOpen)}
        disabled={options.length === 0}
        className="flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
      >
        <View className="flex-1 pr-3">
          <Text className={`text-sm ${selected ? 'font-bold text-slate-900' : 'font-semibold text-slate-400'}`} numberOfLines={2}>
            {selected?.label ?? placeholder}
          </Text>
          {selected?.description ? (
            <Text className="mt-1 text-xs font-semibold text-slate-500" numberOfLines={1}>
              {selected.description}
            </Text>
          ) : null}
        </View>
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#64748B" />
      </Pressable>

      {isOpen ? (
        <View className="mt-2 max-h-72 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
            {options.map((option) => {
              const active = option.value === value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onSelect(option.value);
                    setOpen(false);
                  }}
                  className={`border-b border-slate-100 px-4 py-3 ${active ? 'bg-blue-50' : 'bg-white'}`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-3">
                      <Text className={`text-sm ${active ? 'font-bold text-blue-700' : 'font-semibold text-slate-800'}`}>
                        {option.label}
                      </Text>
                      {option.description ? (
                        <Text className="mt-1 text-xs text-slate-500" numberOfLines={1}>
                          {option.description}
                        </Text>
                      ) : null}
                    </View>
                    {active ? <Ionicons name="checkmark" size={18} color="#2563EB" /> : null}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

export default function CreateCourseScreen() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [creditHours, setCreditHours] = useState('3');
  const [lecturers, setLecturers] = useState<AdminUser[]>([]);
  const [lecturerId, setLecturerId] = useState('');
  const [description, setDescription] = useState('');
  const [lecturerOpen, setLecturerOpen] = useState(false);
  const [loadingLecturers, setLoadingLecturers] = useState(true);
  const [saving, setSaving] = useState(false);

  const lecturerOptions = useMemo(
    () =>
      lecturers.map((lecturer) => ({
        label: lecturer.name,
        value: lecturer.id,
        description: lecturer.email,
      })),
    [lecturers],
  );

  useEffect(() => {
    let mounted = true;

    adminService
      .lecturers()
      .then((data) => {
        if (!mounted) return;

        setLecturers(data.users);
        setLecturerId(data.users[0]?.id ?? '');
      })
      .catch((error) => {
        Alert.alert('Lecturers failed', error instanceof Error ? error.message : 'Unable to load lecturers');
      })
      .finally(() => {
        if (mounted) setLoadingLecturers(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleCreate = async () => {
    if (!code.trim() || !name.trim() || !lecturerId) {
      Alert.alert('Missing course', 'Enter the course code, course name, and lecturer.');
      return;
    }

    setSaving(true);
    try {
      const result = await adminService.createCourse({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        lecturerId,
        creditHours: creditHours.trim(),
        description: description.trim(),
      });

      Alert.alert('Course created', `${result.course.code} is ready for assignment.`);
      router.replace('/(admin)/courses' as never);
    } catch (error) {
      Alert.alert('Course failed', error instanceof Error ? error.message : 'Unable to create course');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]">
      <StatusBar style="light" backgroundColor="#0A1628" />
      <ScreenHeader title="Create Course" fallbackRoute="/(admin)/courses" />
      <KeyboardAvoidingView
        className="flex-1 bg-[#F3F6FD]"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={16}
      >
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
      >
        <View className="rounded-[24px] bg-white p-4 shadow-sm shadow-slate-200">
          <Text className="mb-1 text-lg font-extrabold text-slate-900">Course Details</Text>
          <Text className="mb-4 text-sm font-semibold text-slate-500">
            Create the course catalogue record and choose the lecturer in charge.
          </Text>

          <TextField label="Course Code" value={code} onChangeText={setCode} placeholder="CS205" />
          <TextField label="Course Name" value={name} onChangeText={setName} placeholder="Operating Systems" />
          <TextField
            label="Credit Hours"
            value={creditHours}
            onChangeText={setCreditHours}
            placeholder="3"
            keyboardType="number-pad"
          />
          <SelectField
            label="Lecturer"
            value={lecturerId}
            options={lecturerOptions}
            isOpen={lecturerOpen}
            setOpen={setLecturerOpen}
            onSelect={setLecturerId}
            placeholder={loadingLecturers ? 'Loading lecturers...' : 'Select lecturer'}
          />
          <TextField
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Optional notes for this course"
            multiline
          />

          <Pressable
            onPress={handleCreate}
            disabled={saving || loadingLecturers}
            className="mt-2 rounded-2xl bg-[#3D6EE8] px-4 py-4 active:opacity-90"
          >
            <Text className="text-center text-sm font-extrabold text-white">
              {saving ? 'Creating...' : 'Create Course'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
