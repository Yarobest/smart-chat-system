import { api } from './api';

export type AdminDashboard = {
  stats: {
    totalUsers: number;
    students: number;
    lecturers: number;
    admins: number;
    onlineUsers: number;
    conversations: number;
    messages: number;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    faculty: string | null;
    department: string | null;
    createdAt: string;
  }>;
  recentMessages: Array<{
    id: string;
    text: string;
    senderName: string;
    conversationTitle: string;
    createdAt: string;
  }>;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  studentId: string | null;
  staffId: string | null;
  faculty: string | null;
  department: string | null;
  programme: string | null;
  yearGroup: string | null;
  awardType: string | null;
  avatarUrl?: string | null;
  isOnline: boolean;
  lastSeenAt: string | null;
  createdAt: string;
};

export type AdminUsersResponse = {
  total: number;
  users: AdminUser[];
};

export type AdminUserDetails = {
  user: AdminUser;
  stats: {
    messages: number;
    conversations: number;
  };
};

export type AdminProfileResponse = {
  profile: AdminUser | null;
  message?: string;
};

export type AdminCourse = {
  id: string;
  code: string;
  name: string;
  faculty?: string | null;
  department?: string | null;
  programme?: string | null;
  awardType?: string | null;
  yearGroup?: string | null;
  lecturerId?: string | null;
  isActive: boolean;
};

export type AdminCourseOffering = {
  id: string;
  status: string;
  academicYear: string;
  semester: string;
  course: AdminCourse;
  lecturer: {
    id: string;
    name: string;
    email: string;
  };
  group: {
    id: string | null;
    title: string | null;
    memberCount: number;
  };
};

export type CreateAdminCourseInput = {
  code: string;
  name: string;
  lecturerId: string;
  creditHours?: string;
  description?: string;
};

export type CreateCourseOfferingInput = {
  courseId: string;
  academicYear: string;
  semester: string;
  faculty: string;
  department: string;
  programme: string;
  awardType: string;
  yearGroup: string;
};

export const adminService = {
  dashboard: () => api<AdminDashboard>('/admin/dashboard'),
  users: () => api<AdminUsersResponse>('/admin/users'),
  user: (id: string) => api<AdminUserDetails>(`/admin/users/${id}`),
  profile: () => api<AdminProfileResponse>('/admin/profile'),
  courses: () => api<{ courses: AdminCourse[] }>('/admin/courses'),
  lecturers: () => api<AdminUsersResponse>('/admin/users?role=lecturer'),
  offerings: () =>
    api<{ offerings: AdminCourseOffering[] }>('/admin/course-offerings'),
  createCourse: (input: CreateAdminCourseInput) =>
    api<{ course: AdminCourse }>('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  createOffering: (input: CreateCourseOfferingInput) =>
    api<{ offering: AdminCourseOffering }>('/admin/course-offerings', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
};
