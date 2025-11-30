// Placeholder for TutorSchedulePage.tsx
import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/shared/Sidebar';
import { Button } from '../../components/ui/button';
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { CalendarDay, CalendarHour, CalendarSlot } from '../../types';
import { addAvailableSlot, cancelAppointment, createAppointment, deleteAvailableSlot, freeSlot, getScheduleForTutor, ScheduleDay } from './api/calendarApi';
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
  hour: string,
  status: 'available' | null
}

const WEEK_DAYS_MAPPING = [
  { key: 'Monday', display: 'Thứ Hai' },
  { key: 'Tuesday', display: 'Thứ Ba' },
  { key: 'Wednesday', display: 'Thứ Tư' },
  { key: 'Thursday', display: 'Thứ Năm' },
  { key: 'Friday', display: 'Thứ Sáu' },
  { key: 'Saturday', display: 'Thứ Bảy' },
  { key: 'Sunday', display: 'Chủ Nhật' },
];
const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', // Morning
  '13:00', '14:00', '15:00', '16:00', '17:00',          // Afternoon
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'   // Evening/Night
];

export function TutorSchedulePage({ userRole, onNavigate, onGoBack }: TutorSchedulePageProps) {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [slotToCancel, setSlotToCancel] = useState<{ day: string; hour: string } | null>(null);

  const [showNewDialog, setShowNewDialog] = useState(false);
  const [slotToDefine, setSlotToDefine] = useState<SlotDetails | null>(null);
  const [newSubject, setNewSubject] = useState('');
  const [newType, setNewType] = useState<'online' | 'offline'>('online');
  const [isDefining, setIsDefining] = useState(false);

  const tutorId = '1';
  const placeholderStudentId = '1';

  const fetchSchedule = async () => {

    // Fetch data from mock API
    const data: ScheduleDay[] | undefined = await getScheduleForTutor(tutorId, tutorId);
    if (data) {
      // Fill in missing days with empty slot arrays for rendering consistency
      const fullSchedule = WEEK_DAYS_MAPPING.map(day => {
        const existingDay = data.find(d => d.day === day.key);
        return existingDay || { day: day.key, slots: [] };
      });
      setSchedule(fullSchedule);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [tutorId]);

  const handleSlotClick = (day: string, hour: string, status: any) => {

    if (status === 'available') {
      setSlotToCancel({ day, hour });
      handleConfirmCancel();
    }
    else if (status === null) {
      setSlotToDefine({ day, hour, status });
      handleConfirmAvailability();
    }
  };

  const handleConfirmCancel = async () => {
    if (!slotToCancel) return;

    const success = await freeSlot(tutorId, slotToCancel.day, slotToCancel.hour);
    if (success) {
      fetchSchedule(); // Tải lại lịch sau khi hủy thành công
    } else {
      // Xử lý lỗi nếu cần
      alert('Không thể xóa mốc thời gian. Vui lòng thử lại.');
    };
    setSlotToCancel(null);
  };

  const handleConfirmAvailability = async () => {
    if (!slotToDefine) return;

    setIsDefining(true);

    const success = await addAvailableSlot(tutorId, slotToDefine.day, slotToDefine.hour);

    if (success) {
      setNewSubject('');
      fetchSchedule(); // Tải lại lịch
    } else {
      alert('Không thể định nghĩa buổi. Vui lòng kiểm tra lại thông tin và thử lại.');
    }
    setSlotToDefine(null);
    setIsDefining(false);
  };

  const getSlotClassName = (status: any) => {
    if (status && status === 'available') {
      return 'bg-green-100 border-green-200 hover:bg-green-100 cursor-pointer';
    }
    if (status === null) {
      return 'bg-gray-100 border-gray-200 hover:bg-gray-100 cursor-pointer text-gray-700';
    }
    // Trạng thái khác (ví dụ: unavailable, blocked): Xám và không click
    return 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed';
  };

  return (
    <div className="flex">
      {/* Sidebar và Header không thay đổi */}
      <Sidebar
        userRole={userRole}
        userName="PGS.TS Nguyễn Thành Công"
        currentPage="tutor-schedule"
        onNavigate={onNavigate}
        onLogout={() => onNavigate('login')}
      />

      <div className="flex-1 bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <Button variant="ghost" onClick={onGoBack} className="mb-4 text-[#003366] -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#003366]">Lịch của tôi</h1>
          <p className="text-gray-600">Nhấp chuột một ô để thay đổi trạng thái</p>
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
                {/* Legend */}
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div><span className="text-gray-600">Rảnh</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div><span className="text-gray-600">Thêm Rảnh</span></div>
                </div>
              </div>

              {isLoading && <div className="text-center py-10">Đang tải lịch...</div>}

              {!isLoading && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-300">
                        <th className="text-center p-3 border-r border-gray-300 font-medium text-gray-600 w-24 bg-gray-50">Giờ</th>
                        {WEEK_DAYS_MAPPING.map((day) => (
                          <th key={day.key} className="text-center p-3 border-r last:border-r-0 border-b bg-gray-50">
                            <p className="font-medium text-gray-700">{day.display}</p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TIME_SLOTS.map((hour, index) => {
                        const isLastRow = index === TIME_SLOTS.length - 1;
                        return (
                          <tr key={hour}>
                            <td className={`text-center p-2 bg-gray-50 border-r border-gray-300 ${!isLastRow ? 'border-b border-gray-200' : ''}`}>
                              <span className="text-gray-700 text-sm">{hour}</span>
                            </td>
                            {WEEK_DAYS_MAPPING.map((day) => {
                              const dayData = schedule.find(d => d.day === day.key) || { day: day.key, slots: [] };

                              const isAvailable = dayData.slots.includes(hour);
                              const status: 'available' | null = isAvailable ? 'available' : null;

                              const isClickableSlot = status === 'available' || status === null;

                              return (
                                <td key={`${day.key}-${hour}`} className="p-0 border-b border-r last:border-r-0">
                                  <button
                                    type='button'
                                    onClick={() => isClickableSlot ? handleSlotClick(dayData.day, hour, status) : null}
                                    className={`w-full h-full p-2 text-left transition-colors min-h-[60px] flex items-center justify-center ${getSlotClassName(status)}`}
                                  >
                                    {status === 'available' && (
                                      <div className="text-xs text-center text-green-700 font-semibold">
                                      </div>
                                    )}
                                    {status === null && (
                                      <div className="text-xs text-center text-gray-500 font-semibold">
                                      </div>
                                    )}
                                    {/* Nếu có trạng thái 'booked', nó sẽ dùng bg-gray-200 và text-gray-600 */}
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
      {/* Dialogs: Mặc dù bạn không yêu cầu sửa đổi Dialog, tôi giữ nguyên chúng nhưng logic click hiện tại đã bỏ qua việc hiển thị chúng */}
    </div>
  );

  // return (
  //   <div className="flex">
  //     <Sidebar
  //       userRole={userRole}
  //       userName="PGS.TS Nguyễn Thành Công"
  //       currentPage="tutor-schedule"
  //       onNavigate={onNavigate}
  //       onLogout={() => onNavigate('login')}
  //     />

  //     <div className="flex-1 bg-gray-50">
  //       {/* Header (No changes) */}
  //       <div className="bg-white border-b border-gray-200 px-8 py-6">
  //         <Button variant="ghost" onClick={onGoBack} className="mb-4 text-[#003366] -ml-2">
  //           <ArrowLeft className="w-4 h-4 mr-2" />
  //           Quay lại
  //         </Button>
  //         <h1 className="text-[#003366]">Lịch của tôi</h1>
  //         <p className="text-gray-600">Xem và điều chỉnh lịch hằng tuần của bạn.</p>
  //       </div>

  //       {/* Main Content */}
  //       <div className="p-8">
  //         <Card>
  //           <CardContent className="p-6">
  //             <div className="flex items-center justify-between mb-6">
  //               <div className="flex items-center gap-2">
  //                 <CalendarIcon className="w-5 h-5 text-[#003366]" />
  //                 <h2 className="text-[#003366]">Lịch</h2>
  //               </div>
  //               {/* Legend (No changes) */}
  //               <div className="flex gap-4 text-sm">
  //                 <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div><span className="text-gray-600">Rảnh</span></div>
  //                 <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div><span className="text-gray-600">Không rảnh / Chưa xác định</span></div></div>
  //             </div>

  //             {isLoading && <div className="text-center py-10">Đang tải lịch...</div>}

  //             {!isLoading && (
  //               <div className="overflow-x-auto rounded-lg border ">
  //                 <table className="min-w-full w-full border-collapse">
  //                   <thead>
  //                     <tr className="bg-gray-50">
  //                       <th className="text-center p-3 border-b border-r font-medium text-gray-600 w-24">Giờ</th>
  //                       {DAYS_OF_WEEK.map((dayName) => (
  //                         <th key={dayName} className="text-center p-3 border-b border-r last:border-r-0">
  //                           <p className="font-medium text-gray-700">{dayName}</p>
  //                         </th>
  //                       ))}
  //                     </tr>
  //                   </thead>
  //                   <tbody>
  //                     {/* 3. HARDCODE HOURS: Use fixed TIME_SLOTS array for iteration */}
  //                     {TIME_SLOTS.map((hour) => {
  //                       return (
  //                         <tr key={hour}>
  //                           <td className="text-center p-2 bg-gray-50 border-b border-r">
  //                             <span className="text-gray-700 text-sm">{hour}</span>
  //                           </td>
  //                           {/* Iterate over the days in the schedule data */}
  //                           {DAYS_OF_WEEK.map((dayName) => {
  //                             const dayData = schedule.find(d => d.day === dayName) || { day: dayName, slots: [] };

  //                             const isAvailable = dayData.slots.includes(hour);
  //                             const status: 'available' | null = isAvailable ? 'available' : null;
  //                             return (
  //                               <td key={`${dayName}-${hour}`} className="p-0 border-b border-r last:border-r-0">
  //                                 <button
  //                                   onClick={() => handleSlotClick(dayData.day, hour, status)}
  //                                   className={`w-full h-full p-2 text-left transition-colors min-h-[60px] flex items-center justify-center ${getSlotClassName(status)}`}
  //                                 >
  //                                   {status === 'available' && (
  //                                     <div className="text-xs text-center text-green-700 font-semibold">
  //                                     </div>
  //                                   )}
  //                                   {status === null && (
  //                                     <div className="text-xs text-center text-gray-500 font-semibold">
  //                                       Nhấn để chuyển sang Rảnh
  //                                     </div>
  //                                   )}
  //                                 </button>
  //                               </td>
  //                             );
  //                           })}
  //                         </tr>
  //                       );
  //                     })}
  //                   </tbody>
  //                 </table>
  //               </div>
  //             )}
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </div>
  //   </div>
  // );
}