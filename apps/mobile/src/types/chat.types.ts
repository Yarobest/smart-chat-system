export type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
};

export type Thread = {
  id: string;
  title: string;
  unreadCount: number;
};

export type Group = {
  id: string;
  name: string;
  memberCount: number;
};
