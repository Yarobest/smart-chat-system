import { Controller, Get, Headers, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly auth: AuthService, private readonly notifications: NotificationsService) {}

  @Get()
  async list(@Headers('authorization') authorization?: string) {
    const { user } = await this.auth.authenticate(this.token(authorization));
    return this.notifications.list(user);
  }

  @Patch('read')
  async read(@Headers('authorization') authorization?: string) {
    const { user } = await this.auth.authenticate(this.token(authorization));
    return this.notifications.markAllRead(user);
  }

  private token(authorization?: string) {
    return authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : undefined;
  }
}
