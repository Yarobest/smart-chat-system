import { api } from './api';
import { Announcement, AnnouncementCourse, AnnouncementPriority } from '@/src/types/announcement.types';
import { AssignmentFile } from '@/src/types/assignment.types';
export const announcementService = {
  list:()=>api<Announcement[]>('/announcements'), detail:(id:string)=>api<Announcement>(`/announcements/${id}`), offerings:()=>api<AnnouncementCourse[]>('/announcements/course-offerings'),
  create:(input:{courseOfferingId:string;title:string;body:string;priority:AnnouncementPriority;attachments:AssignmentFile[];pinned:boolean;publish:boolean})=>api<Announcement>('/announcements',{method:'POST',body:JSON.stringify(input)}),
  update:(id:string,input:Record<string,unknown>)=>api<Announcement>(`/announcements/${id}`,{method:'PATCH',body:JSON.stringify(input)}), remove:(id:string)=>api(`/announcements/${id}`,{method:'DELETE'}), read:(id:string)=>api(`/announcements/${id}/read`,{method:'POST'}), dismiss:(id:string)=>api(`/announcements/${id}/dismiss-alert`,{method:'POST'}),
};
