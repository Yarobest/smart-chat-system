import { api } from './api';
import { setSession, updateCurrentUser } from '@/src/stores/authStore';
import { Session, User } from '@/src/types/auth.types';
import { addNotification } from '@/src/stores/notificationStore';

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = LoginInput & {
  name: string;
  confirmPassword: string;
  role: User['role'];
  studentId?: string;
  staffId?: string;
  faculty?: string;
  department?: string;
  programme?: string;
  yearGroup?: string;
  awardType?: string;
};

export const authService = {
  login: async (input: LoginInput) => {
    const session = await api<Session>('/auth/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify(input),
    });
    setSession(session);
    addNotification('New device login', `Signed in as ${session.user.name}`);

    return session;
  },

  register: async (input: RegisterInput) => {
    const session = await api<Session>('/auth/register', {
      method: 'POST',
      auth: false,
      body: JSON.stringify(input),
    });
    setSession(session);
    addNotification('Registration successful', `Welcome, ${session.user.name}`);

    return session;
  },

  me: async () => {
    const response = await api<{ user: User }>('/auth/me');
    updateCurrentUser(response.user);

    return response.user;
  },

  logout: async () => {
    await api<{ ok: boolean }>('/auth/logout', { method: 'POST' }).catch(
      () => null,
    );
    setSession(null);
  },
};
