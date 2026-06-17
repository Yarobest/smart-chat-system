import { Test, TestingModule } from '@nestjs/testing';
import { AdminCourseOfferingsService } from './admin-course-offerings.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AdminCourseOfferingsService', () => {
  let service: AdminCourseOfferingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminCourseOfferingsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<AdminCourseOfferingsService>(AdminCourseOfferingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
