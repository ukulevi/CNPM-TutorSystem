import { Evaluation, Session } from "../types";
import db from '../../db.json';

/**
 * Giả lập việc đặt một buổi hẹn mới.
 * @param sessionData Dữ liệu của buổi hẹn
 * @returns Buổi hẹn đã được tạo, hoặc null nếu bị trùng lịch.
 */
export const createSession = async (sessionData: Omit<Session, 'id'>): Promise<Session | null> => {
  // Kiểm tra xem sinh viên đã có lịch hẹn nào vào cùng ngày, cùng giờ chưa
  const conflict = db.appointments.find(
    (apt: any) =>
      apt.studentId === sessionData.studentId &&
      apt.date === sessionData.date &&
      apt.time === sessionData.time
  );

  if (conflict) {
    console.error('Lỗi trùng lịch: Sinh viên đã có một buổi hẹn khác vào thời gian này.');
    return null; // Trả về null để báo hiệu có lỗi
  }

  const newSession: Session = {
    id: `apt-${Date.now()}`,
    ...sessionData,
    status: 'booked' // Giả sử trạng thái mặc định là đã đặt
  };
  // Trong ứng dụng thực tế, bạn sẽ lưu newSession vào db.json
  // @ts-ignore
  db.appointments.push(newSession);
  return Promise.resolve(newSession);
};

/**
 * Giả lập việc gửi đánh giá cho một buổi hẹn.
 */
export const submitEvaluation = async (evaluationData: Omit<Evaluation, 'id'>): Promise<Evaluation> => {
  // Logic để lưu đánh giá
  const newEvaluation: Evaluation = {
    id: `eval-${Date.now()}`,
    ...evaluationData
  };
  // @ts-ignore
  db.evaluations.push(newEvaluation);
  return Promise.resolve(newEvaluation);
};

/**
 * Giả lập việc lấy các slot thời gian rảnh của giảng viên.
 */
export const getTutorAvailableSchedule = async (tutorId: string): Promise<Session[]> => {
  const availableSlots = db.appointments.filter((apt: any) => apt.tutorId === tutorId && apt.status === 'available');
  return Promise.resolve(availableSlots as Session[]);
};