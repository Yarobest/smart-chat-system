import { api } from './api';
import { Quiz, QuizAttempt, QuizCourse, QuizQuestionInput } from '@/src/types/quiz.types';

export const quizService = {
  list: () => api<Quiz[]>('/quizzes'),
  detail: (id: string) => api<Quiz>(`/quizzes/${id}`),
  offerings: () => api<QuizCourse[]>('/quizzes/course-offerings'),
  create: (input: { courseOfferingId: string; title: string; instructions: string; startAt: string; endAt: string; durationMinutes: number; maxAttempts: number; shuffleQuestions: boolean; shuffleAnswers: boolean; questions: QuizQuestionInput[]; publish: boolean }) => api<Quiz>('/quizzes', { method: 'POST', body: JSON.stringify(input) }),
  updateStatus: (id: string, status: Quiz['status']) => api<Quiz>(`/quizzes/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  update: (id: string, input: Record<string, unknown>) => api<Quiz>(`/quizzes/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  remove: (id: string) => api<{ deleted: true; id: string }>(`/quizzes/${id}`, { method: 'DELETE' }),
  start: (id: string) => api<QuizAttempt>(`/quizzes/${id}/start`, { method: 'POST' }),
  answer: (attemptId: string, questionId: string, answer: unknown) => api(`/quizzes/attempts/${attemptId}/answer`, { method: 'PATCH', body: JSON.stringify({ questionId, answer }) }),
  submit: (attemptId: string) => api<QuizAttempt>(`/quizzes/attempts/${attemptId}/submit`, { method: 'POST' }),
  attempts: (id: string) => api<any>(`/quizzes/${id}/attempts`),
  grade: (quizId: string, attemptId: string, answerId: string, marks: number, feedback: string) => api(`/quizzes/${quizId}/attempts/${attemptId}/answers/${answerId}/grade`, { method: 'PATCH', body: JSON.stringify({ marks, feedback }) }),
  release: (id: string) => api(`/quizzes/${id}/release`, { method: 'POST' }),
};
