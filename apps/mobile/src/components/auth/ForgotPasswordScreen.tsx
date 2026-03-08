import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]">
      <StatusBar style="light" hidden={false} backgroundColor="#0A1628" />
      <View className="flex-1">
        <LinearGradient
          colors={["#0A1628", "#1A3A6B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 2, y: 2 }}
          className="items-center px-6 pb-8 pt-20"
        >
          <View className="items-center">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white">
              <Text allowFontScaling className="text-lg">🔐</Text>
            </View>
            <Text
              allowFontScaling
              className="mt-4 text-lg font-bold text-white"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              Reset Password
            </Text>
          </View>
          <Text allowFontScaling className="mt-2 text-center text-lg text-white/70">
            Enter your email to receive reset instructions
          </Text>
        </LinearGradient>

        <View className="-mt-3 flex-1 rounded-t-3xl bg-white px-6 pt-7">
          <View className="flex-row items-center rounded-xl mb-5 border border-slate-200 bg-slate-100 px-4 py-2.5">
            <Text allowFontScaling className="mr-3 text-sm">📧</Text>
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
          <Pressable
            onPress={() => router.push("/(auth)/reset-password")}
            className="items-center rounded-xl bg-blue-600 px-4 py-4 active:bg-blue-700"
          >
            <Text allowFontScaling className="text-lg text-white">Go To Reset Page</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} className="mt-6">
            <Text allowFontScaling className="text-left text-lg text-slate-500">
              Remember your password?{" "}
              <Text allowFontScaling className="text-sm font-semibold text-blue-600">
                Back to Login
              </Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}




