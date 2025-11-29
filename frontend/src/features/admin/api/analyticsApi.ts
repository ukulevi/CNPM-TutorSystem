import axios from 'axios';
import { UserProfileData, AcademicReport } from '@/types/adminTypes';

const API_URL = 'http://localhost:3001';

// --- Interfaces cho dữ liệu trả về ---

interface Appointment {
  id: string;
  status: 'completed' | 'booked' | 'cancelled';
  [key: string]: any;
}

interface Evaluation {
  id: string;
  tutorId: string;
  rating: number;
  [key: string]: any;
}

export interface DashboardStats {
  totalUsers: number;
  totalAppointments: number;
  averageRating: number;
}

// --- API Functions ---

/**
 * Lấy các số liệu thống kê tổng quan cho Dashboard.
 * @returns Các chỉ số chính: tổng người dùng, tổng lịch hẹn, rating trung bình.
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const [usersRes, appointmentsRes, evaluationsRes] = await Promise.all([
    axios.get<UserProfileData[]>(`${API_URL}/users`),
    axios.get<Appointment[]>(`${API_URL}/appointments`),
    axios.get<Evaluation[]>(`${API_URL}/evaluations`),
  ]);

  const evaluations = evaluationsRes.data;

  // Tính rating trung bình từ tất cả các đánh giá
  const totalRating = evaluations.reduce((sum: number, evalItem: Evaluation) => sum + evalItem.rating, 0);
  const averageRating = evaluations.length > 0 ? parseFloat((totalRating / evaluations.length).toFixed(1)) : 0;

  return {
    totalUsers: usersRes.data.length,
    totalAppointments: appointmentsRes.data.length,
    averageRating: averageRating,
  };
};

/**
 * Tạo báo cáo học thuật, nhóm theo từng khoa.
 * @returns Một mảng các đối tượng báo cáo cho mỗi khoa.
 */
export const getAcademicReport = async (): Promise<Omit<AcademicReport, 'departmentId'>[]> => {
  const [tutorsRes, evaluationsRes] = await Promise.all([
    axios.get<UserProfileData[]>(`${API_URL}/users?role=tutor`),
    axios.get<Evaluation[]>(`${API_URL}/evaluations`),
  ]);

  const tutors = tutorsRes.data;
  const evaluations = evaluationsRes.data;

  // Tạo một map từ tutorId sang department
  const tutorDepartmentMap = new Map<string, string>();
  tutors.forEach((tutor: UserProfileData) => {
    if (tutor.department) {
      tutorDepartmentMap.set(tutor.id, tutor.department);
    }
  });

  // Nhóm các đánh giá theo khoa
  const reportByDepartment: { [key: string]: { totalRating: number; count: number } } = {};

  evaluations.forEach((evaluation: Evaluation) => {
    const department = tutorDepartmentMap.get(evaluation.tutorId);
    if (department) {
      if (!reportByDepartment[department]) {
        reportByDepartment[department] = { totalRating: 0, count: 0 };
      }
      reportByDepartment[department].totalRating += evaluation.rating;
      reportByDepartment[department].count++;
    }
  });

  // Chuyển đổi đối tượng đã nhóm thành mảng kết quả
  const reports: Omit<AcademicReport, 'departmentId'>[] = Object.entries(reportByDepartment).map(([departmentName, stats]) => {
    const avgRating = parseFloat((stats.totalRating / stats.count).toFixed(1));
    return {
      id: `report-${departmentName.replace(/\s+/g, '-')}`, // Tạo ID duy nhất cho báo cáo
      title: `Báo cáo học thuật Khoa ${departmentName}`,
      generatedDate: new Date().toISOString(),
      departmentName: departmentName,
      avgRating: avgRating,
      data: [{ departmentName, totalSessions: stats.count, avgRating }], // Gói dữ liệu thống kê vào trường data
    };
  });

  return reports;
};