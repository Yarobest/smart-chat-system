import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { BroadcastsService } from './broadcasts.service';
@ApiTags('Institutional Broadcasts')
@ApiBearerAuth()
@Controller('broadcasts')
export class BroadcastsController {
  constructor(
    private auth: AuthService,
    private broadcasts: BroadcastsService,
  ) {}
  private async user(a?: string) {
    return (
      await this.auth.authenticate(
        a?.startsWith('Bearer ') ? a.slice(7).trim() : undefined,
      )
    ).user;
  }
  @Get() list(@Headers('authorization') a?: string) {
    return this.user(a).then((u) => this.broadcasts.list(u));
  }
  @Post('audience-count') count(
    @Headers('authorization') a: string | undefined,
    @Body() b: unknown,
  ) {
    return this.user(a).then((u) => this.broadcasts.audienceCount(u, b));
  }
  @Post() create(
    @Headers('authorization') a: string | undefined,
    @Body() b: unknown,
  ) {
    return this.user(a).then((u) => this.broadcasts.create(u, b));
  }
  @Get(':id') detail(
    @Headers('authorization') a: string | undefined,
    @Param('id') id: string,
  ) {
    return this.user(a).then((u) => this.broadcasts.detail(u, id));
  }
  @Patch(':id') update(
    @Headers('authorization') a: string | undefined,
    @Param('id') id: string,
    @Body() b: unknown,
  ) {
    return this.user(a).then((u) => this.broadcasts.update(u, id, b));
  }
  @Delete(':id') remove(
    @Headers('authorization') a: string | undefined,
    @Param('id') id: string,
  ) {
    return this.user(a).then((u) => this.broadcasts.remove(u, id));
  }
  @Post(':id/publish') publish(
    @Headers('authorization') a: string | undefined,
    @Param('id') id: string,
  ) {
    return this.user(a).then((u) => this.broadcasts.publish(u, id));
  }
  @Post(':id/read') read(
    @Headers('authorization') a: string | undefined,
    @Param('id') id: string,
  ) {
    return this.user(a).then((u) => this.broadcasts.read(u, id));
  }
  @Post(':id/dismiss-alert') dismiss(
    @Headers('authorization') a: string | undefined,
    @Param('id') id: string,
  ) {
    return this.user(a).then((u) => this.broadcasts.dismiss(u, id));
  }
}
