import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupChatDto {
  @ApiProperty({ example: 'CS 301 Group' })
  title: string;

  @ApiProperty({
    example: ['cmpykntfk0008p81gd6s0q376'],
    type: [String],
  })
  memberIds: string[];
}
