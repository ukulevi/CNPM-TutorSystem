import { DashboardStats, AcademicReport } from '../../../types/adminTypes';

const API_URL = 'http://localhost:3001/api/admin';

/**
 * Lấy các số liệu thống kê tổng quan cho Dashboard.
 * @returns Các chỉ số chính: tổng người dùng, tổng lịch hẹn, rating trung bình.
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Tạo báo cáo học thuật, nhóm theo từng khoa.
 * @returns Một mảng các đối tượng báo cáo cho mỗi khoa.
 */
export const getAcademicReport = async (): Promise<AcademicReport[]> => {
  try {
    const response = await fetch(`${API_URL}/academic-report`);
    if (!response.ok) throw new Error('Failed to fetch academic report');
    return await response.json();
  } catch (error) {
    console.error('Error fetching academic report:', error);
    throw error;
  }
};