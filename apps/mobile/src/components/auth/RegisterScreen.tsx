import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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
  YEAR_GROUPS,
  getDepartments,
  getProgrammes,
} from "@/src/constants/htuAcademics";
import { authService } from "@/src/services/auth.service";

type Role = "student" | "lecturer";
type Step = "account" | "details";
type DropdownKey = "faculty" | "department" | "awardType" | "programme" | "yearGroup";

export default function RegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("account");
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [role, setRole] = useState<Role>("student");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [programme, setProgramme] = useState("");
  const [yearGroup, setYearGroup] = useState("");
  const [awardType, setAwardType] = useState<AwardType>("HND");
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);

  const departments = useMemo(() => getDepartments(faculty), [faculty]);
  const programmes = useMemo(
    () => getProgrammes(faculty, department, awardType),
    [awardType, department, faculty],
  );
  const passwordOk =
    password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
  const accountComplete =
    fullName.trim() &&
    email.trim() &&
    passwordOk &&
    password === confirmPassword &&
    (role === "student" ? studentId.trim() : staffId.trim());
  const detailsComplete =
    faculty &&
    department &&
    (role === "lecturer" || (programme && yearGroup && awardType));

  const resetAcademicSelection = () => {
    setFaculty("");
    setDepartment("");
    setProgramme("");
    setYearGroup("");
    setOpenDropdown(null);
  };

  const handleNext = () => {
    if (!accountComplete) {
      Alert.alert(
        "Check your details",
        "Fill all account fields and make sure both passwords match.",
      );
      return;
    }

    setStep("details");
  };

  const handleRegister = async () => {
    if (!detailsComplete || loading) {
      Alert.alert("Complete profile", "Select all required academic details.");
      return;
    }

    try {
      setLoading(true);
      const session = await authService.register({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        role,
        studentId: role === "student" ? studentId.trim() : undefined,
        staffId: role === "lecturer" ? staffId.trim() : undefined,
        faculty,
        department,
        programme: role === "student" ? programme : undefined,
        yearGroup: role === "student" ? yearGroup : undefined,
        awardType: role === "student" ? awardType : undefined,
      });

      router.replace(
        session.user.role === "lecturer" ? "/(lecturer)/home" : "/(student)/home",
      );
    } catch (error) {
      Alert.alert(
        "Registration failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const dropdown = (
    key: DropdownKey,
    label: string,
    value: string,
    options: readonly string[],
    onSelect: (value: string) => void,
    placeholder = "Select option",
  ) => (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-slate-600">{label}</Text>
      <Pressable
        onPress={() =>
          setOpenDropdown((current) => (current === key ? null : key))
        }
        className={`flex-row items-center justify-between rounded-xl border px-4 py-3 ${options.length === 0 ? "border-slate-200 bg-slate-100" : "border-slate-200 bg-slate-100 active:bg-slate-200"}`}
        disabled={options.length === 0}
      >
        <Text
          className={`flex-1 text-base ${value ? "font-semibold text-slate-900" : "text-slate-400"}`}
          numberOfLines={2}
        >
          {value || placeholder}
        </Text>
        <Ionicons
          name={openDropdown === key ? "chevron-up" : "chevron-down"}
          size={18}
          color="#64748B"
        />
      </Pressable>

      {openDropdown === key ? (
        <View className="mt-2 max-h-64 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
            {options.map((option) => {
              const active = option === value;
              return (
                <Pressable
                  key={option}
                  onPress={() => {
                    onSelect(option);
                    setOpenDropdown(null);
                  }}
                  className={`border-b border-slate-100 px-4 py-3 ${active ? "bg-blue-50" : "bg-white"}`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text
                      className={`flex-1 text-base ${active ? "font-bold text-blue-700" : "font-medium text-slate-700"}`}
                    >
                      {option}
                    </Text>
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

  const passwordInput = (
    label: string,
    value: string,
    onChangeText: (value: string) => void,
    visible: boolean,
    onToggle: () => void,
  ) => (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-slate-600">{label}</Text>
      <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5">
        <Text className="mr-3 text-sm">🔐</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="••••••••"
          placeholderTextColor="#94A3B8"
          secureTextEntry={!visible}
          className="flex-1 text-lg text-slate-900"
        />
        <Pressable
          onPress={onToggle}
          className="ml-2 h-9 w-9 items-center justify-center rounded-full active:bg-slate-200"
        >
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#64748B"
          />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]">
      <StatusBar style="light" hidden={false} backgroundColor="#0A1628" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}>
          <View className="flex-1 items-center">
            <LinearGradient
              colors={["#0A1628", "#1A3A6B"]}
              className="w-full max-w-[520px] items-center px-6 pb-8 pt-20"
            >
              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white">
                <Text className="text-3xl">🎓</Text>
              </View>
              <Text className="mt-4 text-xl font-extrabold text-white">
                {step === "account" ? "Create Account" : "Academic Details"}
              </Text>
              <Text className="mt-2 text-lg text-white/75">
                {step === "account" ? "Join the campus network" : "Ho Technical University"}
              </Text>
            </LinearGradient>

            <View className="mt-5 w-full max-w-[520px] flex-1 rounded-t-3xl bg-white px-6 pb-8 pt-6">
              {step === "account" ? (
                <>
                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-semibold text-slate-600">Full Name</Text>
                    <TextInput
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Stephen Appiah"
                      className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-lg text-slate-900"
                      autoCapitalize="words"
                    />
                  </View>

                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-semibold text-slate-600">
                      {role === "student" ? "Student ID" : "Staff ID"}
                    </Text>
                    <TextInput
                      value={role === "student" ? studentId : staffId}
                      onChangeText={role === "student" ? setStudentId : setStaffId}
                      placeholder={role === "student" ? "0323080542" : "STAFF-001"}
                      className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-lg text-slate-900"
                      autoCapitalize="characters"
                    />
                  </View>

                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-semibold text-slate-600">Email Address</Text>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="stephen@htu.edu.gh"
                      className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-lg text-slate-900"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  {passwordInput("Password", password, setPassword, passwordVisible, () =>
                    setPasswordVisible((visible) => !visible),
                  )}
                  {passwordInput(
                    "Confirm Password",
                    confirmPassword,
                    setConfirmPassword,
                    confirmPasswordVisible,
                    () => setConfirmPasswordVisible((visible) => !visible),
                  )}

                  {password.length > 0 && !passwordOk ? (
                    <Text className="mb-4 text-sm font-medium text-rose-600">
                      Use at least 8 chars, with one uppercase letter and one number.
                    </Text>
                  ) : null}
                  {confirmPassword.length > 0 && password !== confirmPassword ? (
                    <Text className="mb-4 text-sm font-medium text-rose-600">
                      Passwords do not match.
                    </Text>
                  ) : null}

                  <View className="mb-6">
                    <Text className="mb-2 text-sm font-semibold text-slate-600">Select Role</Text>
                    <View className="flex-row">
                      {(["student", "lecturer"] as const).map((item) => (
                        <Pressable
                          key={item}
                          onPress={() => {
                            setRole(item);
                            resetAcademicSelection();
                          }}
                          className={`mr-2.5 flex-1 items-center rounded-xl border px-3 py-3 ${role === item ? "border-blue-600 bg-blue-50" : "border-slate-300 bg-slate-100"}`}
                        >
                          <Text className={`text-sm font-semibold capitalize ${role === item ? "text-blue-700" : "text-slate-700"}`}>
                            {item}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <Pressable
                    onPress={handleNext}
                    className="items-center rounded-xl bg-blue-600 px-4 py-3.5 active:bg-blue-700"
                  >
                    <Text className="text-lg font-bold text-white">Continue</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  {dropdown(
                    "faculty",
                    "Faculty",
                    faculty,
                    HTU_FACULTIES.map((item) => item.name),
                    (value) => {
                      setFaculty(value);
                      setDepartment("");
                      setProgramme("");
                    },
                  )}
                  {dropdown(
                    "department",
                    "Department",
                    department,
                    departments.map((item) => item.name),
                    (value) => {
                      setDepartment(value);
                      setProgramme("");
                    },
                    faculty ? "Select department" : "Select faculty first",
                  )}
                  {role === "student" ? (
                    <>
                      {dropdown("awardType", "Award Type", awardType, AWARD_TYPES, (value) => {
                        setAwardType(value as AwardType);
                        setProgramme("");
                      })}
                      {dropdown(
                        "programme",
                        "Programme",
                        programme,
                        programmes,
                        setProgramme,
                        department ? "Select programme" : "Select department first",
                      )}
                      {dropdown("yearGroup", "Year Group", yearGroup, YEAR_GROUPS, setYearGroup)}
                    </>
                  ) : null}

                  <View className="flex-row">
                    <Pressable
                      onPress={() => setStep("account")}
                      className="mr-3 flex-1 items-center rounded-xl border border-slate-300 px-4 py-3.5"
                    >
                      <Text className="text-lg font-bold text-slate-700">Back</Text>
                    </Pressable>
                    <Pressable
                      disabled={loading}
                      onPress={handleRegister}
                      className={`flex-1 items-center rounded-xl px-4 py-3.5 ${loading ? "bg-slate-300" : "bg-blue-600 active:bg-blue-700"}`}
                    >
                      <Text className="text-lg font-bold text-white">
                        {loading ? "Creating..." : "Create Account"}
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}

              <Pressable onPress={() => router.replace("/(auth)/login")} className="mt-5">
                <Text className="text-center text-sm text-slate-500">
                  Already have an account? <Text className="font-semibold text-blue-600">Sign in</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
