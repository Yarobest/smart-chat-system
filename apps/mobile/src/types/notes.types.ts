export type NotePage = {
  id: number;
  title: string;
  content: string;
  keyConceptTitle?: string;
  keyConceptDescription?: string;
  hasImage?: boolean;
};

export type LectureNote = {
  id: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  chapter: string;
  uploadedBy: string;
  uploadedDate: string;
  totalPages: number;
  tags: string[];
  pages: NotePage[];
  pdfUrl?: string;
};
