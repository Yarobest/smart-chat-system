import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { AuditItem } from '@/src/components/admin/AuditItem';

export default function AuditLogScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Audit Log" />
      <ScrollView className="p-4">
        <AuditItem action="Deleted account" actor="Admin A" />
        <AuditItem action="Posted announcement" actor="Lecturer B" />
      </ScrollView>
    </SafeAreaView>
  );
}
