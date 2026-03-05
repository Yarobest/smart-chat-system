import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

type Role = "student" | "lecturer";

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");

  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const canSubmit = password.length > 4 && hasUppercase && hasNumber;

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]">
      <StatusBar style="light" hidden={false} backgroundColor="#0A1628" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          <LinearGradient
            colors={["#0A1628", "#1A3A6B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 2, y: 2 }}
            className="items-center px-6 pb-8 pt-20"
          >
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white">
              <Text allowFontScaling className="text-3xl">
                🎓
              </Text>
            </View>
            <Text
              allowFontScaling
              className="mt-4 text-xl font-extrabold text-white"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              Create Account
            </Text>
            <Text allowFontScaling className="mt-2 text-lg text-white/75">
              Join the campus network
            </Text>
          </LinearGradient>

          <View className="-mt-3 flex-1 rounded-t-3xl bg-white px-6 pb-8 pt-6">
            <View className="mb-4">
              <Text
                allowFontScaling
                className="mb-2 text-sm font-semibold text-slate-600"
              >
                Full Name
              </Text>
              <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5">
                <Text className="mr-3 text-sm">👤</Text>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Stephen Appiah"
                  className="flex-1 text-lg text-slate-900"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text
                allowFontScaling
                className="mb-2 text-sm font-semibold text-slate-600"
              >
                Student/Staff ID
              </Text>
              <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5">
                <Text className="mr-3 text-sm">🪪</Text>
                <TextInput
                  value={studentId}
                  onChangeText={setStudentId}
                  placeholder="0323080542"
                  className="flex-1 text-lg text-slate-900"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text
                allowFontScaling
                className="mb-2 text-sm font-semibold text-slate-600"
              >
                Email Address
              </Text>
              <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5">
                <Text className="mr-3 text-sm">📧</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="stephen@htu.edu.gh"
                  className="flex-1 text-lg text-slate-900"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View className="mb-5">
              <Text
                allowFontScaling
                className="mb-2 text-sm font-semibold text-slate-600"
              >
                Password
              </Text>
              <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5">
                <Text className="mr-3 text-sm">🔐</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  className="flex-1 text-lg text-slate-900"
                />
              </View>
              {password.length > 0 && !canSubmit ? (
                <Text
                  allowFontScaling
                  className="mt-2 text-sm font-medium text-rose-600"
                >
                  Use more than 4 chars, with one uppercase letter and one
                  number.
                </Text>
              ) : null}
            </View>

            <View className="mb-6">
              <Text
                allowFontScaling
                className="mb-2 text-sm font-semibold text-slate-600"
              >
                Select Role
              </Text>
              <View className="flex-row gap-2.5">
                <Pressable
                  onPress={() => setRole("student")}
                  className={`flex-1 items-center rounded-xl border px-3 py-3 ${role === "student" ? "border-blue-600 bg-blue-50" : "border-slate-300 bg-slate-100"}`}
                >
                  <Text allowFontScaling className="text-lg">
                    🎓
                  </Text>
                  <Text
                    allowFontScaling
                    className={`mt-1 text-sm font-semibold ${role === "student" ? "text-blue-700" : "text-slate-700"}`}
                  >
                    Student
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setRole("lecturer")}
                  className={`flex-1 items-center rounded-xl border px-3 py-3 ${role === "lecturer" ? "border-blue-600 bg-blue-50" : "border-slate-300 bg-slate-100"}`}
                >
                  <Text allowFontScaling className="text-lg">
                    📚
                  </Text>
                  <Text
                    allowFontScaling
                    className={`mt-1 text-sm font-semibold ${role === "lecturer" ? "text-blue-700" : "text-slate-700"}`}
                  >
                    Lecturer
                  </Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              disabled={!canSubmit}
              className={`items-center rounded-xl px-4 py-3.5 ${canSubmit ? "bg-blue-600 active:bg-blue-700" : "bg-slate-300"}`}
            >
              <Text allowFontScaling className="text-lg font-bold text-white">
                Create Account
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace("/(auth)/login")}
              className="mt-5"
            >
              <Text
                allowFontScaling
                className="text-center text-sm text-slate-500"
              >
                Already have an account?{" "}
                <Text allowFontScaling className="font-semibold text-blue-600">
                  Sign in
                </Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
