import React from 'react';

type Props = {
    onNavigate: (page: string) => void;
    onLogout: () => void;
};

export const AdminDashboard: React.FC<Props> = ({ onNavigate, onLogout }) => {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-[#003366]">Admin Dashboard (Placeholder)</h1>
            <p className="mt-2 text-gray-600">This is a placeholder admin dashboard.</p>
            <div className="mt-6 flex gap-3">
                <button className="px-4 py-2 bg-[#003366] text-white rounded" onClick={() => onNavigate('profile')}>My Profile</button>
                <button className="px-4 py-2 border rounded" onClick={() => onNavigate('user-search')}>User Search</button>
                <button className="px-4 py-2 text-red-600 border rounded" onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
};

export default AdminDashboard;