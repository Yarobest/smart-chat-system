import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminBroadcastsController } from './admin-broadcasts.controller';
import { AdminBroadcastsService } from './admin-broadcasts.service';

@Module({
  imports: [AuthModule],
  controllers: [AdminBroadcastsController],
  providers: [AdminBroadcastsService],
})
export class AdminBroadcastsModule {}
