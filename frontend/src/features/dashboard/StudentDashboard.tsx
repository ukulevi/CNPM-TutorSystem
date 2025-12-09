import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Star, Trash2 } from 'lucide-react';
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
  const [studentJoined, setStudentJoined] = useState<{ [key: string]: boolean }>({});
  const [tutorJoined, setTutorJoined] = useState<{ [key: string]: boolean }>({});

  const API_URL = 'http://localhost:3001/api';

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
      
      // Initialize tutorJoined and studentJoined states based on current appointments
      const newTutorJoined: { [key: string]: boolean } = {};
      const newStudentJoined: { [key: string]: boolean } = {};
      
      upcoming.forEach(apt => {
        // If status is ongoing, we can infer that at least one party has joined
        // We assume tutor manages it, so if status is ongoing, tutor has joined
        if (apt.status === 'ongoing') {
          newTutorJoined[apt.id] = true;
        }
      });
      
      setTutorJoined(newTutorJoined);
      setStudentJoined(newStudentJoined);
      setIsLoading(false);
    };
    fetchAppointments();
  }, []);

  const handleJoinSession = async (session: Session) => {
    try {
      // If session is already ongoing and student has joined, can either leave or wait for tutor to complete
      if (session.status === 'ongoing' && studentJoined[session.id]) {
        // Student is cancelling their participation
        const response = await fetch(`${API_URL}/booking/${session.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'upcoming' }),
        });

        if (response.ok) {
          setUpcomingAppointments(upcomingAppointments.map(apt =>
            apt.id === session.id ? { ...apt, status: 'upcoming' } : apt
          ));
          setStudentJoined(prev => {
            const newState = { ...prev };
            delete newState[session.id];
            return newState;
          });
          setTutorJoined(prev => {
            const newState = { ...prev };
            delete newState[session.id];
            return newState;
          });
        }
        return;
      }

      // If ongoing but student hasn't joined, student joins now
      // Check if tutor already joined - if so, mark as completed
      if (session.status === 'ongoing' && tutorJoined[session.id]) {
        // Both have joined - mark as completed
        const response = await fetch(`${API_URL}/booking/${session.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'completed' }),
        });

        if (response.ok) {
          setUpcomingAppointments(upcomingAppointments.filter(apt => apt.id !== session.id));
          setStudentJoined(prev => {
            const newState = { ...prev };
            delete newState[session.id];
            return newState;
          });
          setTutorJoined(prev => {
            const newState = { ...prev };
            delete newState[session.id];
            return newState;
          });
          
          // Refetch completed appointments to trigger evaluation popup
          const studentId = 'student-1';
          const completedApts = await getStudentCompletedAppointments(studentId);
          setCompletedAppointments(completedApts);
        }
        return;
      }

      // Student joins first
      const response = await fetch(`${API_URL}/booking/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ongoing' }),
      });

      if (response.ok) {
        setUpcomingAppointments(upcomingAppointments.map(apt =>
          apt.id === session.id ? { ...apt, status: 'ongoing' } : apt
        ));
        setStudentJoined(prev => ({ ...prev, [session.id]: true }));
      }
    } catch (error) {
      console.error('Failed to join session:', error);
    }
  };

  const handleCancelAppointment = async (session: Session) => {
    if (!window.confirm('Bạn chắc chắn muốn hủy buổi hẹn này?')) return;

    try {
      const response = await fetch(`${API_URL}/booking/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        setUpcomingAppointments(upcomingAppointments.filter(apt => apt.id !== session.id));
      } else {
        console.error('Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  const getInitials = (name: string) => name.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase();

  const sortedUpcoming = [...upcomingAppointments].sort((a, b) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.time.localeCompare(b.time);
  });

  const sortedCompleted = [...completedAppointments].sort((a, b) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.time.localeCompare(b.time);
  });

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
              {!isLoading && sortedUpcoming.length > 0 ? (
                sortedUpcoming.map(session => (
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
                        <Button
                          className="bg-white text-[#003366] hover:bg-gray-100"
                          onClick={() => handleJoinSession(session)}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          {session.status === 'ongoing' && studentJoined[session.id]
                            ? 'Hủy tham gia'
                            : 'Tham gia'}
                        </Button>
                        <Button
                          className="bg-white text-[#003366] hover:bg-gray-100"
                          onClick={() => handleCancelAppointment(session)}
                        >
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
            <CardContent className="space-y-4">
              {sortedCompleted.length > 0 ? (
                sortedCompleted.map(session => (
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
                      <Button
                        className="bg-white text-yellow-500 hover:bg-gray-100"
                        onClick={() => onEvaluate(session)}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Đánh giá
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">Bạn không có buổi hẹn nào cần đánh giá.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}