import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchUsersQueryDto {
  @ApiPropertyOptional({ example: 'Ama' })
  search?: string;

  @ApiPropertyOptional({ example: 'Faculty of Applied Sciences and Technology' })
  faculty?: string;

  @ApiPropertyOptional({ example: 'Computer Science' })
  department?: string;

  @ApiPropertyOptional({ example: 'HND Computer Science' })
  programme?: string;

  @ApiPropertyOptional({ example: '2024/2025' })
  yearGroup?: string;

  @ApiPropertyOptional({ enum: ['HND', 'BTech'], example: 'HND' })
  awardType?: string;
}
