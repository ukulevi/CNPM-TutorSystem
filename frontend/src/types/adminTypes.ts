import { User } from './index';

export type UserProfileData = User;

export interface AcademicReport {
  departmentId: string;
  departmentName: string;
  totalSessions: number;
  avgRating: number;
}
