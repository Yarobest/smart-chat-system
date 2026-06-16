import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'student@example.com' })
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  password: string;
}
