import { useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from '@/src/components/common/StatusBar';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { SettingsRow as SettingRow, SettingsSectionTitle as SectionTitle } from '@/src/components/common/SettingsRow';

export default function StudentSettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [announcementsEnabled, setAnnouncementsEnabled] = useState(true);
  const [previewsEnabled, setPreviewsEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title="Settings" fallbackRoute="/(student)/profile"/>

      <ScrollView
        className="flex-1 bg-[#F5F7FA] px-4"
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-4">
          <SectionTitle>NOTIFICATIONS</SectionTitle>
          <SettingRow
            icon="notifications-outline"
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
            icon="megaphone-outline"
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
            icon="chatbubble-ellipses-outline"
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
          <SettingRow icon="person-outline" label="Edit Profile" onPress={() => {}} />
          <SettingRow icon="lock-closed-outline" label="Change Password" onPress={() => {}} />
          <SettingRow icon="language-outline" label="Language" right={<Text className="text-sm text-slate-400">English ›</Text>} />
        </View>

        <View className="mt-3">
          <SectionTitle>PRIVACY & SECURITY</SectionTitle>
          <SettingRow
            icon="shield-checkmark-outline"
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
          <SettingRow icon="phone-portrait-outline" label="Active Sessions" onPress={() => {}} />
        </View>

        <View className="mt-3">
          <SectionTitle>ABOUT</SectionTitle>
          <SettingRow
            icon="information-circle-outline"
            label="App Version"
            right={<Text className="text-sm text-slate-500">1.0.0</Text>}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
