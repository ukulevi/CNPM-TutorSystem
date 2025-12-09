import { Evaluation, Session } from "../../../types";
import { getScheduleForTutor } from "../../schedule/api/calendarApi";

const API_URL = 'http://localhost:3001';

/**
 * Đặt một buổi hẹn mới.
 * @param sessionData Dữ liệu của buổi hẹn
 * @returns Buổi hẹn đã được tạo, hoặc null nếu bị trùng lịch.
 */
/*export const createSession = async (sessionData: Omit<Session, 'id'>): Promise<Session | null> => {
  // Kiểm tra xem sinh viên đã có lịch hẹn nào vào cùng ngày, cùng giờ chưa
  const response = await fetch(`${API_URL}/api/schedule/appointments?studentId=${sessionData.studentId}&date=${sessionData.date}&time=${sessionData.time}`);
  const conflictingAppointments = await response.json();
  console.log("API result:", conflictingAppointments);


  if (conflictingAppointments.length > 0) {
    console.error('Lỗi trùng lịch: Sinh viên đã có một buổi hẹn khác vào thời gian này.');
    return null; // Trả về null để báo hiệu có lỗi
  }

  const newSessionResponse = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...sessionData,
      status: 'booked' // Giả sử trạng thái mặc định là đã đặt
    }),
  });

  const newSession = await newSessionResponse.json();
  return newSession;
};

/**
 * Gửi đánh giá cho một buổi hẹn.
 */
export const createSession = async (sessionData: Omit<Session, 'id'>): Promise<Session | null> => {
    console.log("Chosen schedule:", sessionData);

  // Always fetch all appointments of this student
  const response = await fetch(
    `${API_URL}/api/schedule/appointments?studentId=${sessionData.studentId}`
  );
  const appointments = await response.json();
  console.log("API result:", appointments);

  // Check if any appointment has the SAME date and SAME time
  const hasConflict = appointments.some(
    (item: Session) =>
      item.date === sessionData.date && item.time === sessionData.time
  );

  if (hasConflict) {
    console.error(
      'Lỗi trùng lịch: Sinh viên đã có một buổi hẹn khác vào thời gian này.'
    );
    return null;
  }

  // If no conflict → create booking
  const newSessionResponse = await fetch(`${API_URL}/api/booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...sessionData,
      status: 'booked',
    }),
  });

  const newSession = await newSessionResponse.json();
  return newSession;
};


export const submitEvaluation = async (evaluationData: Omit<Evaluation, 'id'>): Promise<Evaluation> => {
  const response = await fetch(`${API_URL}/api/evaluations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(evaluationData),
  });
  const newEvaluation = await response.json();
  return newEvaluation;
};

/**
 * Lấy các slot thời gian rảnh của giảng viên (từ tutorSchedule pattern + appointments).
 */
export const getTutorAvailableSchedule = async (tutorId: string): Promise<Session[]> => {
    // Reuse getScheduleForTutor which handles tutorSchedule pattern + appointments
    const calendarDays = await getScheduleForTutor(tutorId, tutorId);
    
    // Return empty array if no schedule found
    if (!calendarDays) {
        return [];
    }
    
    // Flatten all available hours into Session objects
    const availableSlots: Session[] = [];
    
    calendarDays.forEach(day => {
        day.hours.forEach(hour => {
            // Only include slots that are "available" or came from cancelled appointments
            if (hour.slot && (hour.slot.status === 'available')) {
                availableSlots.push({
                    id: hour.slot.id,
                    tutorId: tutorId,
                    tutorName: '',
                    subject: hour.slot.subject,
                    date: day.date,
                    time: hour.hour,
                    status: 'available',
                    type: 'online',
                });
            }
        });
    });
    
    return availableSlots;
};