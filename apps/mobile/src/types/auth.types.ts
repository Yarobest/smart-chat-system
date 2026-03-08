export type Role = 'student' | 'lecturer' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Session = {
  token: string;
  user: User;
};
