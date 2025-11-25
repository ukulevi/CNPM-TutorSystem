import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Video } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Sidebar } from '../../components/shared/Sidebar';
import { createSession, getTutorAvailableSchedule } from './api/bookingApi';
import { Tutor, Session, AppointmentSlot } from '../../types';

type BookSessionProps = {
  tutor: Tutor;
  currentUserId: string;
  currentUserName: string;
  onNavigate: (page: string) => void;
};

export function BookSession({ tutor, currentUserId, currentUserName, onNavigate }: BookSessionProps) {
  const [schedule, setSchedule] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Session | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (!tutor) return;

    const fetchSchedule = async () => {
      setIsLoading(true);
      const data = await getTutorAvailableSchedule(tutor.id);
      setSchedule(data);
      setIsLoading(false);
    };

    fetchSchedule();
  }, [tutor]);

  const handleSlotClick = (slot: Session) => {
    setSelectedSlot(slot);
    setShowConfirmDialog(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;
    const sessionData = {
      tutorId: tutor.id,
      tutorName: tutor.name,
      studentId: currentUserId,
      studentName: currentUserName,
      subject: selectedSlot.subject,
      date: selectedSlot.date,
      time: selectedSlot.time,
      type: selectedSlot.type,
      status: 'upcoming', // Thêm status để khớp với kiểu Session
    };
    const result = await createSession(sessionData as Omit<Session, 'id'>);

    if (result) {
      // Đặt lịch thành công
      alert('Lịch hẹn đã được tạo thành công!');
      setShowConfirmDialog(false);
      onNavigate('student-dashboard');
    } else {
      // Đặt lịch thất bại do trùng lịch
      alert('Lỗi: Bạn đã có một buổi hẹn khác vào cùng thời gian này. Vui lòng chọn một khung giờ khác.');
      setShowConfirmDialog(false); // Đóng dialog xác nhận
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts[parts.length - 2]?.charAt(0) + parts[parts.length - 1]?.charAt(0);
  };

  return (
    <div className="flex">
      <Sidebar
        userRole="student"
        userName="Nguyễn Văn A"
        currentPage="book-session"
        onNavigate={onNavigate}
        onLogout={() => onNavigate('login')}
      />

      <div className="flex-1 bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => onNavigate('find-tutor')}
            className="mb-4 text-[#003366] -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#003366]">Đặt lịch hẹn với {tutor.name}</h1>
        </div>

        {/* Main Content */}
        <div className="p-8 max-w-7xl">
          {/* Tutor Info */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-[#4DB8FF] text-white text-xl">
                    {getInitials(tutor.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-[#003366] mb-1">{tutor.name}</h2>
                  <p className="text-gray-600 mb-2">{tutor.department}</p>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[#E0F7FF] text-[#003366]">
                      {tutor.specialization}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-700">{tutor.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <CalendarIcon className="w-5 h-5 text-[#003366]" />
                <h2 className="text-[#003366]">Chọn thời gian phù hợp</h2>
              </div>

              {/* Legend */}
              <div className="flex gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#E0F7FF] border border-[#4DB8FF] rounded"></div>
                  <span className="text-gray-600">Còn trống</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
                  <span className="text-gray-600">Đã đặt</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#003366]" />
                  <span className="text-gray-600">Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#003366]" />
                  <span className="text-gray-600">Trực tiếp</span>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="py-10 text-center text-gray-500">
                  Đang tải lịch rảnh của giảng viên...
                </div>
              )}

              {/* Weekly Schedule Grid */}
              {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {schedule.length > 0 ? (
                  schedule.map((slot) => (
                    <Card key={slot.id} className="p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">{slot.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                           <span className="text-sm">{slot.time}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleSlotClick(slot)}
                        className="w-full mt-4 bg-[#003366] hover:bg-[#004488]"
                      >
                        Đặt lịch
                      </Button>
                    </Card>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 italic">
                    Giảng viên này hiện không có lịch rảnh.
                  </p>
                )}
              </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#003366]">Xác nhận đặt lịch?</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn đặt lịch hẹn môn <span className="font-medium">"{selectedSlot?.subject}"</span> với <span className="text-[#003366]">{tutor.name}</span> vào{' '}
              <span className="text-[#003366]">{selectedSlot?.time}</span> ngày {selectedSlot?.date}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmBooking} className="bg-[#003366] hover:bg-[#004488]">
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
