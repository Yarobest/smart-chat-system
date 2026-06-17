import { Test, TestingModule } from '@nestjs/testing';
import { AdminCoursesService } from './admin-courses.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AdminCoursesService', () => {
  let service: AdminCoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminCoursesService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<AdminCoursesService>(AdminCoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
