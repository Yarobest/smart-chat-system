import { Module } from '@nestjs/common';
import { AdminCoursesController } from './admin-courses.controller';
import { AdminCoursesService } from './admin-courses.service';

@Module({
  controllers: [AdminCoursesController],
  providers: [AdminCoursesService],
})
export class AdminCoursesModule {}
