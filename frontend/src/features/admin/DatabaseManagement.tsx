import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { UserManagement } from './UserManagement';

type ManagementView = 'users' | 'tutors' | 'bookings' | 'documents' | null;

export const DatabaseManagement: React.FC = () => {
    const [view, setView] = useState<ManagementView>(null);

    const renderView = () => {
        switch (view) {
            case 'users':
                return <UserManagement />;
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Button variant="outline" onClick={() => setView('users')}>Manage Users</Button>
                        <Button variant="outline" onClick={() => setView('tutors')}>Manage Tutors</Button>
                        <Button variant="outline" onClick={() => setView('bookings')}>Manage Bookings</Button>
                        <Button variant="outline" onClick={() => setView('documents')}>Manage Documents</Button>
                    </div>
                );
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Database Management</CardTitle>
            </CardHeader>
            <CardContent>
                {view && <Button variant="ghost" onClick={() => setView(null)}>Back</Button>}
                {renderView()}
            </CardContent>
        </Card>
    );
};
