import { Evaluation, Session } from "../../../types";

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
 * Lấy các slot thời gian rảnh của giảng viên.
 */
export const getTutorAvailableSchedule = async (tutorId: string): Promise<Session[]> => {
    //const response = await fetch(`${API_URL}/appointments?tutorId=${tutorId}&status=available`);
    const response = await fetch(`${API_URL}/api/schedule/appointments?tutorId=${tutorId}&status=available`)
    
    const availableSlots = await response.json();
    return availableSlots as Session[];
};