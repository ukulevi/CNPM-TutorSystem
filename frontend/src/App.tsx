import { useState, useEffect } from 'react';
import { LoginPage } from './features/authentication/LoginPage.tsx';
import AdminDashboard from './features/dashboard/AdminDashboard.tsx';
import { StudentDashboard } from './features/dashboard/StudentDashboard.tsx';
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
    setUserRole(user.role);

    // --- THÊM ĐOẠN NÀY ---
    if (user.role === 'admin') {
    setCurrentPage('admin-dashboard');
    } 
    // ---------------------
    else if (user.role === 'student') {
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

  const renderContent = () => {
    if (currentPage === 'login') {
      return <LoginPage onLogin={handleLogin} />;
    }

    if (!userRole) {
      // You can show a loading spinner or redirect to login
      return <div>Loading user...</div>;
    }

    switch (currentPage) {
      case 'admin-dashboard':
        return userRole === 'admin' ? (
          <AdminDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
        ) : null;
      case 'student-dashboard':
        return userRole === 'student' ? (
          <StudentDashboard
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onEvaluate={handleEvaluate}
            onSelectTutor={handleSelectTutor}
            onSelectUser={handleSelectUser}
          />
        ) : null;
      case 'profile':
        return (
          <UserProfile
            profileId={currentUserId}
            currentUserId={currentUserId}
            userRole={userRole}
            onNavigate={handleNavigate}
            onSelectTutor={handleBookSession}
            onGoBack={handleGoBack}
          />
        );
      case 'find-tutor':
        return <FindTutor onNavigate={handleNavigate} onSelectTutor={handleSelectTutor} />;
      case 'tutor-dashboard':
        return userRole === 'tutor' ? (
          <TutorDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
        ) : null;
      case 'my-schedule':
      case 'edit-schedule':
        return userRole === 'tutor' ? (
          <TutorSchedulePage userRole={userRole} onNavigate={handleNavigate} onGoBack={handleGoBack} />
        ) : null;
      case 'student-schedule':
        return userRole === 'student' ? (
          <StudentSchedulePage userRole={userRole} onNavigate={handleNavigate} onGoBack={handleGoBack} />
        ) : null;
      case 'documents':
        return (
          <DocumentsPage
            userRole={userRole}
            currentUserId={currentUserId}
            onNavigate={handleNavigate}
            onGoBack={handleGoBack}
          />
        );
      case 'user-search':
        return (
          <UserSearch
            userRole={userRole}
            onNavigate={handleNavigate}
            onSelectUser={handleSelectUser}
          />
        );
      case 'profile-view':
        return viewingProfileId ? (
          <UserProfile
            profileId={viewingProfileId}
            currentUserId={currentUserId}
            userRole={userRole}
            onNavigate={handleNavigate}
            onSelectTutor={handleBookSession}
            onGoBack={handleGoBack}
          />
        ) : null;
      case 'book-session':
        return selectedTutor ? (
          <BookSession
            tutor={selectedTutor}
            currentUserId={currentUserId}
            currentUserName="Nguyễn Văn A"
            onNavigate={handleNavigate}
          />
        ) : null;
      case 'evaluate-session':
        return sessionToEvaluate ? (
          <EvaluateSession session={sessionToEvaluate} onNavigate={handleNavigate} />
        ) : null;
      default:
        // Redirect to a default page based on role if currentPage is invalid
        if (userRole === 'admin') {
          setCurrentPage('admin-dashboard');
        } else if (userRole === 'tutor') {
          setCurrentPage('tutor-dashboard');
        } else {
          setCurrentPage('student-dashboard');
        }
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderContent()}
    </div>
  );
}

export default App;
