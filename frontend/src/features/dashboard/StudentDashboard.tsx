import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Search, FileText, Star, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Sidebar } from '../../components/shared/Sidebar';
import { getStudentUpcomingAppointments, getStudentCompletedAppointments } from '../profile/api/studentApi';
import { Session, Tutor } from '../../types';

type StudentDashboardProps = {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onEvaluate: (session: Session) => void;
  onSelectTutor: (tutor: Tutor) => void;
  onSelectUser: (userId: string) => void;
};

export function StudentDashboard({ onNavigate, onLogout, onEvaluate, onSelectTutor, onSelectUser }: StudentDashboardProps) {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Session[]>([]);
  const [completedAppointments, setCompletedAppointments] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      const studentId = 'student-1'; // ID sinh viên giả lập
      const [upcoming, completed] = await Promise.all([
        getStudentUpcomingAppointments(studentId),
        getStudentCompletedAppointments(studentId),
      ]);
      setUpcomingAppointments(upcoming);
      setCompletedAppointments(completed);
      setIsLoading(false);
    };
    fetchAppointments();
  }, []);

  const getInitials = (name: string) => name.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase();
  
  return (
    <div className="flex">
      <Sidebar
        userRole="student"
        userName="Nguyễn Văn A"
        currentPage="student-dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="flex-1 bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-[#003366]">Trang chủ</h1>
          <p className="text-gray-600">Chào mừng bạn đến với Tutor Support System</p>
        </div>

        {/* Main Content */}
        <div className="p-8 max-w-7xl">
          {/* Upcoming Sessions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-[#003366]">Buổi hẹn sắp tới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading && <p>Đang tải lịch hẹn...</p>}
              {!isLoading && upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(session => (
                  <div key={session.id} className="bg-gradient-to-r from-[#003366] to-[#0099CC] rounded-xl p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar className="w-12 h-12 border-2 border-white">
                            <AvatarFallback className="bg-white text-[#003366]">
                              {getInitials(session.tutorName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-white">{session.tutorName}</h3>
                            <p className="text-white/80 text-sm">{session.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{session.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button className="bg-white text-[#003366] hover:bg-gray-100">
                          <Video className="w-4 h-4 mr-2" />
                          Tham gia
                        </Button>
                        <Button className="bg-white text-[#003366] hover:bg-gray-100" onClick={() => onEvaluate(session)}>
                          <Star className="w-4 h-4 mr-2" />
                          Đánh giá
                        </Button>
                        <Button className="bg-white text-[#003366] hover:bg-gray-100" >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Hủy
                        </Button>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                !isLoading && <p className="text-gray-500 italic">Bạn không có buổi hẹn nào sắp tới.</p>
              )}
            </CardContent>
          </Card>

          {/* Completed Sessions - Pending Evaluation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-[#003366]">Buổi hẹn cần đánh giá</CardTitle>
            </CardHeader>
              <CardContent className="space-y-3">
              <Button
                onClick={() => onNavigate('find-tutor')}
                className="w-full bg-[#4DB8FF] hover:bg-[#3DA8EF] justify-start"
              >
                <Search className="w-5 h-5 mr-3" />
                Tìm Tutor mới
              </Button>
              <Button
                variant="outline"
                className="w-full border-[#003366] text-[#003366] justify-start"
              >
                <FileText className="w-5 h-5 mr-3" />
                Xem tài liệu học tập
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}