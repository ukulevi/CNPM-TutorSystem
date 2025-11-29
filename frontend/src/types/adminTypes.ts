export interface AppointmentStatistic {
  total: number;
  completed: number;
  booked: number;
  cancelled: number;
  [key: string]: number; // To allow for other dynamic keys
}

export interface DepartmentStatistic {
  departmentName: string;
  tutorCount: number;
  studentCount: number;
}

export interface DepartmentReportData {
  departmentName: string;
  totalSessions: number;
  avgRating: number;
}

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  role: 'tutor' | 'student' | 'admin';
  department: string;
  avatar?: string;
  // Tutor-specific
  specialization?: string;
  rating?: number | null;
  // Student-specific
  major?: string;
  cohort?: string;
}

export interface AcademicReport {
  id: string;
  title: string;
  generatedDate: string;
  departmentName?: string; // Optional: For department-specific reports
  avgRating?: number | null; // Optional: For department-specific reports
  data: AppointmentStatistic | DepartmentStatistic[] | UserProfileData[] | DepartmentReportData[] | null;
}