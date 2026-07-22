import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { AdminSettingsModule } from './admin-settings/admin-settings.module';
import { AdminProfileModule } from './admin-profile/admin-profile.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
import { AdminReportsModule } from './admin-reports/admin-reports.module';
import { AdminCoursesModule } from './admin-courses/admin-courses.module';
import { AdminCourseOfferingsModule } from './admin-course-offerings/admin-course-offerings.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { MaterialsModule } from './materials/materials.module';
import { AnnouncementsModule } from './announcements/announcements.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ChatModule,
    AdminDashboardModule,
    AdminUsersModule,
    AdminReportsModule,
    AdminSettingsModule,
    AdminProfileModule,
    AdminCoursesModule,
    AdminCourseOfferingsModule,
    AssignmentsModule,
    NotificationsModule,
    QuizzesModule,
    MaterialsModule,
    AnnouncementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
