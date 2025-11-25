import { CalendarDay, CalendarHour, CalendarSlot } from "../types";

const API_URL = 'http://localhost:3001/api';

/**
 * Lấy lịch của giảng viên.
 */
export const getScheduleForTutor = async (
  tutorId: string,
  viewerId: string,
  viewerRole: 'student' | 'tutor'
): Promise<CalendarDay[]> => {
  const tutorProfileRes = await fetch(`${API_URL}/profile/${tutorId}`);
  if (!tutorProfileRes.ok) {
    // Handle case where tutor profile is not found
    return [];
  }
  const tutorProfile = await tutorProfileRes.json();
  const isOwner = tutorId === viewerId;

  if (!isOwner && tutorProfile?.scheduleVisibility === 'private') {
    return [];
  }

  const appointmentsRes = await fetch(`${API_URL}/schedule/appointments?tutorId=${tutorId}`);
  const appointments = await appointmentsRes.json();

  // Logic to create calendar data remains the same
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
          status: appointment.status as 'booked' | 'available',
          studentName: appointment.studentName,
        };
      }
      return { hour, slot };
    });
    return { day: dayInfo.day, date: dayInfo.date, hours };
  });

  return calendar;
};

/**
 * Lấy lịch của sinh viên.
 */
export const getScheduleForStudent = async (
  studentId: string
): Promise<CalendarDay[]> => {
  const appointmentsRes = await fetch(`${API_URL}/schedule/appointments?studentId=${studentId}`);
  const appointments = await appointmentsRes.json();

  // Logic to create calendar data remains the same
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
          tutorName: appointment.tutorName,
        };
      }
      return { hour, slot };
    });

    return { day: dayInfo.day, date: dayInfo.date, hours };
  });

  return calendar;
};

/**
 * Giảng viên thêm một slot thời gian rảnh.
 */
export const addAvailableSlot = async (tutorId: string, date: string, hour: string, subject: string): Promise<any> => {
  const tutorProfileRes = await fetch(`${API_URL}/profiles/${tutorId}`);
  if (!tutorProfileRes.ok) return null;
  const tutorProfile = await tutorProfileRes.json();

  const newSlot = {
    tutorId: tutorId,
    tutorName: tutorProfile.name,
    studentId: undefined,
    studentName: undefined,
    subject: subject,
    date: date,
    time: hour,
    status: 'available',
    type: 'online',
  };

  const response = await fetch(`${API_URL}/schedule/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSlot),
  });

  return response.json();
};

/**
 * Giảng viên xóa một slot thời gian rảnh.
 */
export const deleteAvailableSlot = async (tutorId: string, date: string, hour: string): Promise<boolean> => {
    const query = `tutorId=${tutorId}&date=${date}&time=${hour}&status=available`;
    const slotsRes = await fetch(`${API_URL}/schedule/appointments?${query}`);
    const slots = await slotsRes.json();

    if (slots.length === 0) {
        return false;
    }
    const slotId = slots[0].id;

    const response = await fetch(`${API_URL}/schedule/appointments/${slotId}`, {
        method: 'DELETE',
    });

    return response.ok;
};

/**
 * Sinh viên hủy một buổi hẹn đã đặt.
 */
export const cancelAppointment = async (appointmentId: string): Promise<boolean> => {
    const response = await fetch(`${API_URL}/schedule/appointments/${appointmentId}`, {
        method: 'DELETE',
    });
    return response.ok;
};