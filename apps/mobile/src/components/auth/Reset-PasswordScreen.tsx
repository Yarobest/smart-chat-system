import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleReset = () => {
    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    // TODO: Call backend API here

    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]">
      <StatusBar style="light" hidden={false} backgroundColor="#0A1628" />
      <View className="flex-1">
        {/* Header */}
        <LinearGradient
          colors={["#0A1628", "#1A3A6B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 2, y: 2 }}
          className="items-center px-6 pb-8 pt-20"
        >
          <View className="items-center">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white">
              <Text allowFontScaling className="text-lg">🔑</Text>
            </View>

            <Text
              allowFontScaling
              className="mt-4 text-lg font-bold text-white"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              Create New Password
            </Text>
          </View>

          <Text allowFontScaling className="mt-2 text-center text-lg text-white/70">
            Enter your new password below
          </Text>
        </LinearGradient>

        {/* Form Section */}
        <View className="-mt-3 flex-1 rounded-t-3xl bg-white px-6 pt-7">
          {/* New Password */}
          <View className="mb-5">
            <Text
              allowFontScaling
              className="mb-2 text-sm font-semibold text-slate-600"
            >
              Password
            </Text>
            <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-4 mb-3 py-2.5">
              <Text allowFontScaling className="mr-3 text-sm">🔐</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                className="flex-1 text-lg text-slate-900"
              />
            </View>
            <Text
              allowFontScaling
              className="mb-2 text-sm font-semibold text-slate-600"
            >
              Confirm Password
            </Text>
            <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5">
              <Text allowFontScaling className="mr-3 text-sm">🔐</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                className="flex-1 text-lg text-slate-900"
              />
            </View>
            
          </View>
          {/* Error Message */}
          {error ? (
            <Text allowFontScaling className="mb-4 text-center text-red-500">{error}</Text>
          ) : null}

          {/* Reset Button */}
          <Pressable
            onPress={handleReset}
            className="items-center rounded-xl bg-blue-600 px-4 py-4 active:bg-blue-700"
          >
            <Text
              allowFontScaling
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              className="text-lg font-semibold text-white"
            >
              Reset Password
            </Text>
          </Pressable>

          {/* Back to Login */}
          <Pressable onPress={() => router.replace("/(auth)/login")} className="mt-6">
            <Text allowFontScaling className="text-center text-lg text-slate-500">
              Back to <Text allowFontScaling className="text-sm font-semibold text-blue-600">Login</Text>
            </Text>
          </Pressable> 
        </View>
      </View>
    </SafeAreaView>
  );
}
