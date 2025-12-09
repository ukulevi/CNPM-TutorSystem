export type UserRole = 'student' | 'tutor' | 'admin' | null;

export type User = {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'tutor' | 'admin';
    avatar?: string;
    department?: string;
    major?: string;
    cohort?: string;
    officeLocation?: string;
    rating?: number;
    specialization?: string;
    publications?: { title: string; link: string; public: boolean }[];
    scheduleVisibility?: string;
    documentsVisibility?: string;
};

export type Tutor = {
  id: string;
  name: string;
  department: string;
  specialization: string;
  rating: number;
  avatar?: string;
};

export type Session = {
  id: string;
  tutorId: string;
  tutorName: string;
  studentId?: string;
  studentName?: string;
  subject: string;
  date: string;
  time: string;
  type?: 'online' | 'offline';
  status: 'available' | 'booked' | 'upcoming' | 'ongoing' | 'completed' | 'evaluated' | 'cancelled';
  // available: Slot rảnh của tutor (có thể đặt)
  // booked: Student đặt lịch, tutor chưa nhấn xác nhận
  // upcoming: Tutor đã xác nhận, chưa ai nhấn Tham gia
  // ongoing: 1 trong 2 bên đã nhấn Tham gia
  // completed: cả 2 bên đã nhấn Tham gia
  // evaluated: buổi hẹn đã được đánh giá
  // cancelled: 1 trong 2 bên hủy buổi hẹn (treat như available)
  evaluationId?: string;
};

export type CalendarDay = {
  day: string;
  engDay?: string;
  date: string;
  hours: CalendarHour[];
};

export type CalendarHour = {
  hour: string;
  slot: CalendarSlot | null;
};

export type CalendarSlot = {
  id: string;
  subject: string; // Đổi 'title' thành 'subject' cho nhất quán
  status: 'available' | 'booked' | 'personal' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  studentName?: string;
  tutorName?: string;
};

export type AppointmentSlot = {
  id: string;
  title: string;
  date: string;
  hour: string;
};

export type TutorStats = {
  totalAppointments: number;
  totalSessions: number;
  upcomingSessions: number;
  totalStudents: number;
  averageRating: number;
};

export type UpcomingRequest = {
  id: string;
  studentName: string;
  subject: string;
  date: string;
  time: string;
  type: 'online' | 'offline';
};

export type Document = {
  id: string;
  userId: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'other';
  size: string;
  uploadDate: string;
  visibility: 'public' | 'private';
  pinned: boolean;
  url: string;
};

export type Department = {
  id: string;
  name: string;
};

export type Evaluation = {
  id: string;
  tutorId: string;
  studentId: string;
  sessionId: string;
  rating: number;
  comment: string;
};