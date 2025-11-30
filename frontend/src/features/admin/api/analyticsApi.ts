import axios from 'axios';
import { DashboardStats, AcademicReport } from '@/types/adminTypes';

const API_URL = 'http://localhost:3001/api/admin';

/**
 * Lấy các số liệu thống kê tổng quan cho Dashboard.
 * @returns Các chỉ số chính: tổng người dùng, tổng lịch hẹn, rating trung bình.
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axios.get<DashboardStats>(`${API_URL}/stats`);
  return response.data;
};

/**
 * Tạo báo cáo học thuật, nhóm theo từng khoa.
 * @returns Một mảng các đối tượng báo cáo cho mỗi khoa.
 */
export const getAcademicReport = async (): Promise<AcademicReport[]> => {
    const response = await axios.get<AcademicReport[]>(`${API_URL}/academic-report`);
    return response.data;
};