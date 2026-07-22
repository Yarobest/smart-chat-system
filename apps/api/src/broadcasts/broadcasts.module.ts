import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BroadcastsController } from './broadcasts.controller';
import { BroadcastsService } from './broadcasts.service';
import { AdminAnalyticsController } from './admin-analytics.controller';
import { AdminAnalyticsService } from './admin-analytics.service';
@Module({
  imports: [AuthModule],
  controllers: [BroadcastsController, AdminAnalyticsController],
  providers: [BroadcastsService, AdminAnalyticsService],
})
export class BroadcastsModule {}
