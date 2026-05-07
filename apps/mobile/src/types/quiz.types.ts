export type QuestionStatus = 'correct' | 'incorrect' | 'skipped';

export type Question = {
  id: number;
  text: string;
  userAnswer?: string;
  correctAnswer: string;
  status: QuestionStatus;
};

export type QuizResult = {
  id: string;
  title: string;
  courseCode: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  timeTaken: number; // in seconds
  percentage: number;
  questions: Question[];
  submittedAt: string;
  userRank: number;
  totalParticipants: number;
};

export type LeaderboardEntry = {
  rank: number;
  studentName: string;
  studentId: string;
  score: number;
  percentage: number;
  avatar?: string;
};
