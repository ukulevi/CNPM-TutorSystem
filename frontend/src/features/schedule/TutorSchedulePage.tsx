import React from 'react';
import { UserRole } from '../../types';

type TutorSchedulePageProps = {
  userRole: UserRole;
  onNavigate: (page: string) => void;
  onGoBack: () => void;
};

export const TutorSchedulePage: React.FC<TutorSchedulePageProps> = ({ userRole, onNavigate, onGoBack }) => {
  return (
    <div>
      <h1>Tutor Schedule Page</h1>
      <p>This is a placeholder for the tutor's schedule.</p>
      <p>Current role: {userRole}</p>
      <button onClick={onGoBack}>Go Back</button>
    </div>
  );
};

