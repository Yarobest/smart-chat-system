import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogoutModal } from '@/src/components/auth/Logout';
import { BottomNav } from '@/src/components/common/BottomNav';
import { StatusBar } from '@/src/components/common/StatusBar';

const securityRows = [
  { icon: '⏱️', label: 'Session Timeout', value: '30 min ›' },
  { icon: '📋', label: 'Audit Log Retention', value: '90 days ›' },
] as const;

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="mb-3 mt-5 text-sm font-extrabold tracking-wide text-slate-400">
      {children}
    </Text>
  );
}

function ToggleRow({
  icon,
  label,
  value,
  onValueChange,
}: {
  icon: string;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View className="mb-3 flex-row items-center justify-between rounded-[22px] bg-white px-4 py-4 shadow-sm shadow-slate-200">
      <View className="flex-row items-center">
        <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <Text className="text-lg">{icon}</Text>
        </View>
        <Text className="text-lg font-semibold text-slate-900">{label}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E2E8F0', true: '#60D394' }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E2E8F0"
      />
    </View>
  );
}

function ValueRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <Pressable className="mb-3 flex-row items-center justify-between rounded-[22px] bg-white px-4 py-4 shadow-sm shadow-slate-200">
      <View className="flex-row items-center">
        <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <Text className="text-lg">{icon}</Text>
        </View>
        <Text className="text-lg font-semibold text-slate-900">{label}</Text>
      </View>

      <Text className="text-sm font-semibold text-slate-400">{value}</Text>
    </Pressable>
  );
}

export default function BroadcastScreen() {
  const insets = useSafeAreaInsets();
  const [systemOnline, setSystemOnline] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newRegistrations, setNewRegistrations] = useState(true);
  const [messageModeration, setMessageModeration] = useState(true);
  const [profanityFilter, setProfanityFilter] = useState(true);
  const [fileSharing, setFileSharing] = useState(false);
  const [autoFlagKeywords, setAutoFlagKeywords] = useState(true);
  const [forceTwoFactor, setForceTwoFactor] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const handleLogout = () => {
    setLogoutVisible(false);
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1A2E57]" edges={['top']}>
      <StatusBar style="light" backgroundColor="#1A2E57" />
      <View className="flex-1 bg-[#F3F6FD]">
        <View
          className="bg-[#1A2E57] px-5 pb-5"
          style={{ paddingTop: Math.max(insets.top, 4) }}
        >
          <View>
            <View>
              <Text className="-mt-3 text-3xl font-extrabold text-white">
                System Settings
              </Text>
              <Text className="mt-0.5 text-sm font-medium text-white/65">
                Global configuration
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 pb-6 pt-4">
            <SectionTitle>SYSTEM CONTROLS</SectionTitle>
            <ToggleRow
              icon="🟢"
              label="System Online"
              value={systemOnline}
              onValueChange={setSystemOnline}
            />
            <ToggleRow
              icon="🔧"
              label="Maintenance Mode"
              value={maintenanceMode}
              onValueChange={setMaintenanceMode}
            />
            <ToggleRow
              icon="📝"
              label="New Registrations"
              value={newRegistrations}
              onValueChange={setNewRegistrations}
            />

            <SectionTitle>MESSAGING & MODERATION</SectionTitle>
            <ToggleRow
              icon="🔎"
              label="Message Moderation"
              value={messageModeration}
              onValueChange={setMessageModeration}
            />
            <ToggleRow
              icon="🚫"
              label="Profanity Filter"
              value={profanityFilter}
              onValueChange={setProfanityFilter}
            />
            <ToggleRow
              icon="📎"
              label="File Sharing"
              value={fileSharing}
              onValueChange={setFileSharing}
            />
            <ToggleRow
              icon="🤖"
              label="Auto-flag Keywords"
              value={autoFlagKeywords}
              onValueChange={setAutoFlagKeywords}
            />

            <SectionTitle>SECURITY & ACCESS</SectionTitle>
            {securityRows.map((row) => (
              <ValueRow key={row.label} icon={row.icon} label={row.label} value={row.value} />
            ))}
            <ToggleRow
              icon="🛡️"
              label="Force 2FA"
              value={forceTwoFactor}
              onValueChange={setForceTwoFactor}
            />

            <SectionTitle>ACCOUNT</SectionTitle>
            <Pressable
              onPress={() => setLogoutVisible(true)}
              className="mb-3 flex-row items-center justify-between rounded-[22px] border border-red-100 bg-red-50 px-4 py-4 shadow-sm shadow-slate-200"
            >
              <View className="flex-row items-center">
                <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                  <Text className="text-lg">🚪</Text>
                </View>
                <Text className="text-lg font-semibold text-red-500">Logout</Text>
              </View>

              <Text className="text-sm font-semibold text-red-400">›</Text>
            </Pressable>
          </View>
        </ScrollView>

      <BottomNav
          items={[
            { label: 'Home', icon: '🏠', active: true, onPress: () => router.replace('/(admin)/dashboard') },
            { label: 'Users', icon: '👥', onPress: () => router.replace('/(admin)/users') },
            { label: 'Broadcast', icon: '📣', badge: 3, onPress: () => router.replace('/(admin)/broadcast/broad-cast') },
            { label: 'Analytics', icon: '📈', onPress: () => router.replace('/(admin)/analytics/reports-and-analytics') },
            { label: 'Settings', icon: '⚙️', onPress: () => router.replace('/(admin)/settings') },
          ]}
        />
        <LogoutModal
          visible={logoutVisible}
          onCancel={() => setLogoutVisible(false)}
          onConfirm={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
}
