import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminCoursesService } from './admin-courses.service';

@Controller('admin/courses')
export class AdminCoursesController {
  constructor(private readonly adminCoursesService: AdminCoursesService) {}

  @Get()
  findAll() {
    return this.adminCoursesService.findAll();
  }

  @Post()
  create(@Body() body: unknown) {
    return this.adminCoursesService.create(body);
  }
}
