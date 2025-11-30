import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { getAllProfiles } from '../../features/profile/api/profileApi';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types/index';
type LoginPageProps = {
  onLogin: (user: User) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();


  const handleLoginAsStudent = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await auth.loginAsStudent();
      if (user) onLogin(user);
      else setError('Failed to login as student');
    } catch (e) {
      console.error('Login error:', e);
      setError('Login failed. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginAsTutor = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await auth.loginAsTutor();
      if (user) onLogin(user);
      else setError('Failed to login as tutor');
    } catch (e) {
      console.error('Login error:', e);
      setError('Login failed. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginAsAdmin = async () => {
    setIsLoading(true);
    try {
      const user = await auth.loginAsAdmin();
      if (user) onLogin(user);
      else setError('Failed to login as admin');
    } catch (e) {
      console.error('Admin login error', e);
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003366] to-[#0099CC]">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full mx-4">
        {/* Logo HCMUT */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-[#003366] to-[#4DB8FF] rounded-lg flex items-center justify-center shadow-lg">
            <div className="text-white text-4xl">BK</div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-[#003366] mb-2">Tutor Support System</h1>
          <p className="text-gray-600">Trường Đại học Bách Khoa TP.HCM</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Login as Student Button - SSO */}
        <Button
          onClick={handleLoginAsStudent}
          disabled={isLoading}
          className="w-full bg-[#003366] hover:bg-[#004488] text-white h-14 text-lg mb-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-sm">
              BK
            </div>
            <span>{isLoading ? 'Đang tải...' : 'Đăng nhập qua HCMUT-SSO'}</span>  
          </div>
        </Button>

        {/* Login as Tutor Button */}
        <Button
          onClick={handleLoginAsTutor}
          disabled={isLoading}
          variant="outline"
          className="w-full h-12 border-[#003366] text-[#003366] hover:bg-[#003366]/5"
        >
          {isLoading ? 'Đang tải...' : 'Đăng nhập với tài khoản Tutor'}
        </Button>

        {/* Login as Admin Button */}
        <div className="mt-4">
          <Button
            onClick={handleLoginAsAdmin}
            disabled={isLoading}
            variant="ghost"
            className="w-full text-sm text-gray-700"
          >
            {isLoading ? 'Đang tải...' : 'Admin'}
          </Button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Sử dụng tài khoản HCMUT của bạn để đăng nhập
        </p>
      </div>
    </div>
  );
}
