import { CalendarDay, CalendarHour, CalendarSlot } from "../../../types";
import {addDays, format, parseISO} from 'date-fns';
import {enUS} from 'date-fns/locale';

const API_URL = 'http://localhost:3001/api';

const DayNameMap: { [key: number]: { vn: string, en: string } } = {
  0: { vn: 'Chủ Nhật', en: 'Sunday' },
  1: { vn: 'Thứ 2', en: 'Monday' },
  2: { vn: 'Thứ 3', en: 'Tuesday' },
  3: { vn: 'Thứ 4', en: 'Wednesday' },
  4: { vn: 'Thứ 5', en: 'Thursday' },
  5: { vn: 'Thứ 6', en: 'Friday' },
  6: { vn: 'Thứ 7', en: 'Saturday' },
};

const getVietnameseDayName = (date: Date): string => {
  // date.getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  const dayIndex = date.getDay();
  return DayNameMap[dayIndex].vn;
};

const getDayNameInEnglish = (date: Date): string => {
  // date.getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  const dayIndex = date.getDay();
  return DayNameMap[dayIndex].en;
};

const convertVnToEnDayName = (vnDayName: string): string | null => {
  for (const key in DayNameMap) {
    if (DayNameMap[key].vn === vnDayName) {
      return DayNameMap[key].en;
    }
  }
  return null;
};

const convertSlotToHours = (slot: string): string[] => {
  const [start, end] = slot.split('-');
  const hours: string[] = [];
  
  let currentHour = parseInt(start.substring(0, 2), 10);
  const endHour = parseInt(end.substring(0, 2), 10);

  // Simple one-hour block generation
  while (currentHour < endHour) {
    hours.push(`${String(currentHour).padStart(2, '0')}:00`);
    currentHour += 1;
  }
  return hours;
};

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

  const scheduleRes = await fetch(`${API_URL}/schedule?tutorId=${tutorId}`);
  const schedule = await scheduleRes.json();

  const appointmentsRes = await fetch(`${API_URL}/schedule/appointments?tutorId=${tutorId}`);
  const appointments = await appointmentsRes.json();

  const mockDay = '2025-11-24';
  const maxWorkingDays = 7;
  let workDates: { day: string, date: string }[] = [];
  let currentDate = new Date(mockDay);
  let daysChecked = 0;

  while (workDates.length < maxWorkingDays && daysChecked < 30) {
    const englishDayName = getDayNameInEnglish(currentDate); // e.g., "Monday"
    const vietnameseDayName = getVietnameseDayName(currentDate); // e.g., "Thứ 2"
    
    const scheduleEntry = schedule.find((item: any) => item.day === englishDayName);

    if (scheduleEntry && scheduleEntry.slots.length > 0) {
      workDates.push({
        day: vietnameseDayName,
        date: format(currentDate, 'yyyy-MM-dd'),
      });
    }

    currentDate = addDays(currentDate, 1);
    daysChecked++;
  }

  const calendar: CalendarDay[] = workDates.map(dayInfo => {
    const englishDayName = format(parseISO(dayInfo.date), 'EEEE', { locale: enUS });
    const scheduleEntry = schedule.find((item: any ) => item.day === englishDayName);

    let workHours: string[] = [];
    if (scheduleEntry) {
        scheduleEntry.slots.forEach((slot: string) => {
            workHours = workHours.concat(convertSlotToHours(slot));
        });
    }

    workHours = [...new Set(workHours)].sort();

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
      return {hour, slot};
    });
    
    return {day: dayInfo.day, date: dayInfo.date, hours};
  });

  // const workHours = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  // const calendar: CalendarDay[] = weekDates.map(dayInfo => {
  //   const hours: CalendarHour[] = workHours.map(hour => {
  //     const appointment = appointments.find((apt: any) => apt.date === dayInfo.date && apt.time === hour);
  //     let slot: CalendarSlot | null = null;
  //     if (appointment) {
  //       slot = {
  //         id: appointment.id,
  //         subject: appointment.subject,
  //         status: appointment.status as 'booked' | 'available',
  //         studentName: appointment.studentName,
  //       };
  //     }
  //     return { hour, slot };
  //   });
  //   return { day: dayInfo.day, date: dayInfo.date, hours };
  // });

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