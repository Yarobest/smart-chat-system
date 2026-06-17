import { Test, TestingModule } from '@nestjs/testing';
import { AdminCoursesController } from './admin-courses.controller';
import { AdminCoursesService } from './admin-courses.service';

describe('AdminCoursesController', () => {
  let controller: AdminCoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminCoursesController],
      providers: [{ provide: AdminCoursesService, useValue: {} }],
    }).compile();

    controller = module.get<AdminCoursesController>(AdminCoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
