import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Edit, Check, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Sidebar } from '../../components/shared/Sidebar';
import { getTutorDashboardData } from '../profile/api/tutorApi';
import { TutorStats, Session } from '../../types';

type TutorDashboardProps = {
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

export function TutorDashboard({ onNavigate, onLogout }: TutorDashboardProps) {
  const [stats, setStats] = useState<TutorStats | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Session[]>([]);
  const [bookedRequests, setBookedRequests] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tutorJoined, setTutorJoined] = useState<{ [key: string]: boolean }>({});
  const [studentJoined, setStudentJoined] = useState<{ [key: string]: boolean }>({});
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Session | null>(null);

  const tutorId = 'tutor-1'; // ID Giảng viên giả lập
  const API_URL = 'http://localhost:3001/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { stats, upcomingAppointments, bookedRequests } = await getTutorDashboardData(tutorId);
      setStats(stats);
      setUpcomingAppointments(upcomingAppointments);
      setBookedRequests(bookedRequests);
      
      // Initialize tutorJoined and studentJoined states based on current appointments
      const newTutorJoined: { [key: string]: boolean } = {};
      const newStudentJoined: { [key: string]: boolean } = {};
      
      upcomingAppointments.forEach(apt => {
        // If status is ongoing, we can infer that at least one party has joined
        // We assume student initiates it, so if status is ongoing, student has joined
        if (apt.status === 'ongoing') {
          newStudentJoined[apt.id] = true;
        }
      });
      
      setTutorJoined(newTutorJoined);
      setStudentJoined(newStudentJoined);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
    setIsLoading(false);
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts[0]?.charAt(0) + parts[parts.length - 1]?.charAt(0);
  };

  const handleConfirmRequest = async (appointment: Session) => {
    try {
      const response = await fetch(`${API_URL}/booking/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'upcoming' }),
      });

      if (response.ok) {
        // Remove from booked list and add to upcoming list
        setBookedRequests(bookedRequests.filter(a => a.id !== appointment.id));
        const updated: Session = { ...appointment, status: 'upcoming' };
        setUpcomingAppointments([...upcomingAppointments, updated].sort(
          (a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
        ));
      }
    } catch (error) {
      console.error('Failed to confirm request:', error);
    }
  };

  const handleRejectRequest = async (appointment: Session) => {
    try {
      const response = await fetch(`${API_URL}/booking/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        setBookedRequests(bookedRequests.filter(a => a.id !== appointment.id));
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const handleJoinAppointment = async (appointment: Session) => {
    try {
      // If already ongoing and tutor has joined, can either leave or wait for student to complete
      if (appointment.status === 'ongoing' && tutorJoined[appointment.id]) {
        // Tutor is cancelling their participation
        const response = await fetch(`${API_URL}/booking/${appointment.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'upcoming' }),
        });

        if (response.ok) {
          setUpcomingAppointments(upcomingAppointments.map(apt =>
            apt.id === appointment.id ? { ...apt, status: 'upcoming' } : apt
          ));
          setTutorJoined(prev => {
            const newState = { ...prev };
            delete newState[appointment.id];
            return newState;
          });
          setStudentJoined(prev => {
            const newState = { ...prev };
            delete newState[appointment.id];
            return newState;
          });
        }
        return;
      }

      // If upcoming or ongoing but tutor hasn't joined, tutor joins now
      // Check if student already joined - if so, mark as completed
      if (appointment.status === 'ongoing' && studentJoined[appointment.id]) {
        // Both have joined - mark as completed
        const response = await fetch(`${API_URL}/booking/${appointment.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'completed' }),
        });

        if (response.ok) {
          setUpcomingAppointments(upcomingAppointments.filter(apt => apt.id !== appointment.id));
          setTutorJoined(prev => {
            const newState = { ...prev };
            delete newState[appointment.id];
            return newState;
          });
          setStudentJoined(prev => {
            const newState = { ...prev };
            delete newState[appointment.id];
            return newState;
          });
        }
        return;
      }

      // Tutor joins first
      const response = await fetch(`${API_URL}/booking/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ongoing' }),
      });

      if (response.ok) {
        setUpcomingAppointments(upcomingAppointments.map(apt =>
          apt.id === appointment.id ? { ...apt, status: 'ongoing' } : apt
        ));
        setTutorJoined(prev => ({ ...prev, [appointment.id]: true }));
      }
    } catch (error) {
      console.error('Failed to join appointment:', error);
    }
  };

  const handleCancelAppointment = async (appointment: Session) => {
    try {
      const response = await fetch(`${API_URL}/booking/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        setUpcomingAppointments(upcomingAppointments.filter(apt => apt.id !== appointment.id));
        setTutorJoined(prev => {
          const newState = { ...prev };
          delete newState[appointment.id];
          return newState;
        });
        setStudentJoined(prev => {
          const newState = { ...prev };
          delete newState[appointment.id];
          return newState;
        });
        setCancelDialogOpen(false);
        setAppointmentToCancel(null);
      }
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  const openCancelDialog = (appointment: Session) => {
    setAppointmentToCancel(appointment);
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    if (appointmentToCancel) {
      handleCancelAppointment(appointmentToCancel);
    }
  };

  return (
    <div className="flex">
      <Sidebar
        userRole="tutor"
        userName="PGS.TS Nguyễn Thành Công"
        currentPage="tutor-dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="flex-1 bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-[#003366]">Trang chủ</h1>
          <p className="text-gray-600">Quản lý lịch hẹn và sinh viên của bạn</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        )}

        {/* Main Content */}
        {!isLoading && stats && (
          <div className="p-8 max-w-7xl">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Tổng buổi hẹn</p>
                      <h2 className="text-[#003366]">{stats.totalSessions}</h2>
                    </div>
                    <div className="w-12 h-12 bg-[#E0F7FF] rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-[#003366]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Sinh viên</p>
                      <h2 className="text-[#003366]">{stats.totalStudents}</h2>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Đánh giá TB</p>
                      <h2 className="text-[#003366]">{stats.averageRating}</h2>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-yellow-600">★</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Upcoming Appointments */}
              <div className="col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#003366]">Các buổi hẹn sắp tới</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingAppointments.length === 0 ? (
                      <p className="text-gray-500 text-sm">Không có buổi hẹn sắp tới</p>
                    ) : (
                      <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-[#4DB8FF] text-white">
                                  {getInitials(appointment.studentName || 'N/A')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="text-[#003366]">{appointment.studentName}</h3>
                                <p className="text-gray-600 text-sm">{appointment.subject}</p>
                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {appointment.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {appointment.time}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-xs ${appointment.type === 'online'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-green-100 text-green-700'
                                    }`}>
                                    {appointment.type === 'online' ? 'Online' : 'Trực tiếp'}
                                  </span>
                                  {appointment.status === 'ongoing' && (
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                      {tutorJoined[appointment.id] ? 'Tutor đã vào' : 'Chờ Tutor'} / {studentJoined[appointment.id] ? 'SV đã vào' : 'Chờ SV'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className={`text-white ${
                                  appointment.status === 'ongoing' && tutorJoined[appointment.id]
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-[#003366] hover:bg-[#004488]'
                                }`}
                                onClick={() => handleJoinAppointment(appointment)}
                              >
                                {appointment.status === 'ongoing' && tutorJoined[appointment.id]
                                  ? 'Hủy tham gia'
                                  : 'Tham gia'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => openCancelDialog(appointment)}
                              >
                                Hủy
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>


                {/* Booked Requests */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#003366]">Yêu cầu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookedRequests.length === 0 ? (
                      <p className="text-gray-500 text-sm">Không có yêu cầu mới</p>
                    ) : (
                      <div className="space-y-4">
                        {bookedRequests.map((request) => (
                          <div
                            key={request.id}
                            className="flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-[#4DB8FF] text-white">
                                  {getInitials(request.studentName || 'N/A')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="text-[#003366] font-medium">{request.studentName}</h3>
                                <p className="text-gray-600 text-sm">{request.subject}</p>
                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {request.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {request.time}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-xs ${request.type === 'online'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-green-100 text-green-700'
                                    }`}>
                                    {request.type === 'online' ? 'Online' : 'Trực tiếp'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-[#003366] hover:bg-[#004488] text-white"
                                onClick={() => handleConfirmRequest(request)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Xác nhận
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleRejectRequest(request)}
                              > 
                                <X className="w-4 h-4 mr-1" />
                                Hủy
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#003366]">Tác vụ nhanh</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={() => onNavigate('edit-schedule')}
                      className="w-full bg-[#003366] hover:bg-[#004488] justify-start h-auto py-4"
                    >
                      <div className="flex items-start gap-3">
                        <Edit className="w-5 h-5 mt-0.5" />
                        <div className="text-left">
                          <div className="font-medium">Chỉnh sửa Lịch rảnh</div>
                          <div className="text-xs text-white/80 mt-1">
                            Tạo slot thời gian cho sinh viên
                          </div>
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-[#003366] text-[#003366] justify-start"
                    >
                      <Calendar className="w-5 h-5 mr-3" />
                      Xem toàn bộ lịch
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-[#003366] text-[#003366] justify-start"
                    >
                      <User className="w-5 h-5 mr-3" />
                      Danh sách sinh viên
                    </Button>
                  </CardContent>
                </Card>

                {/* Help Card */}
                <Card className="mt-6 bg-gradient-to-br from-[#003366] to-[#0099CC] text-white border-0">
                  <CardContent className="p-6">
                    <h3 className="text-white mb-2">Cần hỗ trợ?</h3>
                    <p className="text-white/90 text-sm mb-4">
                      Xem hướng dẫn sử dụng hệ thống hoặc liên hệ với chúng tôi
                    </p>
                    <Button className="w-full bg-white text-[#003366] hover:bg-gray-100">
                      Trung tâm trợ giúp
                    </Button>
                  </CardContent>
                </Card>

              </div>

              {/* Cancel Confirmation Dialog */}
              <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-[#003366]">Xác nhận hủy buổi hẹn</DialogTitle>
                    <DialogDescription>
                      Bạn có chắc chắn muốn hủy buổi hẹn với {appointmentToCancel?.studentName}?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Môn học:</span> {appointmentToCancel?.subject}</p>
                      <p><span className="font-medium">Ngày:</span> {appointmentToCancel?.date}</p>
                      <p><span className="font-medium">Giờ:</span> {appointmentToCancel?.time}</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setCancelDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={confirmCancel}
                    >
                      Xác nhận hủy
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

            </div>
          </div>


        )}
      </div>
    </div>
  );
}
