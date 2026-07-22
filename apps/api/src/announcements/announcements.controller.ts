import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AnnouncementsService } from './announcements.service';
@ApiTags('Announcements') @ApiBearerAuth() @Controller('announcements')
export class AnnouncementsController {
  constructor(private auth: AuthService, private announcements: AnnouncementsService) {}
  private async user(value?: string) { return (await this.auth.authenticate(value?.startsWith('Bearer ') ? value.slice(7).trim() : undefined)).user; }
  @Get() list(@Headers('authorization') a?: string) { return this.user(a).then((u) => this.announcements.list(u)); }
  @Get('course-offerings') offerings(@Headers('authorization') a?: string) { return this.user(a).then((u) => this.announcements.offerings(u)); }
  @Post() create(@Headers('authorization') a: string | undefined, @Body() b: unknown) { return this.user(a).then((u) => this.announcements.create(u, b)); }
  @Get(':id') detail(@Headers('authorization') a: string | undefined, @Param('id') id: string) { return this.user(a).then((u) => this.announcements.detail(u, id)); }
  @Patch(':id') update(@Headers('authorization') a: string | undefined, @Param('id') id: string, @Body() b: unknown) { return this.user(a).then((u) => this.announcements.update(u, id, b)); }
  @Delete(':id') remove(@Headers('authorization') a: string | undefined, @Param('id') id: string) { return this.user(a).then((u) => this.announcements.remove(u, id)); }
  @Post(':id/read') read(@Headers('authorization') a: string | undefined, @Param('id') id: string) { return this.user(a).then((u) => this.announcements.read(u, id)); }
  @Post(':id/dismiss-alert') dismiss(@Headers('authorization') a: string | undefined, @Param('id') id: string) { return this.user(a).then((u) => this.announcements.dismiss(u, id)); }
}
