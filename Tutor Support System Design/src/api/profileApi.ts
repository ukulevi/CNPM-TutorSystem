import { UserRole } from "../types";
import db from '../../db.json';

/**
 * Giả lập việc lấy thông tin hồ sơ của một người dùng bằng ID
 * @param userId ID của người dùng cần lấy hồ sơ
 * @returns Thông tin hồ sơ hoặc null nếu không tìm thấy
 */
export const getUserProfile = async (userId: string): Promise<any | null> => { // @ts-ignore
  const profile = db.profiles.find(p => p.id === userId);
  return Promise.resolve(profile || null);
};

/**
 * Giả lập việc cập nhật thông tin hồ sơ của người dùng.
 * @param userId ID của người dùng
 * @param updatedData Dữ liệu cần cập nhật
 * @returns Hồ sơ đã được cập nhật hoặc null nếu không tìm thấy
 */
export const updateUserProfile = async (userId: string, updatedData: Partial<any>): Promise<any | null> => { // @ts-ignore
  const profileIndex = db.profiles.findIndex(p => p.id === userId);
  if (profileIndex === -1) return null;

  // In a real app, you would save this to the db.json file.
  // For this mock, we just update it in memory.
  db.profiles[profileIndex] = { ...db.profiles[profileIndex], ...updatedData }; // @ts-ignore
  return Promise.resolve(db.profiles[profileIndex]);
};

export type UserFilters = {
  query?: string;
  department?: string;
  role?: 'all' | 'student' | 'tutor';
};

/**
 * Giả lập việc tìm kiếm người dùng với các bộ lọc
 * @param filters Các bộ lọc tìm kiếm
 * @returns Danh sách người dùng phù hợp
 */
export const searchUsers = async (filters: UserFilters): Promise<any[]> => { // @ts-ignore
  let results = db.profiles;

  if (filters.query) {
    const query = filters.query.toLowerCase();
    results = results.filter((u: any) => u.name.toLowerCase().includes(query));
  }
  if (filters.department && filters.department !== 'all') {
    results = results.filter((u: any) => u.department === filters.department);
  }
  if (filters.role && filters.role !== 'all') {
    results = results.filter((u: any) => u.role === filters.role);
  }

  return Promise.resolve(results);
};