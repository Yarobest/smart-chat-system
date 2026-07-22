export type AssignmentFile = {
  id?: string;
  name: string;
  uri: string;
  type?: string;
  size?: number;
};

export type AssignmentSubmission = {
  id: string;
  textResponse?: string | null;
  attachments: AssignmentFile[];
  status: 'submitted' | 'late' | 'graded';
  version: number;
  submittedAt: string;
  score?: number | null;
  feedback?: string | null;
  gradedAt?: string | null;
  releasedAt?: string | null;
  student?: { id: string; name: string; studentId?: string | null };
};

export type Assignment = {
  id: string;
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
  status: 'draft' | 'published' | 'closed' | 'archived';
  publishedAt?: string | null;
  createdAt: string;
  course: {
    offeringId: string;
    conversationId?: string | null;
    code: string;
    name: string;
    academicYear: string;
    semester: string;
  };
  lecturer: { id: string; name: string };
  submissionCount: number;
  submission?: AssignmentSubmission | null;
  recordedScore?: number | null;
  recordedGradeVersion?: number | null;
  recordedFeedback?: string | null;
  alertDismissed?: boolean;
};

export type AssignmentCourseOffering = {
  id: string;
  courseCode: string;
  courseName: string;
  academicYear: string;
  semester: string;
  programme?: string | null;
  yearGroup?: string | null;
};
