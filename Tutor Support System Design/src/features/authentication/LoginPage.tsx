import { Button } from '../../components/ui/button';
import { UserRole } from '../../types';

type LoginPageProps = {
  onLogin: (role: UserRole) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
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

        {/* SSO Login Button */}
        <Button
          onClick={() => onLogin('student')}
          className="w-full bg-[#003366] hover:bg-[#004488] text-white h-14 text-lg mb-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-sm">
              BK
            </div>
            <span>Đăng nhập qua HCMUT-SSO</span>
          </div>
        </Button>

        {/* Demo: Tutor Login */}
        <Button
          onClick={() => onLogin('tutor')}
          variant="outline"
          className="w-full h-12 border-[#003366] text-[#003366] hover:bg-[#003366]/5"
        >
          Demo: Đăng nhập với vai trò Tutor
        </Button>

        <p className="text-center text-gray-500 text-sm mt-6">
          Sử dụng tài khoản HCMUT của bạn để đăng nhập
        </p>
      </div>
    </div>
  );
}
