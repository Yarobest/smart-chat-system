import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminCourseOfferingsService } from './admin-course-offerings.service';

@Controller('admin/course-offerings')
export class AdminCourseOfferingsController {
  constructor(
    private readonly adminCourseOfferingsService: AdminCourseOfferingsService,
  ) {}

  @Get()
  findAll() {
    return this.adminCourseOfferingsService.findAll();
  }

  @Post()
  create(@Body() body: unknown) {
    return this.adminCourseOfferingsService.create(body);
  }
}
