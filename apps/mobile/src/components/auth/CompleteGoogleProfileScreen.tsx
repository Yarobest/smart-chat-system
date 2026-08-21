import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AWARD_TYPES,
  AwardType,
  HTU_FACULTIES,
  getDepartments,
  getProgrammes,
} from "@/src/constants/htuAcademics";
import { authService } from "@/src/services/auth.service";
import { authStore } from "@/src/stores/authStore";
import { KeyboardAwareView } from "@/src/components/common/KeyboardAwareView";

const levels = ["Level 100", "Level 200", "Level 300", "Level 400"];

function Choices({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <View className="mb-5">
      <Text className="mb-2 text-sm font-semibold text-slate-600">{label}</Text>
      <View className="flex-row flex-wrap">
        {options.map((option) => (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            className={`mb-2 mr-2 rounded-lg border px-3 py-2.5 ${value === option ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"}`}
          >
            <Text
              className={`text-sm font-semibold ${value === option ? "text-blue-700" : "text-slate-600"}`}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function CompleteGoogleProfileScreen() {
  const user = authStore.user;
  const student = user?.role === "student";
  const [staffId, setStaffId] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [awardType, setAwardType] = useState<AwardType>("HND");
  const [programme, setProgramme] = useState("");
  const [yearGroup, setYearGroup] = useState("");
  const [loading, setLoading] = useState(false);
  const departments = useMemo(
    () => getDepartments(faculty).map((item) => item.name),
    [faculty],
  );
  const programmes = useMemo(
    () => getProgrammes(faculty, department, awardType),
    [awardType, department, faculty],
  );

  const save = async () => {
    if (
      !user ||
      !faculty ||
      !department ||
      (student ? !programme || !yearGroup : !staffId.trim())
    ) {
      Alert.alert(
        "Complete your profile",
        "Fill all required academic details.",
      );
      return;
    }
    try {
      setLoading(true);
      const updated = await authService.completeGoogleProfile({
        faculty,
        department,
        ...(student
          ? { programme, yearGroup, awardType }
          : { staffId: staffId.trim() }),
      });
      router.replace(
        updated.role === "lecturer" ? "/(lecturer)/home" : "/(student)/home",
      );
    } catch (error) {
      Alert.alert(
        "Profile failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]">
      <View className="flex-row items-center bg-[#0A1628] px-5 py-5">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/10">
          <Ionicons name="school-outline" size={23} color="white" />
        </View>
        <View className="ml-3 flex-1">
          <Text numberOfLines={1} ellipsizeMode="tail" adjustsFontSizeToFit minimumFontScale={0.75} className="text-xl font-extrabold text-white">
            Complete Your Profile
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" className="mt-1 text-sm text-white/65">
            One-time setup for {user?.email}
          </Text>
        </View>
      </View>
      <KeyboardAwareView keyboardVerticalOffset={0}>
      <ScrollView
        className="flex-1 bg-[#F3F6FD]"
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
      >
        <View className="rounded-2xl bg-white p-4">
          <View className="mb-5 rounded-xl bg-blue-50 p-4">
            <Text className="text-sm font-bold text-blue-700">
              Detected account: {student ? "Student" : "Lecturer"}
            </Text>
            {student ? (
              <Text className="mt-1 text-sm text-blue-600">
                Student ID: {user?.studentId}
              </Text>
            ) : null}
          </View>
          {!student ? (
            <View className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-slate-600">
                Staff ID
              </Text>
              <TextInput
                value={staffId}
                onChangeText={setStaffId}
                placeholder="Enter staff ID"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base"
                autoCapitalize="characters"
              />
            </View>
          ) : null}
          <Choices
            label="Faculty"
            value={faculty}
            options={HTU_FACULTIES.map((item) => item.name)}
            onChange={(value) => {
              setFaculty(value);
              setDepartment("");
              setProgramme("");
            }}
          />
          {faculty ? (
            <Choices
              label="Department"
              value={department}
              options={departments}
              onChange={(value) => {
                setDepartment(value);
                setProgramme("");
              }}
            />
          ) : null}
          {student ? (
            <>
              <Choices
                label="Award Type"
                value={awardType}
                options={[...AWARD_TYPES]}
                onChange={(value) => {
                  setAwardType(value as AwardType);
                  setProgramme("");
                }}
              />
              {department ? (
                <Choices
                  label="Programme"
                  value={programme}
                  options={programmes}
                  onChange={setProgramme}
                />
              ) : null}
              <Choices
                label="Level"
                value={yearGroup}
                options={awardType === "HND" ? levels.slice(0, 3) : levels}
                onChange={setYearGroup}
              />
            </>
          ) : null}
          <Pressable
            disabled={loading}
            onPress={save}
            className={`mt-2 items-center rounded-xl px-4 py-4 ${loading ? "bg-slate-400" : "bg-blue-600 active:bg-blue-700"}`}
          >
            <Text className="text-base font-bold text-white">
              {loading ? "Saving..." : "Continue to Portal"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      </KeyboardAwareView>
    </SafeAreaView>
  );
}
