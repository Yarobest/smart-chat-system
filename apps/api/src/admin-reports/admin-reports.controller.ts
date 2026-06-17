import { Controller, Get } from '@nestjs/common';
import { AdminReportsService } from './admin-reports.service';

@Controller('admin/reports')
export class AdminReportsController {
  constructor(private readonly adminReportsService: AdminReportsService) {}

  @Get()
  findAll() {
    return this.adminReportsService.findAll();
  }
}
