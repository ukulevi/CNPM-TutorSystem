import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Sidebar } from '../../components/shared/Sidebar';
import { getScheduleForStudent, cancelAppointment } from './api/calendarApi';
import { CalendarDay, CalendarHour, CalendarSlot } from '../../types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';

type StudentSchedulePageProps = {
  userRole: 'student' | 'tutor' | 'admin';
  onNavigate: (page: string) => void;
  onGoBack: () => void;
};

export function StudentSchedulePage({ userRole, onNavigate, onGoBack }: StudentSchedulePageProps) {
  const [schedule, setSchedule] = useState<CalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [slotToCancel, setSlotToCancel] = useState<{ day: string; date: string; hour: string; slot: CalendarSlot } | null>(null);

  const studentId = 'student-1'; // ID Sinh viên giả lập

  const fetchSchedule = async () => {
    setIsLoading(true);
    // Gọi API để lấy lịch của sinh viên
    const data = await getScheduleForStudent(studentId);
    setSchedule(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSchedule();
  }, [studentId]); // Thêm studentId vào dependency array

  const handleSlotClick = (day: string, date: string, hour: string, slot: CalendarSlot | null) => {
    if (slot && slot.status === 'booked') {
      setSlotToCancel({ day, date, hour, slot });
      setShowCancelDialog(true);
    }
  };

  const handleConfirmCancel = async () => {
    if (!slotToCancel) return;

    const success = await cancelAppointment(slotToCancel.slot.id);
    if (success) {
      setShowCancelDialog(false);
      fetchSchedule(); // Tải lại lịch sau khi hủy thành công
    } else {
      // Xử lý lỗi nếu cần
      alert('Không thể hủy buổi hẹn. Vui lòng thử lại.');
    }
  };

  return (
    <div className="flex">
      <Sidebar
        userRole={userRole}
        userName="Nguyễn Văn A"
        currentPage="student-schedule"
        onNavigate={onNavigate}
        onLogout={() => onNavigate('login')}
      />

      <div className="flex-1 bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <Button variant="ghost" onClick={onGoBack} className="mb-4 text-[#003366] -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#003366]">Thời khóa biểu của tôi</h1>
          <p className="text-gray-600">Xem lại các buổi hẹn đã và sắp diễn ra của bạn.</p>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#003366]" />
                  <h2 className="text-[#003366]">Lịch tuần (11/11 - 17/11/2025)</h2>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div><span className="text-gray-600">Đã ghi danh</span></div>
                </div>
              </div>

              {isLoading && <div className="text-center py-10">Đang tải lịch...</div>}

              {!isLoading && (
                <div className="overflow-x-auto rounded-lg border ">
                  <table className="min-w-full w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-center p-3 border-b border-r font-medium text-gray-600 w-24">Giờ</th>
                        {schedule.map((dayData) => (
                          <th key={dayData.date} className="text-center p-3 border-b border-r last:border-r-0">
                            <p className="font-medium text-gray-700">{dayData.day}</p>
                            <p className="text-sm text-gray-500">{dayData.date}</p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.length > 0 && schedule[0].hours.map((hourObj: CalendarHour) => {
                          const hour = hourObj.hour;
                          return (
                            <tr key={hour}>
                              <td className="text-center p-2 bg-gray-50 border-b border-r">
                                <span className="text-gray-700 text-sm">{hour}</span>
                              </td>
                              {schedule.map((dayData: CalendarDay) => {
                                const hourData = dayData.hours.find((h: CalendarHour) => h.hour === hour);
                                const slot = hourData?.slot;
                                return (
                                  <td key={`${dayData.date}-${hour}`} className="p-0 border-b border-r last:border-r-0">
                                    <button                                      onClick={() => handleSlotClick(dayData.day, dayData.date, hour, slot ?? null)}
                                      disabled={!slot || slot.status !== 'booked'}
                                      className={`w-full h-full p-2 text-left transition-colors min-h-[60px] flex items-center justify-center ${
                                        slot ? 'bg-red-100 border-red-200 hover:bg-red-200 cursor-pointer' : ''
                                      }`}
                                    >
                                      {slot && (
                                        <div className="text-xs text-center">
                                          <p className="font-semibold text-[#003366]">{slot.subject}</p>
                                          {slot.tutorName && <p className="text-gray-600">{slot.tutorName}</p>}
                                        </div>
                                      )}
                                    </button>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Appointment Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Xác nhận hủy hẹn?</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy buổi hẹn môn <span className="font-medium">"{slotToCancel?.slot.subject}"</span> với giảng viên <span className="font-medium">{slotToCancel?.slot.tutorName}</span> không?
              <p className="font-medium text-gray-700 mt-2">
                Thời gian: {slotToCancel?.hour}, {slotToCancel?.day}, {slotToCancel?.date.split('-').reverse().join('/')}
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>Không</Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>Xác nhận hủy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}