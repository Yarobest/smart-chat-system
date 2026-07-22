import { AssignmentFile } from './assignment.types';
export type AnnouncementPriority = 'normal' | 'important' | 'urgent';
export type Announcement = { id:string; title:string; body:string; priority:AnnouncementPriority; attachments:AssignmentFile[]; pinned:boolean; status:'draft'|'published'|'archived'; publishedAt?:string|null; createdAt:string; updatedAt:string; course:{offeringId:string;conversationId?:string|null;code:string;name:string}; lecturer:{id:string;name:string}; readCount:number; isRead:boolean; alertDismissed:boolean };
export type AnnouncementCourse = { id:string;courseCode:string;courseName:string;academicYear:string;semester:string };
