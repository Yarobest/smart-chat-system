import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminCourseOfferingsService.findOne(id);
  }

  @Post()
  create(@Body() body: unknown) {
    return this.adminCourseOfferingsService.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminCourseOfferingsService.remove(id);
  }
}
