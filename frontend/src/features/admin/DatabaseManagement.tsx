import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { UserManagement } from './UserManagement';
import { TutorManagement } from './TutorManagement';
import { BookingManagement } from './BookingManagement';
import { DocumentManagement } from './DocumentManagement';
import { ArrowLeft } from 'lucide-react';

type ManagementView = 'users' | 'tutors' | 'bookings' | 'documents' | null;

export const DatabaseManagement: React.FC = () => {
    const [view, setView] = useState<ManagementView>(null);

    const renderView = () => {
        switch (view) {
            case 'users':
                return <UserManagement />;
            case 'tutors':
                return <TutorManagement />;
            case 'bookings':
                return <BookingManagement />;
            case 'documents':
                return <DocumentManagement />;
            default:
                return (
                    <div className="space-y-4">
                        {/* <p className="text-gray-600 text-sm mb-4">Select a management section to get started:</p> */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => setView('users')}
                                className="h-auto py-6 flex flex-col items-center gap-0 hover:bg-blue-50"
                            >
                                <span className="text-2xl"></span>
                                <span>Quản lí người dùng</span>
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => setView('tutors')}
                                className="h-auto py-6 flex flex-col items-center gap-0 hover:bg-blue-50"
                            >
                                <span className="text-2xl"></span>
                                <span>Quản lí Tutor </span>
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => setView('bookings')}
                                className="h-auto py-6 flex flex-col items-center gap-0 hover:bg-blue-50"
                            >
                                <span className="text-2xl"></span>
                                <span>Quản lí cuộc hẹn</span>
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => setView('documents')}
                                className="h-auto py-6 flex flex-col items-center gap-0 hover:bg-blue-50"
                            >
                                <span className="text-2xl"></span>
                                <span>Quản lí tài liệu</span>
                            </Button>
                        </div>
                    </div>
                );
        }
    };

    return (
        // <Card>
        //     <CardHeader>
        //         <div className="flex items-center justify-between"> 
        //             <CardTitle>Database Management</CardTitle>
        //             {view && (
        //                 <Button 
        //                     variant="ghost" 
        //                     size="sm" 
        //                     onClick={() => setView(null)}
        //                     className="gap-2"
        //                 >
        //                     <ArrowLeft className="h-4 w-4" />
        //                     Back
        //                 </Button>
        //             )}
        //         </div>
        //     </CardHeader>
        //     <CardContent>
        //         {renderView()}
        //     </CardContent>
        // </Card>
        <div>
            {view && (
                <Button 
                    variant="ghost" size="sm" 
                    onClick={() => setView(null)}
                    className="gap-2"
                >
                <ArrowLeft className="h-4 w-4" />
                    Quay lại
                </Button>
            )}
            {renderView()}
        </div>
    );
};
