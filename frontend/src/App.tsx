import { useState, useEffect } from 'react';
import { LoginPage } from './features/authentication/LoginPage.tsx';
import { StudentDashboard } from './features/dashboard/StudentDashboard.tsx';
import AdminDashboard from './features/dashboard/AdminDashboard.tsx';
import { FindTutor } from './features/search/FindTutor.tsx';
import { BookSession } from './features/booking/BookSession.tsx';
import { TutorDashboard } from './features/dashboard/TutorDashboard.tsx';
import { TutorSchedulePage } from './features/schedule/TutorSchedulePage.tsx';
import { StudentSchedulePage } from './features/schedule/StudentSchedulePage.tsx';
import { UserSearch } from './features/search/UserSearch.tsx';
import { UserProfile } from './features/profile/UserProfile.tsx'; // Đã sửa ở các bước trước
import { DocumentsPage } from './features/documents/DocumentsPage.tsx';
import { EvaluateSession } from './features/booking/EvaluateSession.tsx';
import { UserRole, Tutor, Session, User } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [previousPage, setPreviousPage] = useState<string>('login');
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);
  const [sessionToEvaluate, setSessionToEvaluate] = useState<Session | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Preserve the actual role (so admin remains 'admin') and let effectiveRole
    // map admin to a UI-facing role for components that expect 'student'|'tutor'.
    setUserRole(user.role as UserRole);
    if (user.role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else if (user.role === 'student') {
      setCurrentPage('student-dashboard');
    } else if (user.role === 'tutor') {
      setCurrentPage('tutor-dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setCurrentPage('login');
    setSelectedTutor(null);
    setViewingProfileId(null);
  };

  const handleNavigate = (page: string) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
  };

  const handleGoBack = () => {
    // Lấy trang dashboard mặc định dựa trên vai trò người dùng
    const dashboardPage = userRole === 'tutor' ? 'tutor-dashboard' : 'student-dashboard';
    // Điều hướng về trang trước đó
    setCurrentPage(previousPage);
    // Đặt lại "trang trước đó" thành trang dashboard để ngăn việc quay lại 2 lần
    setPreviousPage(dashboardPage);
  };

  // Khi người dùng chọn một gia sư từ danh sách tìm kiếm
  const handleSelectTutor = (tutor: Tutor) => {
    setViewingProfileId(tutor.id);
    setCurrentPage('profile-view');
  };

  // Khi người dùng nhấn nút "Đặt lịch" từ trang hồ sơ của gia sư
  const handleBookSession = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setCurrentPage('book-session');
  };

  const handleSelectUser = (userId: string) => {
    setViewingProfileId(userId);
    setCurrentPage('profile-view');
  };

  const handleEvaluate = (session: Session) => {
    setSessionToEvaluate(session);
    setCurrentPage('evaluate-session');
  };

  // ID người dùng giả lập
  const currentUserId = currentUser ? currentUser.id : '';

  return (
    <div className="min-h-screen bg-white">
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentPage === 'admin-dashboard' && userRole === 'admin' && ( // nhớ sửa sau khi code Admin Dáshboard
        <AdminDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
      {currentPage === 'student-dashboard' && userRole === 'student' && ( // Sửa onSelectTutor thành handleSelectTutor
        <StudentDashboard onNavigate={handleNavigate} onLogout={handleLogout} onEvaluate={handleEvaluate} onSelectTutor={handleSelectTutor} onSelectUser={handleSelectUser} />
      )}
      {/* Xử lý khi nhấn vào mục "Hồ sơ của tôi" trên sidebar */}
      {currentPage === 'profile' && (userRole === 'student' || userRole === 'tutor') && ( /*error fix: profile page is only for userRole as student | tutor when userRole is admin | student | tutor */
        <UserProfile profileId={currentUserId} currentUserId={currentUserId} userRole={userRole} onNavigate={handleNavigate} onSelectTutor={handleBookSession} onGoBack={handleGoBack} />
      )}
      {currentPage === 'find-tutor' && (
        <FindTutor onNavigate={handleNavigate} onSelectTutor={handleSelectTutor} />
      )}
      {currentPage === 'tutor-dashboard' && userRole === 'tutor' && (
        <TutorDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
      {currentPage === 'my-schedule' && userRole === 'tutor' && (
        <TutorSchedulePage userRole={userRole} onNavigate={handleNavigate} onGoBack={handleGoBack} />
      )}
      {currentPage === 'edit-schedule' && userRole === 'tutor' && (
        <TutorSchedulePage userRole={userRole} onNavigate={handleNavigate} onGoBack={handleGoBack} />
      )}
      {currentPage === 'student-schedule' && userRole === 'student' && (
        <StudentSchedulePage userRole={userRole} onNavigate={handleNavigate} onGoBack={handleGoBack} />
      )}
      {currentPage === 'documents' && (userRole === 'student' || userRole === 'tutor') && ( /*error fix: profile page is only for userRole as student | tutor when userRole is admin | student | tutor */
        <DocumentsPage userRole={userRole} currentUserId={currentUserId} onNavigate={handleNavigate} onGoBack={handleGoBack} />
      )}
      {currentPage === 'user-search' && (userRole === 'student' || userRole === 'tutor') && ( /*error fix: profile page is only for userRole as student | tutor when userRole is admin | student | tutor */
        <UserSearch userRole={userRole} onNavigate={handleNavigate} onSelectUser={handleSelectUser} />
      )}
      {currentPage === 'profile-view' && viewingProfileId && (userRole === 'student' || userRole === 'tutor') && ( // Sửa onSelectTutor thành handleBookSession  /*error fix: profile page is only for userRole as student | tutor when userRole is admin | student | tutor */
        <UserProfile profileId={viewingProfileId} currentUserId={currentUserId} userRole={userRole} onNavigate={handleNavigate} onSelectTutor={handleBookSession} onGoBack={handleGoBack} />
      )}
      {currentPage === 'book-session' && selectedTutor && (
        <BookSession tutor={selectedTutor} currentUserId={currentUserId} currentUserName="Nguyễn Văn A" onNavigate={handleNavigate} />
      )}
      {currentPage === 'evaluate-session' && sessionToEvaluate && (
        <EvaluateSession session={sessionToEvaluate} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
