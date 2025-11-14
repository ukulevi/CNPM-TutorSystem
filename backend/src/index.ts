import express, { Express, Request, Response } from 'express';
import cors from 'cors';

// Khởi tạo ứng dụng Express
const app: Express = express();
const port = 3001; // Chọn một port khác với port của frontend (Vite thường dùng 5173)

// Sử dụng middleware
app.use(cors()); // Cho phép Cross-Origin Resource Sharing
app.use(express.json()); // Cho phép server đọc dữ liệu JSON từ request body

// --- Định nghĩa API ---

// Lấy dữ liệu mock từ file frontend để dùng tạm
const mockDepartments = [
  { value: 'all', label: 'Tất cả Khoa' },
  { value: 'Khoa Khoa học & Kỹ thuật Máy tính', label: 'Khoa học & Kỹ thuật Máy tính' },
  { value: 'Khoa Điện - Điện tử', label: 'Điện - Điện tử' },
  { value: 'Khoa Cơ khí', label: 'Cơ khí' },
  { value: 'Khoa Khoa học Ứng dụng', label: 'Khoa học Ứng dụng' },
];

// API endpoint đầu tiên: GET /api/departments
app.get('/api/departments', (req: Request, res: Response) => {
  console.log('Request received for /api/departments');
  res.json(mockDepartments);
});

// Khởi động server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
