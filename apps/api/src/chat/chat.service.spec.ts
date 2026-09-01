import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('hides the real sender and softens time for group messages', () => {
    const createdAt = new Date('2026-09-01T10:37:00.000Z');
    const message = {
      id: 'message-1234',
      conversationId: 'conversation-1',
      senderId: null,
      anonymousSenderId: 'anon-random',
      anonymousSenderName: 'Anonymous 4821',
      text: 'Please explain this topic again',
      metadata: null,
      editedAt: null,
      deletedAt: null,
      createdAt,
      updatedAt: createdAt,
      sender: null,
    };

    const response = (service as any).toMessageResponse(
      message,
      false,
      'student-real-id',
      true,
    );

    expect(response.senderId).toBeNull();
    expect(response.isMine).toBe(false);
    expect(response.sender).toEqual({
      id: 'anon-random',
      name: 'Anonymous 4821',
      role: 'anonymous',
    });
    expect(response.createdAt).toBe('2026-09-01T10:30:00.000Z');
  });
});
