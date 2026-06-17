import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getCourseTemplates } from '../academics/course-catalog';

@Injectable()
export class AdminSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const [faculties, departments, programmes, yearGroups, awardTypes] =
      await Promise.all([
        this.prisma.user.findMany({
          distinct: ['faculty'],
          where: { faculty: { not: null } },
          select: { faculty: true },
          orderBy: { faculty: 'asc' },
        }),
        this.prisma.user.findMany({
          distinct: ['department'],
          where: { department: { not: null } },
          select: { department: true },
          orderBy: { department: 'asc' },
        }),
        this.prisma.user.findMany({
          distinct: ['programme'],
          where: { programme: { not: null } },
          select: { programme: true },
          orderBy: { programme: 'asc' },
        }),
        this.prisma.user.findMany({
          distinct: ['yearGroup'],
          where: { yearGroup: { not: null } },
          select: { yearGroup: true },
          orderBy: { yearGroup: 'asc' },
        }),
        this.prisma.user.findMany({
          distinct: ['awardType'],
          where: { awardType: { not: null } },
          select: { awardType: true },
          orderBy: { awardType: 'asc' },
        }),
      ]);

    return {
      api: {
        port: 4001,
        docsPath: '/docs',
        databaseConnected: true,
      },
      options: {
        faculties: faculties.map((item) => item.faculty).filter(Boolean),
        departments: departments
          .map((item) => item.department)
          .filter(Boolean),
        programmes: programmes.map((item) => item.programme).filter(Boolean),
        yearGroups: yearGroups.map((item) => item.yearGroup).filter(Boolean),
        awardTypes: awardTypes.map((item) => item.awardType).filter(Boolean),
      },
      sampleCourses: getCourseTemplates(
        awardTypes[0]?.awardType ?? 'HND',
        programmes[0]?.programme ?? 'Computer Science',
        yearGroups[0]?.yearGroup ?? 'Level 100',
      ),
    };
  }
}
