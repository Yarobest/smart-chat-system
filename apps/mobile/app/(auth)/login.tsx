import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="flex-1">
        <LinearGradient
          colors={['#0A1628', '#1A3A6B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 2, y: 2 }}
          className="items-center px-6 pb-8 pt-20">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white">
            <Text className="text-3xl">💬</Text>
          </View>
          <Text
            className="mt-4 text-2xl font-bold text-white"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}>
            Welcome Back
          </Text>
          <Text className="mt-2 text-sm text-white/70">Sign in to continue to Campus Chat</Text>
        </LinearGradient>

        <View className="-mt-3 flex-1 rounded-t-3xl bg-white px-6 pt-7">
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-slate-600">Student / Staff ID</Text>
            <TextInput
              value={studentId}
              onChangeText={setStudentId}
              placeholder="Enter your ID"
              placeholderTextColor="#94A3B8"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-slate-600">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
            />
            <Pressable 
              onPress={() => router.push('/(auth)/forgotpassword')}
              className="mt-3 self-end"
            >
              <Text className="text-sm font-semibold text-blue-600">
                Forgot password?
              </Text>
            </Pressable>
          </View>

          <Pressable className="items-center rounded-xl bg-blue-600 px-4 py-4 active:bg-blue-700">
            <Text className="text-base font-bold text-white">Sign In</Text>
          </Pressable>

          <View className="my-5 flex-row items-center">
            <View className="h-px flex-1 bg-slate-200" />
            <Text className="mx-3 text-xs font-medium text-slate-400">OR</Text>
            <View className="h-px flex-1 bg-slate-200" />
          </View>

          <Pressable className="items-center rounded-xl border border-slate-300 bg-white px-4 py-4 active:bg-slate-50">
            <Text className="text-base font-semibold text-slate-700">
              Sign in with school email address
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push('/Register')} className="mt-5">
            <Text className="text-center text-sm text-slate-500">
              New here? <Text className="font-semibold text-blue-600">Create account</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
