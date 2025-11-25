import { Document } from "../types";

const API_URL = 'http://localhost:3001/api';

/**
 * Lấy danh sách tài liệu của một người dùng.
 */
export const getDocuments = async (userId: string): Promise<Document[]> => {
  const response = await fetch(`${API_URL}/documents?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }
  return response.json();
};

/**
 * Tải lên một tài liệu mới.
 */
export const uploadDocument = async (file: File, visibility: 'public' | 'private', userId: string): Promise<Document> => {
  const newDocData = {
    userId,
    name: file.name,
    url: '#', // Giả lập URL, vì json-server không xử lý file uploads
    size: `${(file.size / 1024).toFixed(2)}KB`,
    uploadDate: new Date().toISOString().split('T')[0],
    type: file.type.split('/')[1] || 'other',
    visibility,
    pinned: false,
  };

  const response = await fetch(`${API_URL}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newDocData),
  });

  if (!response.ok) {
    throw new Error('Failed to upload document');
  }
  return response.json();
};

/**
 * Cập nhật trạng thái hiển thị của tài liệu.
 */
export const updateDocumentVisibility = async (docId: string, visibility: 'public' | 'private'): Promise<Document | null> => {
  const response = await fetch(`${API_URL}/documents/${docId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visibility }),
  });
  if (!response.ok) return null;
  return response.json();
};

/**
 * Ghim/bỏ ghim tài liệu.
 */
export const toggleDocumentPin = async (docId: string, pinned: boolean): Promise<Document | null> => {
    const response = await fetch(`${API_URL}/documents/${docId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pinned: !pinned }),
  });
  if (!response.ok) return null;
  return response.json();
};

/**
 * Xóa tài liệu.
 */
export const deleteDocument = async (docId: string): Promise<boolean> => {
  const response = await fetch(`${API_URL}/documents/${docId}`, {
    method: 'DELETE',
  });
  return response.ok;
};