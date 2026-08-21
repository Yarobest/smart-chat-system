import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
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
import { authService } from "@/src/services/auth.service";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = Array.isArray(params.email)
    ? params.email[0]
    : (params.email ?? "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!/^\d{6}$/.test(code))
      return Alert.alert(
        "Invalid code",
        "Enter the six-digit code from your email.",
      );
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password))
      return Alert.alert(
        "Weak password",
        "Use at least 8 characters, one uppercase letter and one number.",
      );
    if (password !== confirmPassword)
      return Alert.alert(
        "Passwords do not match",
        "Enter the same password twice.",
      );
    try {
      setLoading(true);
      const result = await authService.resetPassword({
        email,
        code,
        password,
        confirmPassword,
      });
      Alert.alert("Password changed", result.message, [
        { text: "Sign In", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (error) {
      Alert.alert(
        "Reset failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]">
      <StatusBar style="light" backgroundColor="#0A1628" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
        >
          <LinearGradient
            colors={["#0A1628", "#1A3A6B"]}
            className="items-center px-6 pb-8 pt-20"
          >
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white">
              <Ionicons name="key-outline" size={27} color="#2563EB" />
            </View>
            <Text className="mt-4 text-xl font-extrabold text-white">
              Create New Password
            </Text>
            <Text
              className="mt-2 text-center text-sm text-white/70"
              numberOfLines={2}
            >
              {email || "Return and enter your email first"}
            </Text>
          </LinearGradient>
          <View className="-mt-3 flex-1 rounded-t-3xl bg-white px-6 pt-7">
            <Text className="mb-2 text-sm font-semibold text-slate-600">
              Six-digit code
            </Text>
            <TextInput
              value={code}
              onChangeText={(value) =>
                setCode(value.replace(/\D/g, "").slice(0, 6))
              }
              keyboardType="number-pad"
              placeholder="000000"
              placeholderTextColor="#94A3B8"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-center text-xl font-bold tracking-[8px] text-slate-900"
            />
            <Text className="mb-2 mt-5 text-sm font-semibold text-slate-600">
              New Password
            </Text>
            <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
              <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!visible}
                placeholder="New password"
                placeholderTextColor="#94A3B8"
                className="ml-3 flex-1 py-3.5 text-base text-slate-900"
              />
              <Pressable onPress={() => setVisible((value) => !value)}>
                <Ionicons
                  name={visible ? "eye-off-outline" : "eye-outline"}
                  size={21}
                  color="#64748B"
                />
              </Pressable>
            </View>
            <Text className="mb-2 mt-4 text-sm font-semibold text-slate-600">
              Confirm Password
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!visible}
              placeholder="Confirm new password"
              placeholderTextColor="#94A3B8"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900"
            />
            <Pressable
              disabled={loading || !email}
              onPress={handleReset}
              className={`mt-6 items-center rounded-xl px-4 py-4 ${loading || !email ? "bg-slate-400" : "bg-blue-600 active:bg-blue-700"}`}
            >
              <Text className="text-base font-bold text-white">
                {loading ? "Resetting..." : "Reset Password"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
