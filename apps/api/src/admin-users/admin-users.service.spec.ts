import { Test, TestingModule } from '@nestjs/testing';
import { AdminUsersService } from './admin-users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AdminUsersService', () => {
  let service: AdminUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminUsersService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<AdminUsersService>(AdminUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
