import { Document } from "../types";
import db from '../../db.json';

/**
 * Giả lập việc lấy danh sách tài liệu của một người dùng.
 * @param userId ID của người dùng
 * @returns Danh sách tài liệu
 */
export const getDocuments = async (userId: string): Promise<Document[]> => {
  // @ts-ignore
  const documents = db.documents.filter((d: any) => d.userId === userId);
  return Promise.resolve(documents as Document[]);
};

/**
 * Giả lập việc tải lên một tài liệu mới.
 */
export const uploadDocument = async (file: File, visibility: 'public' | 'private', userId: string): Promise<Document> => {
  const newDoc: Document = {
    id: `doc-${Date.now()}`,
    userId,
    name: file.name,
    url: '#', // Giả lập URL
    size: `${(file.size / 1024).toFixed(2)}KB`,
    uploadDate: new Date().toISOString().split('T')[0],
    type: file.type.split('/')[1] as any || 'other',
    visibility,
    pinned: false,
  };
  // @ts-ignore
  db.documents.push(newDoc);
  return Promise.resolve(newDoc);
};

/**
 * Giả lập việc cập nhật trạng thái hiển thị của tài liệu.
 */
export const updateDocumentVisibility = async (docId: string, visibility: 'public' | 'private'): Promise<Document | null> => {
  const docIndex = db.documents.findIndex((d: any) => d.id === docId);
  if (docIndex === -1) return null;
  db.documents[docIndex].visibility = visibility;
  return Promise.resolve(db.documents[docIndex] as Document);
};

/**
 * Giả lập việc ghim/bỏ ghim tài liệu.
 */
export const toggleDocumentPin = async (docId: string, pinned: boolean): Promise<Document | null> => {
  const docIndex = db.documents.findIndex((d: any) => d.id === docId);
  if (docIndex === -1) return null;
  db.documents[docIndex].pinned = !pinned;
  return Promise.resolve(db.documents[docIndex] as Document);
};

/**
 * Giả lập việc xóa tài liệu.
 */
export const deleteDocument = async (docId: string): Promise<boolean> => {
  const docIndex = db.documents.findIndex((d: any) => d.id === docId);
  if (docIndex > -1) {
    db.documents.splice(docIndex, 1);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};