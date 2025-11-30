// Sidebar navigation component used across the application
// Displays different menu items based on user role (student or tutor)
import { Home, Search, FileText, User, LogOut, Calendar, Users } from 'lucide-react';
import { Button } from '../ui/button';

type SidebarProps = {
  userRole: 'student' | 'tutor';
  userName: string;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

export function Sidebar({ userRole, userName, currentPage, onNavigate, onLogout }: SidebarProps) {
  const studentMenuItems = [
    { id: 'student-dashboard', label: 'Trang chủ', icon: Home },
    { id: 'find-tutor', label: 'Tìm Tutor', icon: Search },
    { id: 'student-schedule', label: 'Thời khóa biểu', icon: Calendar },
    { id: 'documents', label: 'Tài liệu', icon: FileText },
    { id: 'profile', label: 'Hồ sơ', icon: User },
  ];

  const tutorMenuItems = [
    { id: 'tutor-dashboard', label: 'Trang chủ', icon: Home },
    { id: 'my-schedule', label: 'Lịch của tôi', icon: Calendar },
    { id: 'documents', label: 'Tài liệu', icon: FileText },
    { id: 'profile', label: 'Hồ sơ', icon: User },
  ];

  const menuItems = userRole === 'student' ? studentMenuItems : tutorMenuItems;

  return (
    <div className="w-64 bg-[#003366] min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#4DB8FF] rounded-lg flex items-center justify-center">
            <div className="text-white">BK</div>
          </div>
          <div>
            <p className="text-white/60 text-sm">Chào,</p>
            <p className="text-white">{userName}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Check if current item is active: match both exact ID and profile-related pages
          const isActive = currentPage === item.id || (item.id === 'profile' && currentPage === 'profile-view');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-[#4DB8FF] text-white'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start text-white/80 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}