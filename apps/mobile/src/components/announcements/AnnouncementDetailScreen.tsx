import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/src/components/common/ScreenHeader';
import { AnnouncementDetail } from '@/src/components/announcements/AnnouncementDetail';

export default function AnnouncementDetailScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader title="Announcement" />
      <AnnouncementDetail title="Exam Timetable Released" body="Exams begin on Jan 20. Follow your department schedule." />
    </SafeAreaView>
  );
}
