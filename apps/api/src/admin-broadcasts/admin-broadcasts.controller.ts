import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { AdminBroadcastsService } from './admin-broadcasts.service';

type CreateBroadcastBody = {
  title?: string;
  message?: string;
  audience?: string;
  priority?: string;
};

@ApiTags('Admin Broadcasts')
@ApiBearerAuth()
@Controller('admin/broadcasts')
export class AdminBroadcastsController {
  constructor(
    private readonly authService: AuthService,
    private readonly broadcastsService: AdminBroadcastsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List admin campus broadcasts' })
  findAll() {
    return this.broadcastsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Send a campus broadcast' })
  async create(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: CreateBroadcastBody,
  ) {
    const session = await this.authService.authenticate(
      this.getBearerToken(authorization),
    );

    if (session.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can send broadcasts');
    }

    const broadcast = await this.broadcastsService.create(body, session.user.id);

    return { broadcast };
  }

  private getBearerToken(authorization?: string) {
    if (!authorization?.startsWith('Bearer ')) {
      return undefined;
    }

    return authorization.slice('Bearer '.length).trim();
  }
}
