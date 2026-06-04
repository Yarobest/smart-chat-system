import { Role, Session, User } from '@/src/types/auth.types';

type AuthState = {
  user: User | null;
  role: Role | null;
  session: Session | null;
};

export const authStore: AuthState = {
  user: null,
  role: null,
  session: null,
};

const listeners = new Set<() => void>();
let snapshot = {
  isAuthenticated: false,
  role: null as Role | null,
  user: null as User | null,
  token: null as string | null,
};
const serverSnapshot = snapshot;

export function setSession(session: Session | null) {
  authStore.session = session;
  authStore.user = session?.user ?? null;
  authStore.role = session?.user.role ?? null;
  snapshot = {
    isAuthenticated: Boolean(session?.token),
    role: authStore.role,
    user: authStore.user,
    token: session?.token ?? null,
  };
  listeners.forEach((listener) => listener());
}

export function updateCurrentUser(user: User) {
  if (!authStore.session) {
    setSession({ token: '', user });
    return;
  }

  setSession({ ...authStore.session, user });
}

export function subscribeAuthStore(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAuthSnapshot() {
  return snapshot;
}

export function getServerAuthSnapshot() {
  return serverSnapshot;
}
