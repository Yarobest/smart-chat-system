import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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
import { goBackOrReplace } from "@/src/utils/navigation";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    const normalized = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalized) || loading) {
      Alert.alert("Enter your email", "Provide a valid account email address.");
      return;
    }
    try {
      setLoading(true);
      const result = await authService.forgotPassword(normalized);
      Alert.alert("Check your email", result.message, [
        {
          text: "Enter Code",
          onPress: () =>
            router.push({
              pathname: "/(auth)/reset-password",
              params: { email: normalized },
            }),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Unable to send code",
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
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
        >
          <LinearGradient
            colors={["#0A1628", "#1A3A6B"]}
            className="items-center px-6 pb-8 pt-20"
          >
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white">
              <Ionicons name="lock-closed-outline" size={26} color="#2563EB" />
            </View>
            <Text className="mt-4 text-xl font-extrabold text-white">
              Reset Password
            </Text>
            <Text className="mt-2 text-center text-base text-white/70">
              We will send a six-digit code to your email.
            </Text>
          </LinearGradient>
          <View className="-mt-3 flex-1 rounded-t-3xl bg-white px-6 pt-7">
            <Text className="mb-2 text-sm font-semibold text-slate-600">
              Email Address
            </Text>
            <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
              <Ionicons name="mail-outline" size={20} color="#64748B" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@htu.edu.gh"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="ml-3 flex-1 py-3.5 text-base text-slate-900"
              />
            </View>
            <Pressable
              disabled={loading}
              onPress={sendCode}
              className={`mt-6 items-center rounded-xl px-4 py-4 ${loading ? "bg-slate-400" : "bg-blue-600 active:bg-blue-700"}`}
            >
              <Text className="text-base font-bold text-white">
                {loading ? "Sending..." : "Send Reset Code"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => goBackOrReplace("/(auth)/login")}
              className="mt-6"
            >
              <Text className="text-center text-sm text-slate-500">
                Remember your password?{" "}
                <Text className="font-semibold text-blue-600">
                  Back to Login
                </Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
