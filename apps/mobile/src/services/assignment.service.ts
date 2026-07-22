import { api } from './api';
import {
  Assignment,
  AssignmentCourseOffering,
  AssignmentFile,
  AssignmentSubmission,
} from '@/src/types/assignment.types';

export type CreateAssignmentInput = {
  courseOfferingId: string;
  title: string;
  instructions: string;
  dueAt: string;
  totalMarks: number;
  allowFile: boolean;
  allowText: boolean;
  allowLate: boolean;
  allowResubmission: boolean;
  allowedFileTypes: string[];
  maxFileSizeMb: number;
  attachments: AssignmentFile[];
  publish: boolean;
};

export const assignmentService = {
  list: () => api<Assignment[]>('/assignments'),
  detail: (id: string) => api<Assignment>(`/assignments/${id}`),
  courseOfferings: () => api<AssignmentCourseOffering[]>('/assignments/course-offerings'),
  create: (input: CreateAssignmentInput) =>
    api<Assignment>('/assignments', { method: 'POST', body: JSON.stringify(input) }),
  updateStatus: (id: string, status: Assignment['status']) =>
    api<Assignment>(`/assignments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  update: (id: string, input: Partial<CreateAssignmentInput>) =>
    api<Assignment>(`/assignments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  remove: (id: string) => api<{ deleted: true; id: string }>(`/assignments/${id}`, { method: 'DELETE' }),
  dismissAlert: (id: string) => api<{ dismissed: true; id: string }>(`/assignments/${id}/dismiss-alert`, { method: 'POST' }),
  submit: (id: string, textResponse: string, attachments: AssignmentFile[]) =>
    api<AssignmentSubmission>(`/assignments/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ textResponse, attachments }),
    }),
  submissions: (id: string) =>
    api<{
      assignment: Assignment;
      students: { student: { id: string; name: string; studentId?: string | null }; submission: AssignmentSubmission | null; submissions: AssignmentSubmission[] }[];
    }>(`/assignments/${id}/submissions`),
  grade: (assignmentId: string, submissionId: string, score: number, feedback: string, release = true) =>
    api<AssignmentSubmission>(`/assignments/${assignmentId}/submissions/${submissionId}/grade`, {
      method: 'PATCH',
      body: JSON.stringify({ score, feedback, release }),
    }),
  uploadFile: async (file: { uri: string; name: string; mimeType?: string | null }) => {
    const form = new FormData();
    form.append('file', { uri: file.uri, name: file.name, type: file.mimeType ?? 'application/octet-stream' } as any);
    return api<AssignmentFile>('/assignments/files', { method: 'POST', body: form });
  },
};
