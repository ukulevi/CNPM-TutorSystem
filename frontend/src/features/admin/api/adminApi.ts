import axios from 'axios';
import { UserProfileData } from '../../../types/adminTypes';

const API_URL = 'http://localhost:3001'; // URL của json-server

/**
 * Lấy danh sách tất cả người dùng trong hệ thống.
 * @returns Promise chứa mảng các hồ sơ người dùng.
 */
export const getAllUsers = async (): Promise<UserProfileData[]> => {
  const response = await axios.get<UserProfileData[]>(`${API_URL}/users`);
  return response.data;
};

/**
 * Cập nhật vai trò cho một người dùng cụ thể.
 * @param userId - ID của người dùng cần cập nhật.
 * @param newRole - Vai trò mới ('student', 'tutor', 'admin', 'academic_dept').
 * @returns Promise chứa thông tin người dùng đã được cập nhật.
 */
export const updateUserRole = async (
  userId: string,
  newRole: UserProfileData['role']
): Promise<UserProfileData> => {
  const response = await axios.patch<UserProfileData>(`${API_URL}/users/${userId}`, {
    role: newRole,
  });
  return response.data;
};