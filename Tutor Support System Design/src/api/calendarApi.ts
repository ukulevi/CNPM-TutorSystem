import { CalendarDay, CalendarHour, CalendarSlot } from "../types";
import db from '../../db.json';

/**
 * Giả lập việc lấy lịch của giảng viên.
 * Trong một ứng dụng thực tế, bạn sẽ cần kiểm tra quyền truy cập.
 */
export const getScheduleForTutor = async (
  tutorId: string,
  viewerId: string,
  viewerRole: 'student' | 'tutor'
): Promise<CalendarDay[]> => {
  const tutorProfile = db.profiles.find((p: any) => p.id === tutorId);
  const isOwner = tutorId === viewerId;

  // Giả lập kiểm tra quyền riêng tư
  if (!isOwner && tutorProfile?.scheduleVisibility === 'private') {
    return Promise.resolve([]); // Trả về mảng rỗng nếu lịch là riêng tư và người xem không phải chủ sở hữu
  }

  // Lấy các cuộc hẹn của giảng viên
  const appointments = db.appointments.filter((a: any) => a.tutorId === tutorId);

  // --- Logic tạo dữ liệu lịch tuần ---
  // Giả lập một tuần làm việc (ví dụ: 10/11/2025 - 14/11/2025)
  const weekDates = [
    { day: 'Thứ 2', date: '2025-11-10' },
    { day: 'Thứ 3', date: '2025-11-11' },
    { day: 'Thứ 4', date: '2025-11-12' },
    { day: 'Thứ 5', date: '2025-11-13' },
    { day: 'Thứ 6', date: '2025-11-14' },
    { day: 'Thứ 7', date: '2025-11-15' },
    { day: 'Chủ Nhật', date: '2025-11-16' },
  ];

  const workHours = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  const calendar: CalendarDay[] = weekDates.map(dayInfo => {
    const hours: CalendarHour[] = workHours.map(hour => {
      // Tìm cuộc hẹn tương ứng với ngày và giờ này
      const appointment = appointments.find((apt: any) => apt.date === dayInfo.date && apt.time === hour);

      let slot: CalendarSlot | null = null;
      if (appointment) {
        slot = {
          id: appointment.id,
          subject: appointment.subject,
          status: appointment.status as 'booked' | 'available', // Ép kiểu để khớp với CalendarSlot
          studentName: appointment.studentName,
        };
      }

      return { hour, slot };
    });

    return {
      day: dayInfo.day,
      date: dayInfo.date,
      hours: hours,
    };
  });

  return Promise.resolve(calendar);
};

/**
 * Giả lập việc lấy lịch của sinh viên.
 */
export const getScheduleForStudent = async (
  studentId: string
  // viewerId: string,
  // viewerRole: 'student' | 'tutor'
): Promise<CalendarDay[]> => {
  // Logic tương tự getScheduleForTutor nhưng lọc theo studentId
  const appointments = db.appointments.filter((a: any) => a.studentId === studentId);

  const weekDates = [
    { day: 'Thứ 2', date: '2025-11-10' },
    { day: 'Thứ 3', date: '2025-11-11' },
    { day: 'Thứ 4', date: '2025-11-12' },
    { day: 'Thứ 5', date: '2025-11-13' },
    { day: 'Thứ 6', date: '2025-11-14' },
    { day: 'Thứ 7', date: '2025-11-15' },
    { day: 'Chủ Nhật', date: '2025-11-16' },
  ];

  const workHours = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  const calendar: CalendarDay[] = weekDates.map(dayInfo => {
    const hours: CalendarHour[] = workHours.map(hour => {
      const appointment = appointments.find((apt: any) => apt.date === dayInfo.date && apt.time === hour);
      let slot: CalendarSlot | null = null;
      if (appointment) {
        slot = {
          id: appointment.id,
          subject: appointment.subject,
          status: 'booked',
          tutorName: appointment.tutorName, // Thêm tên giảng viên
        };
      }
      return { hour, slot };
    });

    return { day: dayInfo.day, date: dayInfo.date, hours };
  });

  return Promise.resolve(calendar);
};

/**
 * Giả lập việc giảng viên thêm một slot thời gian rảnh.
 */
export const addAvailableSlot = async (tutorId: string, date: string, hour: string, subject: string): Promise<any> => { // Bỏ tham số type
  const tutorProfile = db.profiles.find((p: any) => p.id === tutorId);
  if (!tutorProfile) return null;

  const newSlot = {
    id: `apt-${Date.now()}`,
    tutorId: tutorId,
    tutorName: tutorProfile.name,
    studentId: undefined,
    studentName: undefined,
    subject: subject,
    date: date,
    time: hour,
    status: 'available', // Trạng thái là 'còn trống'
    type: 'online', // Mặc định là online
  };

  // @ts-ignore
  db.appointments.push(newSlot);
  console.log('Added new slot:', newSlot);
  return Promise.resolve(newSlot);
};

/**
 * Giả lập việc giảng viên xóa một slot thời gian rảnh.
 */
export const deleteAvailableSlot = async (tutorId: string, date: string, hour: string): Promise<boolean> => {
  const slotIndex = db.appointments.findIndex(
    (apt: any) => apt.tutorId === tutorId && apt.date === date && apt.time === hour && apt.status === 'available'
  );

  if (slotIndex > -1) {
    db.appointments.splice(slotIndex, 1);
    console.log(`Deleted slot at ${date} ${hour}`);
    return Promise.resolve(true);
  }

  return Promise.resolve(false);
};

/**
 * Giả lập việc sinh viên hủy một buổi hẹn đã đặt.
 * @param appointmentId ID của buổi hẹn cần hủy
 * @returns {Promise<boolean>} True nếu hủy thành công, ngược lại là false.
 */
export const cancelAppointment = async (appointmentId: string): Promise<boolean> => {
  const appointmentIndex = db.appointments.findIndex(
    (apt: any) => apt.id === appointmentId && apt.status === 'booked'
  );

  if (appointmentIndex > -1) {
    db.appointments.splice(appointmentIndex, 1);
    console.log(`Cancelled appointment ${appointmentId}`);
    return Promise.resolve(true);
  }

  return Promise.resolve(false);
};