import { api } from './api';
import { ChatAttachment, Message, Thread } from '@/src/types/chat.types';
import { User } from '@/src/types/auth.types';
import { addNotification } from '@/src/stores/notificationStore';

type SearchUsersInput = {
  search?: string;
  faculty?: string;
  department?: string;
  programme?: string;
  yearGroup?: string;
  awardType?: string;
};

export const chatService = {
  listThreads: async () => api<Thread[]>('/chat/conversations'),

  listMessages: async (conversationId: string) =>
    api<Message[]>(`/chat/conversations/${conversationId}/messages`),

  sendMessage: async (
    conversationId: string,
    text: string,
    attachments: ChatAttachment[] = [],
  ) => {
    const message = await api<Message>(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text, attachments }),
    });
    addNotification('Message sent', text || 'Attachment sent');

    return message;
  },

  createDirect: async (userId: string) =>
    api<Thread>('/chat/direct', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  createGroup: async (title: string, memberIds: string[]) =>
    api<Thread>('/chat/groups', {
      method: 'POST',
      body: JSON.stringify({ title, memberIds }),
    }),

  setTyping: async (conversationId: string) =>
    api<{ ok: boolean }>(`/chat/conversations/${conversationId}/typing`, {
      method: 'POST',
    }),

  listTyping: async (conversationId: string) =>
    api<{ users: { id: string; name: string }[] }>(
      `/chat/conversations/${conversationId}/typing`,
    ),

  searchUsers: async (filters: SearchUsersInput) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    const query = params.toString();
    return api<User[]>(`/chat/users${query ? `?${query}` : ''}`);
  },
};
