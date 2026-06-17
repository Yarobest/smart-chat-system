import { Module } from '@nestjs/common';
import { AdminReportsService } from './admin-reports.service';
import { AdminReportsController } from './admin-reports.controller';

@Module({
  providers: [AdminReportsService],
  controllers: [AdminReportsController]
})
export class AdminReportsModule {}
