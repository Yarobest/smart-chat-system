import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { UserRow } from '@/src/components/admin/UserRow';

export default function UserManagementScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="User Management" />
      <ScrollView className="p-4">
        <UserRow name="Stephen Appiah" role="Student" />
        <UserRow name="Dr. Mensah" role="Lecturer" />
      </ScrollView>
    </SafeAreaView>
  );
}
