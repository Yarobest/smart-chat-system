import { AssignmentFile } from './assignment.types';
export type MaterialType='notes'|'slides'|'reading'|'reference'|'revision';
export type CourseMaterial={id:string;title:string;description?:string|null;type:MaterialType;topic?:string|null;files:AssignmentFile[];version:number;allowDownload:boolean;pinned:boolean;status:'draft'|'published'|'archived';publishedAt?:string|null;createdAt:string;course:{offeringId:string;conversationId?:string|null;code:string;name:string};lecturer:{id:string;name:string};viewCount:number;isNew:boolean;alertDismissed:boolean};
export type MaterialCourse={id:string;courseCode:string;courseName:string;academicYear:string;semester:string};
