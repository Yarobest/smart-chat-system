import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="flex-1">
        <LinearGradient
          colors={['#0A1628', '#1A3A6B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="items-center px-6 pb-8 pt-10">
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
          </View>

          <Pressable className="items-center rounded-xl bg-blue-600 px-4 py-4 active:bg-blue-700">
            <Text className="text-base font-bold text-white">Sign In</Text>
          </Pressable>

          <Text className="mt-5 text-center text-sm text-slate-500">
            New here? <Text className="font-semibold text-blue-600">Create account</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
