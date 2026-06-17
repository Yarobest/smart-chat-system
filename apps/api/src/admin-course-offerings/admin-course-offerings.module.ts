import { Module } from '@nestjs/common';
import { AdminCourseOfferingsController } from './admin-course-offerings.controller';
import { AdminCourseOfferingsService } from './admin-course-offerings.service';

@Module({
  controllers: [AdminCourseOfferingsController],
  providers: [AdminCourseOfferingsService],
})
export class AdminCourseOfferingsModule {}
