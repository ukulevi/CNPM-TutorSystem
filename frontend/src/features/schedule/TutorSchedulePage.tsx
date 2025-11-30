// Placeholder for TutorSchedulePage.tsx
import React from 'react';
import { UserRole } from '../../types';

type TutorScheduleProps = {
  userRole: Exclude<UserRole, null> | null;
  onNavigate: (page: string) => void;
  onGoBack: () => void;
};

export const TutorSchedulePage: React.FC<TutorScheduleProps> = ({ userRole, onNavigate, onGoBack }) => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Tutor Schedule Page</h1>
      <p className="text-sm text-gray-600 mt-2">This is a placeholder for the tutor's schedule. Role: {userRole}</p>
      <div className="mt-4">
        <button onClick={() => onNavigate('tutor-dashboard')} className="text-blue-600 underline">Back to Dashboard</button>
        <button onClick={onGoBack} className="ml-4 text-gray-600 underline">Go Back</button>
      </div>
    </div>
  );
};