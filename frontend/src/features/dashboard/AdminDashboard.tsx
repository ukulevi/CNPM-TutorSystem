import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { LogOut, BarChart, Users, Database } from 'lucide-react';
import { UserManagement } from '../admin/UserManagement';
import { AnalyticsDashboard } from '../admin/AnalyticsDashboard';
import { DatabaseManagement } from '../admin/DatabaseManagement';

type Props = {
    onNavigate: (page: string) => void;
    onLogout: () => void;
};


type AdminTab = 'analytics' | 'userManagement' | 'databaseManagement';

export const AdminDashboard: React.FC<Props> = ({ onNavigate, onLogout }) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

    const renderContent = () => {
        switch (activeTab) {
            case 'analytics':
                return <AnalyticsDashboard />;
            case 'userManagement':
                return <UserManagement />;
            case 'databaseManagement':
                return <DatabaseManagement />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar-like Navigation */}
            <nav className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between">
                <div>
                    <div className="px-4 py-2 mb-4">
                        <h1 className="text-xl font-bold text-[#003366]">Admin Panel</h1>
                    </div>
                    <ul>
                        <li>
                            <Button
                                variant={activeTab === 'analytics' ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                onClick={() => setActiveTab('analytics')}
                            >
                                <BarChart className="mr-2 h-4 w-4" />
                                Analytics
                            </Button>
                        </li>
                        <li>
                            <Button
                                variant={activeTab === 'userManagement' ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                onClick={() => setActiveTab('userManagement')}
                            >
                                <Users className="mr-2 h-4 w-4" />
                                User Management
                            </Button>
                        </li>
                        <li>
                            <Button
                                variant={activeTab === 'databaseManagement' ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                onClick={() => setActiveTab('databaseManagement')}
                            >
                                <Database className="mr-2 h-4 w-4" />
                                Database Management
                            </Button>
                        </li>
                    </ul>
                </div>
                <div>
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600" onClick={onLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="capitalize text-[#003366]">
                            {activeTab.replace(/([A-Z])/g, ' ')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {renderContent()}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default AdminDashboard;