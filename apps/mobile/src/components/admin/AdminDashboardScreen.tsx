import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { AdminStatCard } from '@/src/components/admin/AdminStatCard';

export default function AdminDashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Admin Dashboard" />
      <View className="flex-row gap-3 p-4">
        <AdminStatCard title="Users" value="2,340" />
        <AdminStatCard title="Reports" value="14" />
      </View>
    </SafeAreaView>
  );
}
