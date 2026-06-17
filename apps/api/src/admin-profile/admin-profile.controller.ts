import { Controller, Get } from '@nestjs/common';
import { AdminProfileService } from './admin-profile.service';

@Controller('admin/profile')
export class AdminProfileController {
  constructor(private readonly adminProfileService: AdminProfileService) {}

  @Get()
  findAll() {
    return this.adminProfileService.findAll();
  }
}
