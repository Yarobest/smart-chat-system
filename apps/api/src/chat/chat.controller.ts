import { Body, Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { CreateDirectChatDto } from './dto/create-direct-chat.dto';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { SearchUsersQueryDto } from './dto/search-users-query.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatService } from './chat.service';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
  ) {}

  @Get('conversations')
  @ApiOperation({ summary: 'List the current user conversations' })
  @ApiResponse({ status: 200, description: 'Conversations returned' })
  async listConversations(@Headers('authorization') authorization?: string) {
    const { user } = await this.authService.authenticate(
      this.getBearerToken(authorization),
    );

    return this.chatService.listConversations(user.id);
  }

  @Get('users')
  @ApiOperation({ summary: 'Search users to start a direct chat' })
  @ApiResponse({ status: 200, description: 'Matching users returned' })
  async searchUsers(
    @Headers('authorization') authorization: string | undefined,
    @Query() query: SearchUsersQueryDto,
  ) {
    const { user } = await this.authService.authenticate(
      this.getBearerToken(authorization),
    );

    return this.chatService.searchUsers(user.id, query);
  }

  @Post('direct')
  @ApiOperation({ summary: 'Find or create a direct conversation' })
  @ApiBody({ type: CreateDirectChatDto })
  @ApiResponse({ status: 201, description: 'Direct conversation returned' })
  async createDirect(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: CreateDirectChatDto,
  ) {
    const { user } = await this.authService.authenticate(
      this.getBearerToken(authorization),
    );

    return this.chatService.findOrCreateDirectConversation(user.id, body);
  }

  @Post('groups')
  @ApiOperation({ summary: 'Create a group conversation' })
  @ApiBody({ type: CreateGroupChatDto })
  @ApiResponse({ status: 201, description: 'Group conversation created' })
  async createGroup(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: CreateGroupChatDto,
  ) {
    const { user } = await this.authService.authenticate(
      this.getBearerToken(authorization),
    );

    return this.chatService.createGroupConversation(user.id, body);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'List messages in a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation id' })
  @ApiResponse({ status: 200, description: 'Messages returned' })
  async listMessages(
    @Headers('authorization') authorization: string | undefined,
    @Param('id') conversationId: string,
  ) {
    const { user } = await this.authService.authenticate(
      this.getBearerToken(authorization),
    );

    return this.chatService.listMessages(user.id, conversationId);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send a message to a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation id' })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({ status: 201, description: 'Message sent' })
  async sendMessage(
    @Headers('authorization') authorization: string | undefined,
    @Param('id') conversationId: string,
    @Body() body: SendMessageDto,
  ) {
    const { user } = await this.authService.authenticate(
      this.getBearerToken(authorization),
    );

    return this.chatService.sendMessage(user.id, conversationId, body);
  }

  @Post('conversations/:id/typing')
  @ApiOperation({ summary: 'Mark the current user as typing in a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation id' })
  @ApiResponse({ status: 201, description: 'Typing status updated' })
  async setTyping(
    @Headers('authorization') authorization: string | undefined,
    @Param('id') conversationId: string,
  ) {
    const { user } = await this.authService.authenticate(
      this.getBearerToken(authorization),
    );

    return this.chatService.setTyping(user.id, conversationId);
  }

  @Get('conversations/:id/typing')
  @ApiOperation({ summary: 'List users currently typing in a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation id' })
  @ApiResponse({ status: 200, description: 'Typing users returned' })
  async listTyping(
    @Headers('authorization') authorization: string | undefined,
    @Param('id') conversationId: string,
  ) {
    const { user } = await this.authService.authenticate(
      this.getBearerToken(authorization),
    );

    return this.chatService.listTyping(user.id, conversationId);
  }

  private getBearerToken(authorization?: string) {
    if (!authorization?.startsWith('Bearer ')) {
      return undefined;
    }

    return authorization.slice('Bearer '.length).trim();
  }
}
