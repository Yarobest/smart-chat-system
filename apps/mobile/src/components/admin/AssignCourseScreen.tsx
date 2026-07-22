import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/src/components/common/ScreenHeader";
import { StatusBar } from "@/src/components/common/StatusBar";
import {
  AWARD_TYPES,
  AwardType,
  HTU_FACULTIES,
  getDepartments,
  getProgrammes,
} from "@/src/constants/htuAcademics";
import { AdminCourse, adminService } from "@/src/services/admin.service";

type DropdownKey =
  | "course"
  | "faculty"
  | "department"
  | "programme"
  | "awardType"
  | "yearGroup"
  | "academicYear"
  | "semester";

type Option = {
  label: string;
  value: string;
  description?: string;
};

const hndLevels = ["Level 100", "Level 200", "Level 300"];
const btechLevels = ["Level 100", "Level 200", "Level 300", "Level 400"];

const semesters: Option[] = [
  { label: "Semester 1", value: "Semester 1" },
  { label: "Semester 2", value: "Semester 2" },
];

const defaultFaculty = HTU_FACULTIES[0]?.name ?? "";
const defaultDepartment = getDepartments(defaultFaculty)[0]?.name ?? "";
const defaultAwardType: AwardType = AWARD_TYPES[0];
const defaultProgramme =
  getProgrammes(defaultFaculty, defaultDepartment, defaultAwardType)[0] ?? "";

function academicYearOptions() {
  const year = new Date().getFullYear();

  return [-1, 0, 1, 2].map((offset) => {
    const start = year + offset;
    const value = `${start}/${start + 1}`;

    return { label: value, value };
  });
}

function toOptions(values: string[]): Option[] {
  return values.map((value) => ({ label: value, value }));
}

function SelectField({
  id,
  label,
  value,
  options,
  openDropdown,
  setOpenDropdown,
  onSelect,
  placeholder = "Select",
}: {
  id: DropdownKey;
  label: string;
  value: string;
  options: Option[];
  openDropdown: DropdownKey | null;
  setOpenDropdown: (value: DropdownKey | null) => void;
  onSelect: (value: string) => void;
  placeholder?: string;
}) {
  const isOpen = openDropdown === id;
  const selected = options.find((option) => option.value === value);

  return (
    <View className="mb-4">
      <Text className="mb-2 px-1 text-xs font-extrabold uppercase text-slate-400">
        {label}
      </Text>
      <Pressable
        onPress={() => setOpenDropdown(isOpen ? null : id)}
        disabled={options.length === 0}
        className="flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
      >
        <View className="flex-1 pr-3">
          <Text
            className={`text-sm ${selected ? "font-bold text-slate-900" : "font-semibold text-slate-400"}`}
            numberOfLines={2}
          >
            {selected?.label ?? placeholder}
          </Text>
          {selected?.description ? (
            <Text
              className="mt-1 text-xs font-semibold text-slate-500"
              numberOfLines={1}
            >
              {selected.description}
            </Text>
          ) : null}
        </View>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color="#64748B"
        />
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
                    setOpenDropdown(null);
                  }}
                  className={`border-b border-slate-100 px-4 py-3 ${active ? "bg-blue-50" : "bg-white"}`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-3">
                      <Text
                        className={`text-sm ${active ? "font-bold text-blue-700" : "font-semibold text-slate-800"}`}
                      >
                        {option.label}
                      </Text>
                      {option.description ? (
                        <Text
                          className="mt-1 text-xs text-slate-500"
                          numberOfLines={1}
                        >
                          {option.description}
                        </Text>
                      ) : null}
                    </View>
                    {active ? (
                      <Ionicons name="checkmark" size={18} color="#2563EB" />
                    ) : null}
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

export default function AssignCourseScreen() {
  const yearOptions = useMemo(() => academicYearOptions(), []);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [courseId, setCourseId] = useState("");
  const [faculty, setFaculty] = useState(defaultFaculty);
  const [department, setDepartment] = useState(defaultDepartment);
  const [awardType, setAwardType] = useState<AwardType>(defaultAwardType);
  const [programme, setProgramme] = useState(defaultProgramme);
  const [yearGroup, setYearGroup] = useState(hndLevels[0]);
  const [academicYear, setAcademicYear] = useState(yearOptions[1]?.value ?? "");
  const [semester, setSemester] = useState(semesters[0].value);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const departments = useMemo(() => getDepartments(faculty), [faculty]);
  const programmes = useMemo(
    () => getProgrammes(faculty, department, awardType),
    [awardType, department, faculty],
  );
  const levelOptions = useMemo(
    () => toOptions(awardType === "BTech" ? btechLevels : hndLevels),
    [awardType],
  );

  const courseOptions = useMemo(
    () =>
      courses.map((course) => ({
        label: `${course.code} · ${course.name}`,
        value: course.id,
      })),
    [courses],
  );

  useEffect(() => {
    let mounted = true;

    adminService
      .courses()
      .then((courseData) => {
        if (!mounted) return;

        setCourses(courseData.courses);
        setCourseId(courseData.courses[0]?.id ?? "");
      })
      .catch((error) => {
        Alert.alert(
          "Assignment failed",
          error instanceof Error ? error.message : "Unable to load courses",
        );
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const selectFaculty = (value: string) => {
    const nextDepartment = getDepartments(value)[0]?.name ?? "";
    const nextProgramme =
      getProgrammes(value, nextDepartment, awardType)[0] ?? "";

    setFaculty(value);
    setDepartment(nextDepartment);
    setProgramme(nextProgramme);
  };

  const selectDepartment = (value: string) => {
    setDepartment(value);
    setProgramme(getProgrammes(faculty, value, awardType)[0] ?? "");
  };

  const selectAwardType = (value: string) => {
    const nextAwardType = value as AwardType;
    const nextLevels = nextAwardType === "BTech" ? btechLevels : hndLevels;

    setAwardType(nextAwardType);
    setProgramme(getProgrammes(faculty, department, nextAwardType)[0] ?? "");
    setYearGroup(nextLevels.includes(yearGroup) ? yearGroup : nextLevels[0]);
  };

  const handleAssign = async () => {
    if (
      !courseId ||
      !faculty ||
      !department ||
      !programme ||
      !awardType ||
      !yearGroup ||
      !academicYear ||
      !semester
    ) {
      Alert.alert(
        "Missing assignment",
        "Select the course and all academic assignment details.",
      );
      return;
    }

    setSaving(true);
    try {
      const result = await adminService.createOffering({
        courseId,
        academicYear,
        semester,
        faculty,
        department,
        programme,
        awardType,
        yearGroup,
      });

      Alert.alert(
        "Group created",
        `${result.offering.course.code} now has ${result.offering.group.memberCount} members.`,
      );
      router.replace("/(admin)/courses" as never);
    } catch (error) {
      Alert.alert(
        "Assignment failed",
        error instanceof Error ? error.message : "Unable to assign course",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]">
      <StatusBar style="light" backgroundColor="#0A1628" />
      <ScreenHeader title="Assign Course" fallbackRoute="/(admin)/courses" />

      <KeyboardAvoidingView
        className="flex-1 bg-[#F3F6FD]"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={16}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        >
          <View className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-200">
            <Text className="mb-1 text-base font-extrabold text-slate-900">
              Course Assignment
            </Text>
            <Text className="mb-4 text-sm font-semibold text-slate-500">
              Choose the academic group that should receive this course chat.
            </Text>

            <SelectField
              id="course"
              label="Course"
              value={courseId}
              options={courseOptions}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              onSelect={setCourseId}
              placeholder={loading ? "Loading courses..." : "Select course"}
            />
            <SelectField
              id="faculty"
              label="Faculty"
              value={faculty}
              options={HTU_FACULTIES.map((item) => ({
                label: item.name,
                value: item.name,
              }))}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              onSelect={selectFaculty}
            />
            <SelectField
              id="department"
              label="Department"
              value={department}
              options={departments.map((item) => ({
                label: item.name,
                value: item.name,
              }))}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              onSelect={selectDepartment}
              placeholder="Select faculty first"
            />
            <SelectField
              id="awardType"
              label="Award Type"
              value={awardType}
              options={toOptions(AWARD_TYPES)}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              onSelect={selectAwardType}
            />
            <SelectField
              id="programme"
              label="Programme"
              value={programme}
              options={toOptions(programmes)}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              onSelect={setProgramme}
              placeholder="Select department first"
            />
            <SelectField
              id="yearGroup"
              label="Level"
              value={yearGroup}
              options={levelOptions}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              onSelect={setYearGroup}
            />
            <SelectField
              id="academicYear"
              label="Academic Year"
              value={academicYear}
              options={yearOptions}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              onSelect={setAcademicYear}
            />
            <SelectField
              id="semester"
              label="Semester"
              value={semester}
              options={semesters}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              onSelect={setSemester}
            />

            <Pressable
              onPress={handleAssign}
              disabled={saving || loading}
              className={`mt-2 rounded-lg bg-[#0F766E] px-4 py-4 active:opacity-90 ${saving || loading ? "opacity-50" : ""}`}
            >
              <Text className="text-center text-sm font-extrabold text-white">
                {saving ? "Assigning..." : "Assign & Create Group"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
