import { UpcomingRequest, TutorStats } from '../types';

const API_URL = 'http://localhost:3001';

/**
 * Lấy dữ liệu cho trang chủ của giảng viên.
 */
export const getTutorDashboardData = async (tutorId: string): Promise<{ stats: TutorStats; requests: UpcomingRequest[] }> => {
  const appointmentsRes = await fetch(`${API_URL}/api/schedule/appointments?tutorId=${tutorId}&status=booked&_sort=date&_order=asc`);
  const appointments = await appointmentsRes.json();

  const evaluationsRes = await fetch(`${API_URL}/api/evaluations?tutorId=${tutorId}`);
  const evaluations = await evaluationsRes.json();

  // Tính toán các chỉ số
  const totalSessions = appointments.length;
  const upcomingSessions = appointments.filter((a: any) => a.status === 'booked' || a.status === 'available').length;
  const totalStudents = new Set(appointments.map((a: any) => a.studentId).filter(Boolean)).size;
  const averageRating = evaluations.length > 0
    ? (evaluations.reduce((sum: number, e: { rating: number }) => sum + e.rating, 0) / evaluations.length).toFixed(1)
    : 0;

  const stats: TutorStats = {
    totalSessions: totalSessions,
    upcomingSessions: upcomingSessions,
    totalStudents,
    totalAppointments: totalSessions,
    averageRating: Number(averageRating)
  };

  // Lấy yêu cầu từ buổi hẹn gần nhất
  const nextAppointment = appointments[0];
  const requests: UpcomingRequest[] = [];

  if (nextAppointment) {
    requests.push({
      id: nextAppointment.id,
      studentName: nextAppointment.studentName,
      subject: nextAppointment.subject,
      date: nextAppointment.date,
      time: nextAppointment.time,
      type: nextAppointment.type as 'online' | 'offline',
    });
  }

  return { stats, requests };
};