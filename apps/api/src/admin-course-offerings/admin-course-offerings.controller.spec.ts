import { Test, TestingModule } from '@nestjs/testing';
import { AdminCourseOfferingsController } from './admin-course-offerings.controller';
import { AdminCourseOfferingsService } from './admin-course-offerings.service';

describe('AdminCourseOfferingsController', () => {
  let controller: AdminCourseOfferingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminCourseOfferingsController],
      providers: [{ provide: AdminCourseOfferingsService, useValue: {} }],
    }).compile();

    controller = module.get<AdminCourseOfferingsController>(AdminCourseOfferingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
