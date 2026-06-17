import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Ama Student' })
  name: string;

  @ApiProperty({ example: 'ama.student@example.com' })
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  password: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  confirmPassword: string;

  @ApiPropertyOptional({
    enum: ['student', 'lecturer', 'admin'],
    example: 'student',
  })
  role?: string;

  @ApiPropertyOptional({ example: '0323080542' })
  studentId?: string;

  @ApiPropertyOptional({ example: 'STAFF-001' })
  staffId?: string;

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
