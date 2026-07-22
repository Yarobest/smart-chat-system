import { Controller, Get, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AdminAnalyticsService } from './admin-analytics.service';
@ApiTags('Admin Analytics')
@ApiBearerAuth()
@Controller('admin/analytics')
export class AdminAnalyticsController {
  constructor(
    private auth: AuthService,
    private analytics: AdminAnalyticsService,
  ) {}
  @Get() async get(@Headers('authorization') a?: string) {
    const u = (
      await this.auth.authenticate(
        a?.startsWith('Bearer ') ? a.slice(7).trim() : undefined,
      )
    ).user;
    return this.analytics.get(u);
  }
}
