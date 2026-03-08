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
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

const DEFAULT_EMAIL = "stephen@htu.edu.gh";
const DEFAULT_PASSWORD = "Best1";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    const isValid =
      email.trim().toLowerCase() === DEFAULT_EMAIL &&
      password === DEFAULT_PASSWORD;

    if (!isValid) {
      Alert.alert("Invalid credentials", "Enter the correct credentials.");
      return;
    }

    router.replace("/(student)/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]">
      <StatusBar style="light" hidden={false} backgroundColor="#0A1628" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
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
                Welcome Back
              </Text>
              <Text allowFontScaling className="mt-2 text-lg text-white/75">
                Sign in to continue
              </Text>
            </LinearGradient>

            <View className="-mt-3 flex-1 rounded-t-3xl bg-white px-6 pb-8 pt-7">
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
                    placeholderTextColor="#94A3B8"
                    className="flex-1 text-lg text-slate-900"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View className="mb-6">
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
                <Pressable
                  onPress={() => router.push("/(auth)/forgot-password")}
                  className="mt-3 self-end"
                >
                  <Text
                    allowFontScaling
                    className="text-sm font-semibold text-blue-600"
                  >
                    Forgot Password?
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={handleSignIn}
                className="items-center rounded-xl bg-blue-600 px-4 py-3.5 shadow-md shadow-blue-600/30 active:bg-blue-700"
              >
                <Text allowFontScaling className="text-lg font-bold text-white">
                  Sign In
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/(auth)/register")}
                className="mt-5"
              >
                <Text
                  allowFontScaling
                  className="text-center text-sm text-slate-500"
                >
                  Don&apos;t have an account?{" "}
                  <Text
                    allowFontScaling
                    className="font-semibold text-blue-600"
                  >
                    Register
                  </Text>
                </Text>
              </Pressable>

              <View className="my-5 flex-row items-center">
                <View className="h-px flex-1 bg-slate-200" />
                <Text
                  allowFontScaling
                  className="mx-3 text-sm font-medium text-slate-400"
                >
                  OR
                </Text>
                <View className="h-px flex-1 bg-slate-200" />
              </View>

              <Pressable className="items-center rounded-2xl border border-slate-300 bg-white px-4 py-4 active:bg-slate-50">
                <Text allowFontScaling className="text-lg text-slate-700">
                  🏫 Sign in with HTU ID
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
