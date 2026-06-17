import { ApiProperty } from '@nestjs/swagger';

export class CreateDirectChatDto {
  @ApiProperty({ example: 'cmpykntfk0008p81gd6s0q376' })
  userId: string;
}
