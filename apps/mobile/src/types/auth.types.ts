export type Role = 'student' | 'lecturer' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  studentId?: string | null;
  staffId?: string | null;
  faculty?: string | null;
  department?: string | null;
  programme?: string | null;
  yearGroup?: string | null;
  awardType?: string | null;
  avatarUrl?: string | null;
  isOnline?: boolean;
  lastSeenAt?: string | null;
  createdAt?: string;
};

export type Session = {
  token: string;
  user: User;
};
