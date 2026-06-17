import { Controller, Get } from '@nestjs/common';
import { AdminSettingsService } from './admin-settings.service';

@Controller('admin/settings')
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @Get()
  findAll() {
    return this.adminSettingsService.findAll();
  }
}
