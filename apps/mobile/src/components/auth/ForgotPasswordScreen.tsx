import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService } from "@/src/services/auth.service";
import { goBackOrReplace } from "@/src/utils/navigation";
import { KeyboardAwareView } from "@/src/components/common/KeyboardAwareView";

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
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#0A1628]">
      <StatusBar style="light" backgroundColor="#0A1628" />
      <KeyboardAwareView keyboardVerticalOffset={0}>
        <ScrollView
          className="flex-1 bg-white"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
        >
          <View className="flex-1 items-center bg-white">
            <LinearGradient
              colors={["#0A1628", "#1A3A6B"]}
              className="w-full max-w-[520px] items-center px-6 pb-8 pt-20"
            >
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white">
                <Ionicons name="lock-closed-outline" size={26} color="#2563EB" />
              </View>
              <Text
                className="mt-4 text-xl font-extrabold text-white"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                Reset Password
              </Text>
              <Text className="mt-2 text-center text-base text-white/70">
                We will send a six-digit code to your email.
              </Text>
            </LinearGradient>
            <View className="-mt-5 w-full max-w-[520px] flex-1 rounded-t-3xl bg-white px-6 pb-8 pt-8">
              <Text className="mb-2 text-sm font-semibold text-slate-600">
                Email Address
              </Text>
              <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@htu.edu.gh"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-lg text-slate-900"
                />
              <Pressable
                disabled={loading}
                onPress={sendCode}
                className={`mt-6 items-center rounded-xl px-4 py-3.5 ${loading ? "bg-slate-400" : "bg-blue-600 active:bg-blue-700"}`}
              >
                <Text className="text-lg font-bold text-white">
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
          </View>
        </ScrollView>
      </KeyboardAwareView>
    </SafeAreaView>
  );
}
