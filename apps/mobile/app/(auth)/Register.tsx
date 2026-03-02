import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type Role = 'student' | 'lecturer';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');

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
            Create Account
          </Text>
          <Text className="mt-2 text-sm text-white/70">Join the Campus Chat</Text>
        </LinearGradient>

        <View className="-mt-3 flex-1 rounded-t-3xl bg-white px-6 pt-7">
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-slate-600">Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
              autoCapitalize="words"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-slate-600">Student / Staff ID</Text>
            <TextInput
              value={studentId}
              onChangeText={setStudentId}
              placeholder="Enter your student or staff ID"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-slate-600">Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-5">
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

          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-slate-600">Select Role</Text>
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setRole('student')}
                className={`flex-1 items-center rounded-xl border px-4 py-3 ${
                  role === 'student'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-300 bg-slate-50 active:bg-slate-100'
                }`}>
                <Text className="text-2xl">🎓</Text>
                <Text
                  className={`mt-1 text-sm font-semibold ${
                    role === 'student' ? 'text-blue-700' : 'text-slate-700'
                  }`}>
                  Student
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setRole('lecturer')}
                className={`flex-1 items-center rounded-xl border px-4 py-3 ${
                  role === 'lecturer'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-300 bg-slate-50 active:bg-slate-100'
                }`}>
                <Text className="text-2xl">📚</Text>
                <Text
                  className={`mt-1 text-sm font-semibold ${
                    role === 'lecturer' ? 'text-blue-700' : 'text-slate-700'
                  }`}>
                  Lecturer
                </Text>
              </Pressable>
            </View>
          </View>

          <Pressable className="items-center rounded-xl bg-blue-600 px-4 py-4 active:bg-blue-700">
            <Text className="text-base font-bold text-white">Create Account</Text>
          </Pressable>
          
          <Text className="mt-5 text-center text-sm text-slate-500">
            Already have an account? <Text className="font-semibold text-blue-600">Sign in</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
