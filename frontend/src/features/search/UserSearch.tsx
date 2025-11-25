import { useState, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Sidebar } from '../../components/shared/Sidebar';
import { searchUsers } from '../profile/api/profileApi';
import { getDepartments } from './api/findTutorApi';
import { UserRole, Department } from '../../types'; // Import Department từ đây

type UserSearchProps = {
  userRole: 'student' | 'tutor';
  onNavigate: (page: string) => void;
  onSelectUser: (userId: string) => void;
};

export function UserSearch({ userRole, onNavigate, onSelectUser }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState<'all' | 'student' | 'tutor'>('all');
  const [users, setUsers] = useState<any[]>([]); // Sử dụng any hoặc một kiểu dữ liệu chung hơn
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepts = async () => {
      const depts = await getDepartments();
      setDepartments(depts);
    };
    fetchDepts();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const results = await searchUsers({
        query: searchQuery,
        department: selectedDepartment,
        role: selectedRole,
      });
      setUsers(results);
      setIsLoading(false);
    };

    const handler = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, selectedDepartment, selectedRole]);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts[parts.length - 2]?.charAt(0) + parts[parts.length - 1]?.charAt(0);
  };

  return (
    <div className="flex">
      <Sidebar
        userRole={userRole}
        userName={userRole === 'tutor' ? 'PGS.TS Nguyễn Thành Công' : 'Nguyễn Văn A'}
        currentPage="user-search"
        onNavigate={onNavigate}
        onLogout={() => onNavigate('login')}
      />

      <div className="flex-1 bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => onNavigate(userRole === 'tutor' ? 'tutor-dashboard' : 'student-dashboard')}
            className="mb-4 text-[#003366] -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#003366]">Danh bạ người dùng</h1>
          <p className="text-gray-600">Tìm kiếm giảng viên và sinh viên trong hệ thống</p>
        </div>

        <div className="p-8 max-w-7xl">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Tìm theo tên, chuyên môn, lĩnh vực quan tâm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'all' | 'student' | 'tutor')}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="tutor">Giảng viên</option>
                <option value="student">Sinh viên</option>
              </select>
              <select
                value={selectedDepartment} 
                onChange={(e) => setSelectedDepartment(e.target.value)} 
                className="col-span-3 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#003366]"
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

          {isLoading ? (
            <div className="text-center text-gray-500 py-10">Đang tìm kiếm...</div>
          ) : users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card key={user.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-[#4DB8FF] text-white text-xl">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-[#003366]">{user.name}</h3>
                        <p className="text-gray-500 text-sm">{user.department}</p>
                        <Badge
                          variant={user.role === 'tutor' ? 'default' : 'secondary'}
                          className={`mt-2 ${user.role === 'tutor' ? 'bg-blue-100 text-blue-700' : ''}`}
                        >
                          {user.role === 'tutor' ? 'Giảng viên' : 'Sinh viên'}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => onSelectUser(user.id)}
                      className="w-full mt-4 bg-[#003366] hover:bg-[#004488]"
                    >
                      Xem hồ sơ
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>Không tìm thấy người dùng nào phù hợp.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}