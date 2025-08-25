import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfileEdit from '../components/UserProfileEdit';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // Navigation handlers - exact same behavior as OrganizationDashboard
  const handleBack = (): void => {
    navigate('/'); // Navigate to dashboard
  };

  const handleSave = (userData: any): void => {
    console.log('Profile updated:', userData);
    alert('Profile updated successfully!');
    navigate('/'); // Navigate back to dashboard
  };

  return (
    <UserProfileEdit 
      onBack={handleBack}
      onSave={handleSave}
    />
  );
};

export default ProfilePage;