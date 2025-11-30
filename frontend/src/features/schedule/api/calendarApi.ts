import { CalendarDay, CalendarHour, CalendarSlot, Evaluation } from "../../../types";
import { addDays, format, parseISO } from 'date-fns';
import { da, enUS } from 'date-fns/locale';

const API_URL = 'http://localhost:3001/api';

export type ScheduleDay = {
  day: string;
  slots: string[]
};

const DayNameMap: { [key: number]: { vn: string, en: string } } = {
  6: { vn: 'Chủ Nhật', en: 'Sunday' },
  0: { vn: 'Thứ 2', en: 'Monday' },
  1: { vn: 'Thứ 3', en: 'Tuesday' },
  2: { vn: 'Thứ 4', en: 'Wednesday' },
  3: { vn: 'Thứ 5', en: 'Thursday' },
  4: { vn: 'Thứ 6', en: 'Friday' },
  5: { vn: 'Thứ 7', en: 'Saturday' },
};

const ALL_HOURS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

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
  viewerId: string
): Promise<CalendarDay[] | undefined> => {
  try {
    const tutorProfileRes = await fetch(`${API_URL}/profile/${tutorId}`);
    if (!tutorProfileRes.ok) {
      console.warn(`Tutor profile ${tutorId} not found`);
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
    if (!appointmentsRes.ok) {
      console.warn(`Failed to fetch appointments for tutor ${tutorId}`);
      return [];
    }
    const appointments = await appointmentsRes.json();

    const weekDates: { day: string, engDay: string, date: string }[] = [];
    let currentDate = new Date();
    for (let i = 0; i < 7; i++) {
        weekDates.push({
            day: getVietnameseDayName(currentDate),
            engDay: getDayNameInEnglish(currentDate),
            date: format(currentDate, 'yyyy-MM-dd')
        });
        currentDate = addDays(currentDate, 1);
    }

    const calendar: CalendarDay[] = weekDates.map(dayInfo => {
      const scheduleEntry = schedule.find((item: any) => item.day === dayInfo.engDay);
      const availableSlots = scheduleEntry ? scheduleEntry.slots : [];

      const hours: CalendarHour[] = ALL_HOURS.map(hour => {
        const appointment = appointments.find((apt: any) => apt.date === dayInfo.date && apt.time === hour);
        let slot: CalendarSlot | null = null;

        if (appointment) {
          slot = {
            id: appointment.id,
            subject: appointment.subject,
            status: 'booked',
            studentName: appointment.studentName,
            tutorName: appointment.tutorName,
          };
        } else if (availableSlots.includes(hour)) {
          slot = {
            id: `${tutorId}-${dayInfo.date}-${hour}`,
            status: 'available',
            subject: 'Có thể đặt lịch',
          };
        }
        return { hour, slot };
      });

      return { day: dayInfo.day, date: dayInfo.date, hours };
    });

    return calendar;
  } catch (error) {
    console.error(`Error fetching tutor schedule for ${tutorId}:`, error);
    return [];
  }
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
export const addAvailableSlot = async (tutorId: string, tutorName: string, day: string, date: string, hour: string): Promise<any> => {
  const newSlot = {
    tutorId: tutorId,
    tutorName: tutorName,
    studentId: undefined,
    studentName: undefined,
    subject: undefined,
    date: date,
    time: hour,
    status: 'available',
    type: 'online',
    day: day,
    hour: hour,
  };

  let response: Response;

  try {
    // Network Request
    response = await fetch(`${API_URL}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSlot),
    });
  } catch (error) {
    // CRITICAL CORRECTION 2a: Handle network/connection failures
    console.error(`[API Error] Network failure during POST /schedule:`, error);
    return false;
  }

  if (!response.ok) {
    const status = response.status;
    console.error(`[API Error] Failed to add slot. Status: ${status}.`);

  // Log detailed error from the API for debugging
    try {
      const errorBody = await response.json();
      console.error('API Error Details (Received from Server):', errorBody);
    } catch (e) {
      console.warn('Could not parse API error response body as JSON.');
    }

    return false;
  }

  return true;
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


export const createAppointment = async (data: any): Promise<boolean> => {
  const response = await fetch(`${API_URL}/schedule/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.ok;
}

export const getEvaluationById = async (evalId: string): Promise<Evaluation | undefined> => {
  const response = await fetch(`${API_URL}/evaluations/${evalId}`);

  if (!response.ok) {
    return;
  }

  const evaluation = await response.json();

  return evaluation;
}

export const freeSlot = async (tutorId: string, day: string, hour: string) => {
  const params = new URLSearchParams({
    tutorId: tutorId,
    day: day,
    hour: hour, // Đảm bảo tên tham số này khớp với API mong muốn
  });

  // 2. Gửi yêu cầu DELETE mà không có body, truyền tham số qua URL
  const response = await fetch(`${API_URL}/schedule?${params.toString()}`, {
    method: 'DELETE'
  });
  return response.ok;
}