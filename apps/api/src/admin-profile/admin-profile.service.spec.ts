import { Test, TestingModule } from '@nestjs/testing';
import { AdminProfileService } from './admin-profile.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AdminProfileService', () => {
  let service: AdminProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminProfileService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<AdminProfileService>(AdminProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
