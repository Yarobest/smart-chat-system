import { Role, User } from '@/src/types/auth.types';

type AuthState = {
  user: User | null;
  role: Role | null;
};

export const authStore: AuthState = {
  user: null,
  role: null,
};
