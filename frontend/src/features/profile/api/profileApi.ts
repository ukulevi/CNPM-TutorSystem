const BASE = 'http://localhost:3001/api/profile';


export async function getAllProfiles() {
  const res = await fetch(`${BASE}`);
  return res.json();
}


export async function getProfileById(id: string) {
  try {
    const res = await fetch(`${BASE}/${id}`);
    if (!res.ok) {
      console.warn(`Profile ${id} not found (status ${res.status})`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching profile ${id}:`, error);
    throw error;
  }

}

export async function updateProfile(id: string, payload: any) {
  // Backend does not have update endpoint — simulate merge and return payload with id
  // In future, change to PUT /api/profile/:id
  return { ...payload, id };
}


export async function searchUsers(filters: { query?: string; department?: string; role?: string }) {
  // Search through all profiles using filters
  try {
    const allProfiles = await getAllProfiles();
    return allProfiles.filter((p: any) => {
      if (filters.query && !p.name.toLowerCase().includes(filters.query.toLowerCase())) return false;
      if (filters.department && filters.department !== 'all' && p.department !== filters.department) return false;
      if (filters.role && filters.role !== 'all' && p.role !== filters.role) return false;
      return true;
    });
  } catch (err) {
    console.error('Search error:', err);
    return [];
  }

}


export async function getUserProfile(id: string) {
  return getProfileById(id);
}


export async function updateUserProfile(id: string, payload: any) {
  return updateProfile(id, payload);
}
// const API_URL = 'http://localhost:3001/api';

 
// /**
//  * Lấy tất cả hồ sơ người dùng.
//  * @returns Danh sách tất cả hồ sơ người dùng.
//  */
// export const getAllProfiles = async (): Promise<any[]> => {
//   const response = await fetch(`${API_URL}/profile`);
//   if (!response.ok) {
//     throw new Error('Failed to fetch all profiles');
//   }
//   return response.json();
// };

// /**
//  * Lấy thông tin hồ sơ của một người dùng bằng ID
//  * @param userId ID của người dùng cần lấy hồ sơ
//  * @returns Thông tin hồ sơ hoặc null nếu không tìm thấy
//  */
// export const getUserProfile = async (userId: string): Promise<any | null> => {
//   const response = await fetch(`${API_URL}/profile/${userId}`);
//   if (!response.ok) {
//     if (response.status === 404) return null;
//     throw new Error('Failed to fetch user profile');
//   }
//   return response.json();
// };

// /**
//  * Cập nhật thông tin hồ sơ của người dùng.
//  * @param userId ID của người dùng
//  * @param updatedData Dữ liệu cần cập nhật
//  * @returns Hồ sơ đã được cập nhật hoặc null nếu không tìm thấy
//  */
// export const updateUserProfile = async (userId: string, updatedData: Partial<any>): Promise<any | null> => {
//   const response = await fetch(`${API_URL}/profile/${userId}`, {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(updatedData),
//   });
//   if (!response.ok) {
//     if (response.status === 404) return null;
//     throw new Error('Failed to update user profile');
//   }
//   return response.json();
// };

// export type UserFilters = {
//   query?: string;
//   department?: string;
//   role?: 'all' | 'student' | 'tutor';
// };

// /**
//  * Tìm kiếm người dùng với các bộ lọc
//  * @param filters Các bộ lọc tìm kiếm
//  * @returns Danh sách người dùng phù hợp
//  */
// export const searchUsers = async (filters: UserFilters): Promise<any[]> => {
//   const queryParams = new URLSearchParams();
//   if (filters.query) {
//     queryParams.append('q', filters.query);
//   }
//   if (filters.department && filters.department !== 'all') {
//     queryParams.append('department', filters.department);
//   }
//   if (filters.role && filters.role !== 'all') {
//     queryParams.append('role', filters.role);
//   }

//   const response = await fetch(`${API_URL}/profile?${queryParams.toString()}`);
//   if (!response.ok) {
//     throw new Error('Failed to search users');
//   }
//   return response.json();
// };