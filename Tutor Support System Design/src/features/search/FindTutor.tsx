import { useState, useEffect } from 'react';
import { Search, Sparkles, Star, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { getTutors, getDepartments } from '../../api/findTutorApi'; // Sửa đường dẫn import
import { Sidebar } from '../../components/shared/Sidebar';
import { Tutor, Department } from '../../types';

type FindTutorProps = {
  onNavigate: (page: string) => void;
  onSelectTutor: (tutor: Tutor) => void;
};

export function FindTutor({ onNavigate, onSelectTutor }: FindTutorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect để lấy danh sách các khoa một lần khi component được tạo
  useEffect(() => {
    const fetchDepartments = async () => {
      const depts = await getDepartments();
      setDepartments(depts);
    };
    fetchDepartments();
  }, []);

  // useEffect để lấy danh sách giảng viên mỗi khi query hoặc khoa thay đổi
  useEffect(() => {
    const fetchTutors = async () => {
      setIsLoading(true);
      const results = await getTutors({
        query: searchQuery,
        department: selectedDepartment,
      });
      setTutors(results);
      setIsLoading(false);
    };

    // Sử dụng debounce để tránh gọi API liên tục khi người dùng gõ
    const handler = setTimeout(() => {
      fetchTutors();
    }, 300); // Chờ 300ms sau khi người dùng ngừng gõ

    return () => clearTimeout(handler); // Cleanup
  }, [searchQuery, selectedDepartment]);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts[parts.length - 2]?.charAt(0) + parts[parts.length - 1]?.charAt(0);
  };

  return (
    <div className="flex">
      <Sidebar
        userRole="student"
        userName="Nguyễn Văn A"
        currentPage="find-tutor"
        onNavigate={onNavigate}
        onLogout={() => onNavigate('login')}
      />

      <div className="flex-1 bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4 text-[#003366] -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#003366]">Tìm Tutor</h1>
          <p className="text-gray-600">Tìm kiếm và chọn giảng viên phù hợp với bạn</p>
        </div>

        {/* Main Content */}
        <div className="p-8 max-w-7xl">
          {/* AI Suggestion Banner */}
          <Card className="mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white mb-1">Gợi ý Tutor tự động bằng AI</h3>
                    <p className="text-white/90 text-sm">
                      Để AI tìm kiếm và gợi ý Tutor phù hợp nhất với nhu cầu học tập của bạn
                    </p>
                  </div>
                </div>
                <Button className="bg-white text-orange-500 hover:bg-gray-100">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Khám phá ngay
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Tìm theo tên, môn học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value as string)}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                <option value="all">Tất cả các khoa</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tutors Grid & Loading/Empty States */}
          {isLoading ? (
            <div className="text-center text-gray-500 py-10">Đang tìm kiếm...</div>
          ) : tutors.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {tutors.map((tutor) => (
                <Card key={tutor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="w-20 h-20 mb-4">
                        <AvatarFallback className="bg-[#4DB8FF] text-white text-xl">
                          {getInitials(tutor.name)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-[#003366] mb-2">{tutor.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{tutor.department}</p>
                      <Badge className="bg-[#E0F7FF] text-[#003366] mb-3">
                        {tutor.specialization}
                      </Badge>
                      <div className="flex items-center gap-1 mb-4">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-700">{tutor.rating}</span>
                        <span className="text-gray-400 text-sm">/5.0</span>
                      </div>
                      <Button
                        onClick={() => onSelectTutor(tutor)}
                        className="w-full bg-[#003366] hover:bg-[#004488]"
                      >
                        Xem Hồ sơ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>Không tìm thấy giảng viên nào phù hợp.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
