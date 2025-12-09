import { Session } from '../../../types';

const API_URL = 'http://localhost:3001/api';

/**
 * Lấy danh sách các buổi hẹn sắp tới của sinh viên (bao gồm both upcoming và ongoing).
 */
export const getStudentUpcomingAppointments = async (studentId: string): Promise<Session[]> => {
  const response = await fetch(`${API_URL}/booking?studentId=${studentId}&_sort=date&_order=asc`);
  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }
  const allAppointments = await response.json();
  // Include both 'upcoming' and 'ongoing' statuses
  return allAppointments.filter((apt: Session) => apt.status === 'upcoming' || apt.status === 'ongoing');
};

/**
 * Lấy danh sách các buổi hẹn đã hoàn thành của sinh viên để đánh giá (không bao gồm các buổi đã đánh giá).
 */
export const getStudentCompletedAppointments = async (studentId: string): Promise<Session[]> => {
  const response = await fetch(`${API_URL}/booking?studentId=${studentId}&_sort=date&_order=desc`);
  if (!response.ok) {
    throw new Error('Failed to fetch completed appointments');
  }
  const appointments = await response.json();
  // Filter to only show 'completed' status (exclude 'evaluated' and other statuses)
  return appointments.filter((apt: Session) => apt.status === 'completed');
};