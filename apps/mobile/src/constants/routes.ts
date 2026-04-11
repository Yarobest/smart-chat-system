export const Routes = {
  LOGIN: '/(auth)/login',
  REGISTER: '/(auth)/register',
  FORGOT_PASSWORD: '/(auth)/forgot-password',
  STUDENT_HOME: '/(student)/home',
  STUDENT_CHATS: '/(student)/chats',
  STUDENT_ANNOUNCEMENTS: '/(student)/announcements',
  STUDENT_PROFILE: '/(student)/profile',
  LECTURER_HOME: '/(lecturer)/home',
  LECTURER_CHATS: '/(lecturer)/chats',
  LECTURER_ANNOUNCEMENTS: '/(lecturer)/announcements',
  LECTURER_PROFILE: '/(lecturer)/profile',
  ADMIN_DASHBOARD: '/(admin)/dashboard',
} as const;
