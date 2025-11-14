import { Session, Tutor } from '../types';
import db from '../../db.json';

/**
 * Lấy danh sách các buổi hẹn sắp tới của sinh viên.
 */
export const getStudentUpcomingAppointments = async (studentId: string): Promise<Session[]> => {
  // 1. Lấy tất cả các cuộc hẹn của sinh viên từ db.json
  const appointments = db.appointments
    .filter((a: any) => a.studentId === studentId && a.status === 'booked')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sắp xếp theo ngày

  // 2. Trả về danh sách các buổi hẹn đã được sắp xếp
  return Promise.resolve(appointments as Session[]);
};