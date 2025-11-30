import { User } from './index';

export type UserProfileData = User;

export interface DashboardStats {
  totalUsers: number;
  totalAppointments: number;
  averageRating: number;
}

export interface AcademicReport {
  departmentName: string;
  totalSessions: number;
  avgRating: number;
}
