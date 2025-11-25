import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, MapPin, Star, Edit, Calendar, FileText, Pin, Lock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Sidebar } from '../../components/shared/Sidebar';
import { getUserProfile, updateUserProfile } from './api/profileApi';
import { getScheduleForTutor, getScheduleForStudent } from '../schedule/api/calendarApi';
import { getDocuments } from '../documents/api/documentApi';
import { Tutor, CalendarDay, Document as Doc } from '../../types'; // Đã sửa ở các bước trước

// Define the UserProfileData type here or import from a central types file
// if it's used elsewhere. Renamed from UserProfile to UserProfileData to avoid conflict
type UserProfileData = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department?: string;
  officeLocation?: string;
  role: 'student' | 'tutor';
  rating?: number;
  specialization?: string;
  publications?: { title: string; link: string; public: boolean }[];
  major?: string;
  cohort?: string;
  academicInterests?: { interest: string; public: boolean }[];
  coursesOfInterest?: { course: string; public: boolean }[];
  scheduleVisibility?: 'public' | 'private';
  documentsVisibility?: 'public' | 'private';
};

type UserProfileProps = {
  profileId: string; // ID của người dùng cần xem hồ sơ
  currentUserId: string; // ID của người dùng đang đăng nhập
  userRole: 'student' | 'tutor';
  onNavigate: (page: string) => void;
  onSelectTutor: (tutor: Tutor) => void;
  onGoBack: () => void;
};

export function UserProfile({ profileId, currentUserId, userRole, onNavigate, onSelectTutor, onGoBack }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [schedule, setSchedule] = useState<CalendarDay[]>([]);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  // State để lưu dữ liệu trong form chỉnh sửa
  const [editData, setEditData] = useState({
    academicInterests: '',
    coursesOfInterest: '',
    scheduleVisibility: 'private' as 'public' | 'private',
    documentsVisibility: 'private' as 'public' | 'private',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const profileData = await getUserProfile(profileId);
      setProfile(profileData);

      if (profileData) {
        // Fetch schedule and documents in parallel
        const schedulePromise = profileData.role === 'tutor'
          ? getScheduleForTutor(profileId, currentUserId, userRole) // Truyền thông tin người xem
          : getScheduleForStudent(profileId); // Sửa lại: chỉ cần truyền studentId
        
        const documentsPromise = getDocuments(profileId);

        const [scheduleData, documentsData] = await Promise.all([schedulePromise, documentsPromise]);
        setSchedule(scheduleData);
        setDocuments(documentsData);
      }

      setIsLoading(false);
    };
    fetchProfile();
  }, [profileId, currentUserId, userRole]);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts[parts.length - 2]?.charAt(0) + parts[parts.length - 1]?.charAt(0);
  };

  const isOwnProfile = profileId === currentUserId;
  const canViewSchedule = isOwnProfile || profile?.scheduleVisibility === 'public';
  const canViewDocuments = isOwnProfile || profile?.documentsVisibility === 'public';


  const handleBookAppointment = () => {
    if (profile && profile.role === 'tutor') {
      const tutorData: Tutor = {
        id: profile.id,
        name: profile.name,
        department: profile.department || '',
        specialization: profile.specialization || '',
        rating: profile.rating || 0,
        avatar: profile.avatar,
      };
      onSelectTutor(tutorData);
    }
  };

  const handleOpenEditDialog = () => {
    if (!profile) return;
    // Khởi tạo form với dữ liệu hiện tại, chuyển từ mảng object thành chuỗi
    setEditData({ // @ts-ignore
      academicInterests: profile.academicInterests?.filter((i: { public: any; }) => i.public).map((i: { interest: any; }) => i.interest).join(', ') || '',
      coursesOfInterest: profile.coursesOfInterest?.filter((c: { public: any; }) => c.public).map((c: { course: any; }) => c.course).join(', ') || '',
      scheduleVisibility: profile.scheduleVisibility || 'private',
      documentsVisibility: profile.documentsVisibility || 'private',
    });
    setShowEditDialog(true);
  };

  const handleSaveChanges = async () => {
    if (!profile) return;

    // Chuyển chuỗi từ form thành mảng object để lưu
    const updatedInterests = editData.academicInterests.split(',').map(s => s.trim()).filter(Boolean).map(interest => ({ interest, public: true }));
    const updatedCourses = editData.coursesOfInterest.split(',').map(s => s.trim()).filter(Boolean).map(course => ({ course, public: true }));

    const updatedProfile = await updateUserProfile(profile.id, {
      academicInterests: updatedInterests,
      coursesOfInterest: updatedCourses,
      scheduleVisibility: editData.scheduleVisibility,
      documentsVisibility: editData.documentsVisibility,
    });

    if (updatedProfile) {
      setProfile(updatedProfile); // Cập nhật lại giao diện với thông tin mới
    }

    setShowEditDialog(false);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleVisibilityChange = (name: 'scheduleVisibility' | 'documentsVisibility', value: 'public' | 'private') => {
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Đang tải hồ sơ...</div>;
  }

  if (!profile) {
    return <div className="flex h-screen items-center justify-center">Không tìm thấy hồ sơ người dùng.</div>;
  }

  return (
    <div className="flex">
      <Sidebar
        userRole={userRole}
        userName={userRole === 'tutor' ? 'PGS.TS Nguyễn Thành Công' : 'Nguyễn Văn A'}
        currentPage="profile-view" // Một currentPage tạm thời
        onNavigate={onNavigate}
        onLogout={() => onNavigate('login')}
      />

      <div className="flex-1 bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <Button
            variant="ghost"
            onClick={onGoBack} // Sử dụng onGoBack đã được truyền vào
            className="mb-4 text-[#003366] -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#003366]">Hồ sơ cá nhân</h1>
        </div>

        {/* Main Content */}
        <div className="p-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center md:flex-row md:items-start gap-8">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center text-center md:w-1/3">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarFallback className="bg-[#4DB8FF] text-white text-4xl">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl text-[#003366]">{profile.name}</h2>
                  <p className="text-gray-600">{profile.department}</p>
                  {profile.role === 'tutor' && profile.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-700">{profile.rating} / 5.0</span>
                    </div>
                  )}
                  {/* Logic hiển thị nút hành động được cải tiến */}
                  {isOwnProfile ? (
                     <Button onClick={handleOpenEditDialog} className="mt-4 w-full bg-orange-500 hover:bg-orange-600">
                        <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa hồ sơ
                    </Button>
                  ) : userRole === 'student' && profile.role === 'tutor' ? (
                    <Button onClick={handleBookAppointment} className="mt-4 w-full bg-[#003366] hover:bg-[#004488]">
                        Đặt lịch hẹn
                    </Button>
                  ) : null}
                </div>

                {/* Detailed Info */}
                <div className="w-full md:w-2/3 space-y-6">
                  {/* Contact Info */}
                  <div>
                    <h3 className="text-lg text-[#003366] mb-2 border-b pb-2">Thông tin liên hệ</h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /> {profile.email}</p>
                      {profile.officeLocation && (
                        <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-500" /> {profile.officeLocation}</p>
                      )}
                    </div>
                  </div>

                  {/* Tutor Specific Info */}
                  {profile.role === 'tutor' && (
                    <>
                      <div>
                        <h3 className="text-lg text-[#003366] mb-2 border-b pb-2">Chuyên môn</h3>
                        <Badge className="bg-[#E0F7FF] text-[#003366]">{profile.specialization}</Badge>
                      </div>
                      <div>
                        <h3 className="text-lg text-[#003366] mb-2 border-b pb-2">Công trình nghiên cứu</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                      {profile.publications?.filter((p: { public: any; }) => p.public).map((pub: { link: string; title: string; }, i: number) => (
                            <li key={i}><a href={pub.link} className="text-blue-600 hover:underline">{pub.title}</a></li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                  {/* Student Specific Info */}
                  {profile.role === 'student' && (
                     <>
                        <div>
                            <h3 className="text-lg text-[#003366] mb-2 border-b pb-2">Thông tin học tập</h3>
                            <div className="text-sm">
                                <p><strong>Chuyên ngành:</strong> {profile.major}</p>
                                <p><strong>Khóa:</strong> {profile.cohort}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg text-[#003366] mb-2 border-b pb-2">Lĩnh vực quan tâm</h3>
                            <div className="flex flex-wrap gap-2">
                            {profile.academicInterests?.filter((i: { public: any; }) => i.public).map((interest: { interest: string; }, idx: number) => (
                                    <Badge key={idx} variant="secondary">{interest.interest}</Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg text-[#003366] mb-2 border-b pb-2">Khóa học quan tâm</h3>
                            <div className="flex flex-wrap gap-2">
                            {profile.coursesOfInterest?.filter((c: { public: any; }) => c.public).map((course: { course: string; }, idx: number) => (
                                    <Badge key={idx} variant="secondary">{course.course}</Badge>
                                ))}
                            </div>
                        </div>
                     </>
                  )}

                  {/* Schedule Section */}
                  <div>
                    <h3 className="text-lg text-[#003366] mb-2 border-b pb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5" /> Thời khóa biểu
                    </h3>
                    {canViewSchedule ? (
                      <div className="text-sm text-gray-700">
                        {schedule.flatMap(day => day.hours).filter(h => h.slot).length > 0 ? (
                          <ul className="space-y-1">
                            {schedule.map(day =>
                              day.hours.filter(h => h.slot).map((hour, idx) => (
                                <li key={`${day.date}-${hour.hour}-${idx}`}>
                                  <strong>{day.day}, {hour.hour}:</strong> {hour.slot?.subject}
                                  {hour.slot?.tutorName && ` (với ${hour.slot.tutorName})`}
                                  {hour.slot?.studentName && ` (với ${hour.slot.studentName})`}
                                </li>
                              ))
                            )}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">Không có lịch hẹn nào trong tuần.</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-500 italic">
                        <Lock className="w-4 h-4" />
                        <p>Thời khóa biểu của người dùng này là riêng tư.</p>
                      </div>
                    )}
                  </div>

                  {/* Documents Section */}
                  <div>
                    <h3 className="text-lg text-[#003366] mb-2 border-b pb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5" /> Kho tài liệu
                    </h3>
                    {canViewDocuments ? (
                      <div className="text-sm text-gray-700">
                        {documents.filter(d => isOwnProfile || d.visibility === 'public').length > 0 ? (
                          <ul className="space-y-1">
                            {documents
                              .filter(d => isOwnProfile || d.visibility === 'public')
                              .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
                              .map(doc => (
                                <li key={doc.id} className="flex items-center gap-2">
                                  {doc.pinned && <Pin className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                                  <a href={doc.url} className="text-blue-600 hover:underline">{doc.name}</a>
                                </li>
                              ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">Không có tài liệu công khai nào.</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-500 italic">
                        <Lock className="w-4 h-4" />
                        <p>Kho tài liệu của người dùng này là riêng tư.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#003366]">Chỉnh sửa hồ sơ</DialogTitle>
            <DialogDescription>
              Cập nhật các lĩnh vực và khóa học bạn quan tâm.
              <br />
              <span className="text-xs text-gray-500">Mỗi mục cách nhau bởi dấu phẩy ( , )</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {profile?.role === 'student' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="academicInterests">Lĩnh vực quan tâm</Label>
                  <Textarea
                    id="academicInterests"
                    name="academicInterests"
                    value={editData.academicInterests}
                    onChange={handleEditFormChange}
                    placeholder="Ví dụ: Lập trình web, Học máy, An toàn thông tin"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coursesOfInterest">Khóa học quan tâm</Label>
                  <Textarea
                    id="coursesOfInterest"
                    name="coursesOfInterest"
                    value={editData.coursesOfInterest}
                    onChange={handleEditFormChange}
                    placeholder="Ví dụ: CO3001, MA1001"
                    className="min-h-[100px]"
                  />
                </div>
              </>
            )}
            {/* Thêm các trường cho Tutor ở đây nếu cần */}
            <div className="space-y-2">
              <Label>Hiển thị thời khóa biểu</Label>
              <RadioGroup
                value={editData.scheduleVisibility}
                onValueChange={(value: 'public' | 'private') => handleVisibilityChange('scheduleVisibility', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="edit-schedule-public" />
                  <Label htmlFor="edit-schedule-public">Công khai</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="edit-schedule-private" />
                  <Label htmlFor="edit-schedule-private">Riêng tư</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Hiển thị tài liệu</Label>
              <RadioGroup
                value={editData.documentsVisibility}
                onValueChange={(value: 'public' | 'private') => handleVisibilityChange('documentsVisibility', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="edit-documents-public" />
                  <Label htmlFor="edit-documents-public">Công khai</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="edit-documents-private" />
                  <Label htmlFor="edit-documents-private">Riêng tư</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Hủy</Button>
            <Button onClick={handleSaveChanges} className="bg-[#003366] hover:bg-[#004488]">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}