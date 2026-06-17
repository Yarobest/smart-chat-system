import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class MessageAttachmentDto {
  @ApiProperty({ example: 'image' })
  type: string;

  @ApiProperty({ example: 'diagram.png' })
  name: string;

  @ApiPropertyOptional({ example: 'image/png' })
  mimeType?: string;

  @ApiPropertyOptional({ example: 204800 })
  size?: number;

  @ApiPropertyOptional({ example: 'file:///local/path/diagram.png' })
  uri?: string;
}

export class SendMessageDto {
  @ApiProperty({ example: 'Hello, is everyone ready for class?', required: false })
  text?: string;

  @ApiPropertyOptional({ type: [MessageAttachmentDto] })
  attachments?: MessageAttachmentDto[];
}
