import { useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "@/src/components/common/StatusBar";
import { ScreenHeader } from "@/src/components/common/ScreenHeader";
import {
  SettingsRow,
  SettingsSectionTitle,
} from "@/src/components/common/SettingsRow";

export default function LecturerSettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [courseAlertsEnabled, setCourseAlertsEnabled] = useState(true);
  const [announcementAlertsEnabled, setAnnouncementAlertsEnabled] =
    useState(true);
  const [messagePreviewsEnabled, setMessagePreviewsEnabled] = useState(false);
  const [anonymousModeEnabled, setAnonymousModeEnabled] = useState(true);
  const [availableEnabled, setAvailableEnabled] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title="Settings" fallbackRoute="/(lecturer)/profile" />

      <ScrollView
        className="flex-1 bg-[#F5F7FA] px-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-4">
          <SettingsSectionTitle>NOTIFICATIONS</SettingsSectionTitle>
          <SettingsRow
            icon="notifications-outline"
            label="Push Notifications"
            right={
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: "#E2E8F0", true: "#22C55E" }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingsRow
            icon="library-outline"
            label="Course Activity"
            right={
              <Switch
                value={courseAlertsEnabled}
                onValueChange={setCourseAlertsEnabled}
                trackColor={{ false: "#E2E8F0", true: "#22C55E" }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingsRow
            icon="megaphone-outline"
            label="Announcement Alerts"
            right={
              <Switch
                value={announcementAlertsEnabled}
                onValueChange={setAnnouncementAlertsEnabled}
                trackColor={{ false: "#E2E8F0", true: "#22C55E" }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>

        <View className="mt-3">
          <SettingsSectionTitle>MESSAGES</SettingsSectionTitle>
          <SettingsRow
            icon="eye-off-outline"
            label="Hide Message Previews"
            right={
              <Switch
                value={!messagePreviewsEnabled}
                onValueChange={(value) => setMessagePreviewsEnabled(!value)}
                trackColor={{ false: "#E2E8F0", true: "#22C55E" }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Anonymous Group Chats"
            right={
              <Switch
                value={anonymousModeEnabled}
                onValueChange={setAnonymousModeEnabled}
                trackColor={{ false: "#E2E8F0", true: "#22C55E" }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>

        <View className="mt-3">
          <SettingsSectionTitle>PROFILE</SettingsSectionTitle>
          <SettingsRow
            icon="radio-button-on-outline"
            label="Available to Students"
            right={
              <Switch
                value={availableEnabled}
                onValueChange={setAvailableEnabled}
                trackColor={{ false: "#E2E8F0", true: "#22C55E" }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingsRow icon="person-outline" label="Edit Profile" onPress={() => {}} />
          <SettingsRow icon="lock-closed-outline" label="Change Password" onPress={() => {}} />
        </View>

        <View className="mt-3">
          <SettingsSectionTitle>ABOUT</SettingsSectionTitle>
          <SettingsRow
            icon="information-circle-outline"
            label="App Version"
            right={<Text className="text-sm text-slate-500">1.0.0</Text>}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
