import { Role } from '@/src/types/auth.types';

export function roleGuard(role: Role) {
  if (role === 'student') return '/(student)/home';
  if (role === 'lecturer') return '/(lecturer)/home';
  return '/(admin)/dashboard';
}
