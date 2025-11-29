import { Session } from '../../../types';

const API_URL = 'http://localhost:3001/api';

/**
 * Lấy danh sách các buổi hẹn sắp tới của sinh viên.
 */
export const getStudentUpcomingAppointments = async (studentId: string): Promise<Session[]> => {
  const response = await fetch(`${API_URL}/booking?studentId=${studentId}&status=booked&_sort=date&_order=asc`);
  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }
  return response.json();
};