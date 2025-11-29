const BASE = 'http://localhost:3001/api/documents';

export async function getDocuments(userId?: string) {
  const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  const res = await fetch(`${BASE}${qs}`);
  if (!res.ok) return [];
  return res.json();
}

export async function uploadDocument(file: File, visibility: 'public' | 'private', userId: string) {
  // Backend expects JSON document object; we'll send name, type, url (fake), userId, visibility
  const payload = {
    userId,
    name: file.name,
    type: file.name.split('.').pop() || 'other',
    url: '#',
    visibility,
    pinned: false,
  };
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return payload;
  return res.json();
}

export async function updateDocumentVisibility(id: string, visibility: 'public' | 'private') {
  try {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visibility }),
    });
    if (!res.ok) throw new Error('Failed to update visibility');
    return res.json();
  } catch (error) {
    console.error('Update visibility error:', error);
    return { id, visibility };
  }
}

export async function deleteDocument(id: string) {
  try {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete document');
    return res.json();
  } catch (error) {
    console.error('Delete document error:', error);
    return { success: false };
  }
}

export async function toggleDocumentPin(id: string, pinned: boolean) {
  try {
    const res = await fetch(`${BASE}/${id}/toggle-pin`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to toggle pin');
    return res.json();
  } catch (error) {
    console.error('Toggle pin error:', error);
    return { id, pinned: !pinned };
  }
}
// import { Document } from "../types";

// const API_URL = 'http://localhost:3001/api';

// /**
//  * Lấy danh sách tài liệu của một người dùng.
//  */
// export const getDocuments = async (userId: string): Promise<Document[]> => {
//   const response = await fetch(`${API_URL}/documents?userId=${userId}`);
//   if (!response.ok) {
//     throw new Error('Failed to fetch documents');
//   }
//   return response.json();
// };

// /**
//  * Tải lên một tài liệu mới.
//  */
// export const uploadDocument = async (file: File, visibility: 'public' | 'private', userId: string): Promise<Document> => {
//   const newDocData = {
//     userId,
//     name: file.name,
//     url: '#', // Giả lập URL, vì json-server không xử lý file uploads
//     size: `${(file.size / 1024).toFixed(2)}KB`,
//     uploadDate: new Date().toISOString().split('T')[0],
//     type: file.type.split('/')[1] || 'other',
//     visibility,
//     pinned: false,
//   };

//   const response = await fetch(`${API_URL}/documents`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(newDocData),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to upload document');
//   }
//   return response.json();
// };

// /**
//  * Cập nhật trạng thái hiển thị của tài liệu.
//  */
// export const updateDocumentVisibility = async (docId: string, visibility: 'public' | 'private'): Promise<Document | null> => {
//   const response = await fetch(`${API_URL}/documents/${docId}`, {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ visibility }),
//   });
//   if (!response.ok) return null;
//   return response.json();
// };

// /**
//  * Ghim/bỏ ghim tài liệu.
//  */
// export const toggleDocumentPin = async (docId: string, pinned: boolean): Promise<Document | null> => {
//     const response = await fetch(`${API_URL}/documents/${docId}`, {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ pinned: !pinned }),
//   });
//   if (!response.ok) return null;
//   return response.json();
// };

// /**
//  * Xóa tài liệu.
//  */
// export const deleteDocument = async (docId: string): Promise<boolean> => {
//   const response = await fetch(`${API_URL}/documents/${docId}`, {
//     method: 'DELETE',
//   });
//   return response.ok;
// };