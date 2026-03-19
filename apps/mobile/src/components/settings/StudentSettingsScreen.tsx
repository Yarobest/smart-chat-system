import { useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from '@/src/components/common/StatusBar';

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="mb-3 text-sm font-extrabold tracking-wide text-slate-400">
      {children}
    </Text>
  );
}

function SettingRow({
  icon,
  label,
  right,
  onPress,
}: {
  icon: string;
  label: string;
  right?: ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4"
    >
      <View className="flex-row items-center">
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <Text className="text-lg">{icon}</Text>
        </View>
        <Text className="text-lg font-semibold text-slate-900">{label}</Text>
      </View>
      {right ?? <Text className="text-sm text-slate-400">›</Text>}
    </Pressable>
  );
}

export default function StudentSettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [announcementsEnabled, setAnnouncementsEnabled] = useState(true);
  const [previewsEnabled, setPreviewsEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="bg-[#051839] px-4 pb-5 pt-6">
        <Pressable onPress={() => router.back()} className="flex-row items-center">
          <Text className="text-2xl text-white">‹</Text>
          <Text className="ml-1 text-2xl font-bold text-white">Settings</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 bg-[#F5F7FA] px-4"
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-4">
          <SectionTitle>NOTIFICATIONS</SectionTitle>
          <SettingRow
            icon="🔔"
            label="Push Notifications"
            right={
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: '#E2E8F0', true: '#22C55E' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingRow
            icon="📣"
            label="Announcements"
            right={
              <Switch
                value={announcementsEnabled}
                onValueChange={setAnnouncementsEnabled}
                trackColor={{ false: '#E2E8F0', true: '#22C55E' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingRow
            icon="💬"
            label="Message Previews"
            right={
              <Switch
                value={previewsEnabled}
                onValueChange={setPreviewsEnabled}
                trackColor={{ false: '#E2E8F0', true: '#22C55E' }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>

        <View className="mt-3">
          <SectionTitle>ACCOUNT</SectionTitle>
          <SettingRow icon="👤" label="Edit Profile" onPress={() => {}} />
          <SettingRow icon="🔒" label="Change Password" onPress={() => {}} />
          <SettingRow
            icon="🌐"
            label="Language"
            right={<Text className="text-sm text-slate-400">English ›</Text>}
          />
        </View>

        <View className="mt-3">
          <SectionTitle>PRIVACY & SECURITY</SectionTitle>
          <SettingRow
            icon="🛡️"
            label="Two-Factor Authentication"
            right={
              <Switch
                value={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
                trackColor={{ false: '#E2E8F0', true: '#22C55E' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingRow icon="📱" label="Active Sessions" onPress={() => {}} />
        </View>

        <View className="mt-3">
          <SectionTitle>ABOUT</SectionTitle>
          <SettingRow
            icon="ℹ️"
            label="App Version"
            right={<Text className="text-sm text-slate-500">1.0.0</Text>}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
