import { UpcomingRequest, TutorStats } from '../../../types';

const API_URL = 'http://localhost:3001';

export const getTutorDashboardData = async (tutorId: string): Promise<{
  stats: TutorStats;
  upcomingAppointments: Session[];
  bookedRequests: Session[];
}> => {
  try {
    // Lấy tất cả appointments của tutor
    const appointmentsRes = await fetch(`${API_URL}/api/booking?tutorId=${tutorId}&_sort=date&_order=asc`);
    const allAppointments: Session[] = await appointmentsRes.json();

    // Lấy tất cả users để tìm tutor info
    let tutorRating = 0;
    try {
      const usersRes = await fetch(`${API_URL}/api/admin/database/users`);
      if (usersRes.ok) {
        const users = await usersRes.json();
        const tutor = users.find((u: any) => u.id === tutorId);
        tutorRating = tutor?.rating || 0;
      }
    } catch (error) {
      console.warn('Failed to fetch tutor rating:', error);
      tutorRating = 0;
    }

    // Tách booked, upcoming, và ongoing appointments
    const bookedAppointments = allAppointments.filter(a => a.status === 'booked');
    const upcomingAndOngoingAppointments = allAppointments.filter(a => a.status === 'upcoming' || a.status === 'ongoing');

    // Tính toán các chỉ số
    // Tổng buổi hẹn = upcoming + ongoing (những buổi đã được xác nhận và đang hoặc sắp diễn ra)
    const totalSessionsCount = upcomingAndOngoingAppointments.length;

    // Sinh viên unique (chỉ từ upcoming + ongoing appointments)
    const totalStudents = new Set(
      upcomingAndOngoingAppointments
        .map(a => a.studentId)
        .filter(Boolean)
    ).size;

    // Đánh giá TB - lấy từ tutor profile
    const averageRating = tutorRating;

    const stats: TutorStats = {
      totalSessions: totalSessionsCount,
      upcomingSessions: upcomingAndOngoingAppointments.length,
      totalStudents,
      totalAppointments: allAppointments.length,
      averageRating: Number(averageRating)
    };

    return { stats, upcomingAppointments: upcomingAndOngoingAppointments, bookedRequests: bookedAppointments };
  } catch (error) {
    console.error('Error fetching tutor dashboard data:', error);
    throw error;
  }
};