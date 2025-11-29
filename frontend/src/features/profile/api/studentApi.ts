import { Session } from '../../types';

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

/**
 * Lấy danh sách các buổi hẹn đã hoàn thành của sinh viên để đánh giá.
 */
export const getStudentCompletedAppointments = async (studentId: string): Promise<Session[]> => {
  // TODO: Add logic to filter out sessions that have already been evaluated.
  const response = await fetch(`${API_URL}/booking?studentId=${studentId}&status=completed&_sort=date&_order=desc`);
  if (!response.ok) {
    throw new Error('Failed to fetch completed appointments');
  }
  return response.json();
};