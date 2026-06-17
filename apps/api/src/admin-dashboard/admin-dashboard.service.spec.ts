import { Test, TestingModule } from '@nestjs/testing';
import { AdminDashboardService } from './admin-dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AdminDashboardService', () => {
  let service: AdminDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminDashboardService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<AdminDashboardService>(AdminDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
