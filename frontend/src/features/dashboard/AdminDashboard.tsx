import React, { useState, useEffect, useCallback } from 'react';
import {
  getDashboardStats,
  getAcademicReport,
  DashboardStats,
} from '../admin/api/analyticsApi'; // Giữ nguyên vì đã đúng
import { getAllUsers, updateUserRole } from '../admin/api/adminApi'; // Giữ nguyên vì đã đúng
import { synchronizeData, SyncResult } from '../admin/api/dataSyncApi'; // Giữ nguyên vì đã đúng
import { UserProfileData, AcademicReport } from '../../types/adminTypes';

// --- Helper Components (for better structure) ---

interface StatCardProps {
  title: string;
  value: string | number;
  children: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{children}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, show, onClose }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-bounce">
      {message}
      <button onClick={onClose} className="ml-4 font-bold">X</button>
    </div>
  );
};

interface AdminDashboardProps {
  onLogout: () => void;
}

/**
 * Admin Dashboard component for system management and analytics.
 */
const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  // --- State Management ---
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserProfileData[]>([]);
  const [academicReport, setAcademicReport] = useState<Omit<AcademicReport, 'departmentId'>[]>([]);
  
  const [isLoading, setIsLoading] = useState({ stats: true, users: true, report: true });
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  // --- Data Fetching ---
  const fetchData = useCallback(async () => {
    try {
      // Fetch all data in parallel
      const [statsData, usersData, reportData] = await Promise.all([
        getDashboardStats(),
        getAllUsers(),
        getAcademicReport(),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setAcademicReport(reportData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setToast({ show: true, message: 'Error loading data!' });
    } finally {
      setIsLoading({ stats: false, users: false, report: false });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Event Handlers ---
  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      const result: SyncResult = await synchronizeData();
      if (result.success) {
        setToast({ show: true, message: `Synced successfully at ${new Date(result.lastSyncTime).toLocaleTimeString()}` });
      }
    } catch (error) {
      console.error("Sync failed:", error);
      setToast({ show: true, message: 'Sync failed!' });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserProfileData['role']) => {
    // Optimistic UI update
    const originalUsers = [...users];
    setUsers(users.map((u: UserProfileData) => (u.id === userId ? { ...u, role: newRole } : u)));

    try {
      await updateUserRole(userId, newRole);
      setToast({ show: true, message: "User role updated!" });
    } catch (error) {
      console.error("Failed to update role:", error);
      setToast({ show: true, message: "Failed to update role." });
      setUsers(originalUsers); // Revert on failure
    } finally {
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <Toast message={toast.message} show={toast.show} onClose={() => setToast({ show: false, message: '' })} />
      
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Portal</h1>
        <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </header>

      {/* Section 1: System Overview */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Users" value={isLoading.stats ? '...' : stats?.totalUsers ?? 0}>
            {/* User Icon */} <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>
          </StatCard>
          <StatCard title="Total Sessions" value={isLoading.stats ? '...' : stats?.totalAppointments ?? 0}>
            {/* Calendar Icon */} <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </StatCard>
          <StatCard title="System Health" value={isLoading.stats ? '...' : (stats?.averageRating ?? 0) > 4 ? 'Good' : 'Needs Attention'}>
            {/* Heart Icon */} <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </StatCard>
        </div>
        <div className="mt-6 text-right">
          <button onClick={handleSyncData} disabled={isSyncing} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-flex items-center disabled:opacity-50">
            {isSyncing && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
            {isSyncing ? 'Syncing...' : 'Synchronize Data'}
          </button>
        </div>
      </section>

      {/* Section 2 & 3 in a grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Management Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading.users ? (<tr><td colSpan={3} className="text-center py-4">Loading users...</td></tr>) : 
                users.map((user: UserProfileData) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={user.role}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleRoleChange(user.id, e.target.value as UserProfileData['role'])}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                        <option value="admin">Admin</option>
                        <option value="academic_dept">Academic Dept</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Report Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Hiệu quả hoạt động theo Khoa</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khoa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading.report ? (<tr><td colSpan={2} className="text-center py-4">Loading report...</td></tr>) : 
              academicReport.map((report: Omit<AcademicReport, 'departmentId'>) => (
                <tr key={report.departmentName}>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{report.departmentName}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 font-semibold">{report.avgRating} ⭐</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;