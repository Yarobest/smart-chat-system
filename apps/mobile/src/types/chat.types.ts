import { User } from './auth.types';

export type Message = {
  id: string;
  conversationId?: string;
  text: string;
  senderId: string | null;
  sender?: User;
  isMine?: boolean;
  attachments?: ChatAttachment[];
  seen?: boolean;
  editedAt?: string | null;
  createdAt: string;
};

export type ChatAttachment = {
  type: string;
  name: string;
  mimeType?: string;
  size?: number;
  uri?: string;
};

export type Thread = {
  id: string;
  title: string;
  type?: 'direct' | 'group';
  courseCode?: string | null;
  courseName?: string | null;
  faculty?: string | null;
  department?: string | null;
  programme?: string | null;
  yearGroup?: string | null;
  awardType?: string | null;
  unreadCount: number;
  memberCount?: number;
  members?: {
    role: string;
    joinedAt: string;
    user: User;
  }[];
  lastMessage?: Message | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Group = {
  id: string;
  name: string;
  memberCount: number;
};
