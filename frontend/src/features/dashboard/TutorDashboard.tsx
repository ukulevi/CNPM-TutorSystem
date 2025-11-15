import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Edit } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Sidebar } from '../../components/shared/Sidebar';
import { getTutorDashboardData } from '../../api/tutorApi';
import { TutorStats, UpcomingRequest } from '../../types';

type TutorDashboardProps = {
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

export function TutorDashboard({ onNavigate, onLogout }: TutorDashboardProps) {
  const [stats, setStats] = useState<TutorStats | null>(null);
  const [upcomingRequests, setUpcomingRequests] = useState<UpcomingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tutorId = '1'; // ID Giảng viên giả lập

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { stats, requests } = await getTutorDashboardData(tutorId);
      setStats(stats);
      setUpcomingRequests(requests);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts[0]?.charAt(0) + parts[parts.length - 1]?.charAt(0);
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
          <div className="grid grid-cols-4 gap-6 mb-6">
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
                    <p className="text-gray-600 text-sm mb-1">Sắp tới</p>
                    <h2 className="text-[#003366]">{stats.upcomingSessions}</h2>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
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

          <div className="grid grid-cols-3 gap-6">
            {/* Upcoming Sessions */}
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#003366]">Yêu cầu & Hẹn sắp tới</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-[#4DB8FF] text-white">
                              {getInitials(request.studentName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-[#003366]">{request.studentName}</h3>
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
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                request.type === 'online' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {request.type === 'online' ? 'Online' : 'Trực tiếp'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-[#003366] border-[#003366]">
                          Xem chi tiết
                        </Button>
                      </div>
                    ))}
                  </div>
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
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
