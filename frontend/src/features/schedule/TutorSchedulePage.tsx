  // Placeholder for TutorSchedulePage.tsx
  import React, { useEffect, useState } from 'react';
  import { Sidebar } from '../../components/shared/Sidebar';
  import { Button } from '../../components/ui/button';
  import { ArrowLeft, CalendarIcon } from 'lucide-react';
  import { Card, CardContent } from '../../components/ui/card';
  import { CalendarDay, CalendarHour, CalendarSlot } from '../../types';
  import { cancelAppointment, createAppointment, getScheduleForTutor } from './api/calendarApi';
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
  import { Input } from '../../components/ui/input';

  type TutorSchedulePageProps = {
    userRole: 'tutor'; // Chỉ dành cho Tutor
    onNavigate: (page: string) => void;
    onGoBack: () => void;
  };

  type SlotDetails = {
    day: string,
    date: string,
    hour: string,
    slot: CalendarSlot | null
  }

  export function TutorSchedulePage({ userRole, onNavigate, onGoBack }: TutorSchedulePageProps) {
    const [schedule, setSchedule] = useState<CalendarDay[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [slotToCancel, setSlotToCancel] = useState<{ day: string; date: string; hour: string; slot: CalendarSlot } | null>(null);

    const [showNewDialog, setShowNewDialog] = useState(false);
    const [slotToDefine, setSlotToDefine] = useState<SlotDetails | null>(null);
    const [newSubject, setNewSubject] = useState('');
    const [newType, setNewType] = useState<'online' | 'offline'>('online');
    const [isDefining, setIsDefining] = useState(false);

    const tutorId = '1'; // ID Sinh viên giả lập
    const placeholderStudentId = '1';

    const fetchSchedule = async () => {
      setIsLoading(true);
      const data = await getScheduleForTutor(tutorId, tutorId, 'tutor');
      console.log(data);
      setSchedule(data);
      setIsLoading(false);
    };

    useEffect(() => {
      fetchSchedule();
    }, [tutorId]);

    const handleSlotClick = (day: string, date: string, hour: string, slot: CalendarSlot | null) => {
      if (!schedule.find(d => d.date === date && d.day === day && d.hours.find(h => h.hour === hour))) return;

      if (slot && slot.status === 'booked') {
        setSlotToCancel({ day, date, hour, slot });
        setShowCancelDialog(true);
      }
      else if (slot && slot.status === 'available') {
        setSlotToDefine({ day, date, hour, slot });
        setNewSubject(slot.subject);
        setNewType('online');
        setShowNewDialog(true);
      }
      else if (slot === null) {
        setSlotToDefine({ day, date, hour, slot: null });
        setNewSubject('');
        setNewType('online');
        setShowNewDialog(true);
      }
    };

    const handleConfirmCancel = async () => {
      if (!slotToCancel) return;

      const success = await cancelAppointment(slotToCancel.slot.id);
      console.log(success);
      if (success) {
        setShowCancelDialog(false);
        fetchSchedule(); // Tải lại lịch sau khi hủy thành công
      } else {
        // Xử lý lỗi nếu cần
        alert('Không thể hủy buổi hẹn. Vui lòng thử lại.');
      }
    };

    const handleConfirmAvailability = async () => {
      if (!slotToDefine || !newSubject) return;

      setIsDefining(true);

      const sessionData = {
        tutorId: tutorId,
        studentId: placeholderStudentId,
        subject: newSubject,
        date: slotToDefine.date,
        time: slotToDefine.hour,
        type: newType,
        status: 'available',
      };

      const success = await createAppointment(sessionData);

      if (success) {
        setShowNewDialog(false);
        setNewSubject('');
        fetchSchedule(); // Tải lại lịch
      } else {
        alert('Không thể định nghĩa buổi. Vui lòng kiểm tra lại thông tin và thử lại.');
      }
      setIsDefining(false);
    };

    const getSlotClassName = (slot: CalendarSlot | null) => {
      if (slot && slot.status === 'booked') {
        return 'bg-red-100 border-red-200 hover:bg-red-200 cursor-pointer';
      }
      if (slot && slot.status === 'available') {
        return 'bg-green-100 border-green-200 hover:bg-green-100 cursor-pointer';
      }
      if (slot && slot.status === 'completed') {
        // Phiên đã hoàn thành: Màu xanh dương nhẹ, không click được (cursor-not-allowed)
        return 'bg-blue-50 border-blue-200 text-blue-800 cursor-not-allowed';
      }
      if (slot === null) {
        return 'bg-white border-gray-200 hover:bg-gray-100 cursor-pointer text-gray-700';
      }
      // Trạng thái khác (ví dụ: unavailable, blocked): Xám và không click
      return 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed';
    };

    const isClickable = (slot: CalendarSlot | null) => {
      return slot?.status === 'booked' || slot === null;
    }

    return (
      <div className="flex">
        <Sidebar
          userRole={userRole}
          userName="PGS.TS Nguyễn Thành Công"
          currentPage="tutor-schedule"
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
            <p className="text-gray-600">Xem lại và quản lý các buổi hẹn đã và sắp diễn ra của bạn.</p>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-[#003366]" />
                    <h2 className="text-[#003366]">Lịch</h2>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div><span className="text-gray-600">Đã ghi danh</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div><span className="text-gray-600">Có sẵn</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div><span className="text-gray-600">Đã hoàn thành</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div><span className="text-gray-600">Không có sẵn</span></div></div>
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
                                    <button
                                      onClick={() => handleSlotClick(dayData.day, dayData.date, hour, slot ?? null)}
                                      disabled={!isClickable(slot ?? null)}
                                      className={`w-full h-full p-2 text-left transition-colors min-h-[60px] flex items-center justify-center ${getSlotClassName(slot ?? null)}`}
                                    >
                                      {slot && slot.status === 'booked' && (
                                        <div className="text-xs text-center">
                                          <p className="font-semibold text-[#003366]">{slot.subject}</p>
                                          {slot.studentName && <p className="text-gray-600">{slot.studentName}</p>}
                                        </div>
                                      )}
                                      {slot && slot.status === 'available' && (
                                        <div className="text-xs text-center text-green-700 font-semibold">
                                          <p className="font-semibold text-[#003366]">{slot.subject}</p>
                                          <p className="text-gray-600">Chưa có sinh viên</p>
                                        </div>
                                      )}
                                      {slot && slot.status === 'completed' && (
                                        <div className="text-xs text-center text-blue-700 font-semibold">
                                          <p className="font-semibold text-[#003366]">{slot.subject}</p>
                                          <p className="text-[#003366]">Đã hoàn thành</p>
                                        </div>
                                      )}
                                      {slot === null && (
                                        <div className="text-xs text-center text-gray-500 font-semibold">
                                          Thiết lập phiên
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

        {/* Cancel Appointment Dialog (No changes needed) */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Xác nhận hủy hẹn?</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn hủy buổi hẹn môn <span className="font-medium">"{slotToCancel?.slot.subject}"</span> với sinh viên <span className="font-medium">{slotToCancel?.slot.studentName}</span> không?
                {/* NOTE: If DialogDescription renders a <p>, this inner <p> needs to be a <div> */}
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

        {/* Define Availability Dialog (No changes needed, but corrected display of time/date) */}
        <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-[#003366]">Định nghĩa chi tiết phiên</DialogTitle>
              <DialogDescription>
                Đặt chủ đề và hình thức cho khung giờ {slotToDefine?.hour}, {slotToDefine?.day} ngày {slotToDefine?.date.split('-').reverse().join('/')} để sinh viên có thể ghi danh.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Môn học/Chủ đề</label>
                <Input
                  id="subject"
                  placeholder="Ví dụ: Hỗ trợ Đồ án KTPM"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="type" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Hình thức</label>
                <Select value={newType} onValueChange={(value) => setNewType(value as 'online' | 'offline')}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Chọn hình thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online (Trực tuyến)</SelectItem>
                    <SelectItem value="offline">Offline (Trực tiếp)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewDialog(false)}>Hủy</Button>
              <Button onClick={handleConfirmAvailability} disabled={!newSubject || isDefining}>
                {isDefining ? 'Đang thiết lập...' : 'Thiết lập khung giờ'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }