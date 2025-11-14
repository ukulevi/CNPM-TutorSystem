import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Sidebar } from './shared/Sidebar';
import { getScheduleForTutor, addAvailableSlot, deleteAvailableSlot } from '../api/calendarApi';
import { CalendarDay, CalendarSlot, UserRole } from '../types';

//--- Component chính (Main Component) ---

type MySchedulePageProps = {
  userRole: 'tutor'; // Chỉ dành cho Tutor
  onNavigate: (page: string) => void;
  onGoBack: () => void;
};

export function MySchedulePage({ userRole, onNavigate, onGoBack }: MySchedulePageProps) {
  const [schedule, setSchedule] = useState<CalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ day: string; date: string; hour: string } | null>(null);
  const [subject, setSubject] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [slotToCancel, setSlotToCancel] = useState<{ day: string; date: string; hour: string; slot: CalendarSlot } | null>(null);

  const tutorId = '1'; // ID Giảng viên giả lập
  const currentUserId = '1'; // Giả lập người xem cũng là chủ nhân của lịch

  const fetchSchedule = async () => {
    setIsLoading(true);
    const data = await getScheduleForTutor(tutorId, currentUserId, 'tutor');
    setSchedule(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleCellClick = (day: string, date: string, hour: string) => {
    setSelectedCell({ day, date, hour });
    setSubject(''); // Reset input
    setShowCreateDialog(true);
  };

  const handleCreateSlot = async () => {
    if (!selectedCell || !subject) return;

    await addAvailableSlot(tutorId, selectedCell.date, selectedCell.hour, subject);
    setShowCreateDialog(false);
    fetchSchedule(); // Tải lại lịch để hiển thị slot mới
  };

  const handleSlotClick = (day: string, date: string, hour: string, slot: CalendarSlot | null) => {
    if (!slot) {
      // Nếu ô trống, mở dialog tạo mới
      handleCellClick(day, date, hour);
    } else if (slot.status === 'available') {
      // Nếu là slot "còn trống", mở dialog hủy
      setSlotToCancel({ day, date, hour, slot });
      setShowCancelDialog(true);
    }
  };

  const handleConfirmCancel = async () => {
    if (!slotToCancel) return;
    await deleteAvailableSlot(tutorId, slotToCancel.date, slotToCancel.hour);
    setShowCancelDialog(false);
    fetchSchedule(); // Tải lại lịch
  };

  // Lấy danh sách giờ từ ngày đầu tiên (giả định tất cả các ngày có cùng số giờ)
  const hoursInDay = schedule.length > 0 ? schedule[0].hours.map(h => h.hour) : [];

  return (
    <div className="flex">
      <Sidebar
        userRole={userRole}
        userName="PGS.TS Nguyễn Thành Công"
        currentPage="my-schedule"
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
          <h1 className="text-[#003366]">Lịch của tôi</h1>
          <p className="text-gray-600">Tạo và quản lý các slot thời gian cho sinh viên đặt lịch.</p>
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
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#E0F7FF] border border-[#4DB8FF] rounded"></div><span className="text-gray-600">Còn trống</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div><span className="text-gray-600">Đã đặt</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-dashed border-gray-300 rounded"></div><span className="text-gray-600">Chưa tạo</span></div>
                </div>
              </div>

              {isLoading && <div className="text-center py-10">Đang tải lịch...</div>}

              {!isLoading && (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full w-full border-collapse">
                    {/* Header Row */}
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-center p-3 border-b border-r font-medium text-gray-600 w-24">Giờ</th>
                        {schedule.map((dayData) => (
                          <th key={dayData.date} className="text-center p-3 border-b border-r last:border-r-0">
                            <p className="font-medium text-gray-700">{dayData.day}</p>
                            <p className="text-sm text-gray-500">{dayData.date.split('-').reverse().slice(0, 2).join('/')}</p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {hoursInDay.map((hour) => (
                        <tr key={hour}>
                          {/* Hour Cell */}
                          <td className="text-center p-2 bg-gray-50 border-b border-r">
                            <span className="text-gray-700 text-sm">{hour}</span>
                          </td>
                          
                          {/* Slot Cells */}
                          {schedule.map((dayData) => {
                            const hourData = dayData.hours.find(h => h.hour === hour);
                            const slot = hourData?.slot || null;

                            return (
                              <td key={`${dayData.date}-${hour}`} className="p-0 border-b border-r last:border-r-0">
                                <button
                                  onClick={() => handleSlotClick(dayData.day, dayData.date, hour, slot)}
                                  disabled={slot?.status === 'booked' || slot?.status === 'personal'}
                                  className={`w-full h-full p-2 text-left transition-colors min-h-[60px] flex items-center justify-center ${
                                    !slot ? 'border-2 border-dashed border-gray-300 hover:border-[#4DB8FF] hover:bg-[#F0F9FF] cursor-pointer' :
                                    slot.status === 'booked' ? 'bg-red-100 border border-red-200 cursor-not-allowed opacity-70' :
                                    slot.status === 'available' ? 'bg-[#E0F7FF] border border-[#4DB8FF] hover:bg-[#ccefff] cursor-pointer' :
                                    ''
                                  }`}
                                >
                                  {slot ? (
                                    <div className="text-xs text-center w-full">
                                      <p className="font-semibold text-[#003366]">{slot.subject}</p>
                                      {slot.studentName && <p className="text-gray-600">{slot.studentName}</p>}
                                    </div>
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-gray-400" />
                                    </div>
                                  )}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Slot Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#003366]">Thêm cuộc hẹn mới</DialogTitle>
            <DialogDescription>
              Tạo một slot hẹn kéo dài 1 tiếng cho sinh viên đăng ký.
              <p className="font-medium text-gray-700 mt-2">
                {selectedCell?.day}, {selectedCell?.date} lúc {selectedCell?.hour}
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Tên môn học</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ví dụ: Kỹ thuật phần mềm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Hủy</Button>
            <Button onClick={handleCreateSlot} className="bg-[#003366] hover:bg-[#004488]">Tạo cuộc hẹn</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Slot Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Hủy cuộc hẹn?</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy slot hẹn <span className="font-medium">"{slotToCancel?.slot.subject}"</span> này không?
              <p className="font-medium text-gray-700 mt-2">
                {slotToCancel?.day}, {slotToCancel?.date} lúc {slotToCancel?.hour}
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