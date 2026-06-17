import { Controller, Get } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';

@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get()
  findAll() {
    return this.adminDashboardService.findAll();
  }
}
