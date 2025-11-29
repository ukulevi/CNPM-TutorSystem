import axios from 'axios';

const API_URL = 'http://localhost:3001';

export interface SyncResult {
  success: boolean;
  lastSyncTime: string;
}

/**
 * Giả lập quá trình đồng bộ dữ liệu (ví dụ: từ hệ thống của trường).
 * Mất 2 giây để hoàn thành và cập nhật thời gian đồng bộ mới nhất.
 * @returns Promise chứa kết quả đồng bộ.
 */
export const synchronizeData = async (): Promise<SyncResult> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const newSyncTime = new Date().toISOString();
      // Cập nhật thời gian mới nhất vào db.json
      await axios.patch(`${API_URL}/systemSettings/sync-log`, { lastSyncTime: newSyncTime });
      resolve({ success: true, lastSyncTime: newSyncTime });
    }, 2000); // Giả lập độ trễ 2 giây
  });
};