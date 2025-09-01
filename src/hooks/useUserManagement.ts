// Custom hook for user management state and handlers
// Extracted from CompanyAdminDashboard to maintain exact behavior

import { useState, useEffect, useCallback } from 'react';

export const useUserManagement = () => {
  // User management state - exact same as original
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [displayedUsers, setDisplayedUsers] = useState<number>(10);
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showInactiveWarning, setShowInactiveWarning] = useState<boolean>(false);
  const [userAccountActive, setUserAccountActive] = useState<boolean>(true);
  const [userTwoFactorEnabled, setUserTwoFactorEnabled] = useState<boolean>(true);

  // Mock data - exact same as original
  const mockDrivenUsers = [
    { 
      id: 1, 
      firstName: 'John',
      middleName: 'Michael',
      lastName: 'Smith',
      username: 'jsmith',
      email: 'john.smith@driven.com', 
      active: true, 
      lastLogin: '01/20/2024 2:45 PM',
      phone: '+1 (555) 123-4567',
      joinDate: '03/15/2023',
      twoFactorEnabled: true
    },
    { 
      id: 2, 
      firstName: 'Sarah',
      middleName: 'Anne',
      lastName: 'Johnson',
      username: 'sjohnson',
      email: 'sarah.johnson@driven.com', 
      active: true, 
      lastLogin: '01/19/2024 11:30 AM',
      phone: '+1 (555) 234-5678',
      joinDate: '01/22/2023',
      twoFactorEnabled: true
    },
    { 
      id: 3, 
      firstName: 'Mike',
      middleName: '',
      lastName: 'Wilson',
      username: 'mwilson',
      email: 'mike.wilson@driven.com', 
      active: false, 
      lastLogin: '01/10/2024 9:15 AM',
      phone: '+1 (555) 345-6789',
      joinDate: '08/03/2023',
      twoFactorEnabled: false
    },
    { 
      id: 4, 
      firstName: 'Lisa',
      middleName: 'Marie',
      lastName: 'Brown',
      username: 'lbrown',
      email: 'lisa.brown@driven.com', 
      active: true, 
      lastLogin: '01/20/2024 4:22 PM',
      phone: '+1 (555) 456-7890',
      joinDate: '05/12/2023',
      twoFactorEnabled: true
    },
    { 
      id: 5, 
      firstName: 'David',
      middleName: 'James',
      lastName: 'Lee',
      username: 'dlee',
      email: 'david.lee@driven.com', 
      active: true, 
      lastLogin: '01/19/2024 8:45 AM',
      phone: '+1 (555) 567-8901',
      joinDate: '06/28/2023',
      twoFactorEnabled: false
    },
    { 
      id: 6, 
      firstName: 'Emily',
      middleName: '',
      lastName: 'Chen',
      username: 'echen',
      email: 'emily.chen@driven.com', 
      active: true, 
      lastLogin: '01/20/2024 1:10 PM',
      phone: '+1 (555) 678-9012',
      joinDate: '04/07/2023',
      twoFactorEnabled: true
    },
    { 
      id: 7, 
      firstName: 'Robert',
      middleName: 'William',
      lastName: 'Taylor',
      username: 'rtaylor',
      email: 'robert.taylor@driven.com', 
      active: true, 
      lastLogin: '01/18/2024 10:33 AM',
      phone: '+1 (555) 789-0123',
      joinDate: '02/14/2023',
      twoFactorEnabled: false
    },
    { 
      id: 8, 
      firstName: 'Jennifer',
      middleName: 'Lynn',
      lastName: 'Davis',
      username: 'jdavis',
      email: 'jennifer.davis@driven.com', 
      active: false, 
      lastLogin: '01/05/2024 3:28 PM',
      phone: '+1 (555) 890-1234',
      joinDate: '07/19/2023',
      twoFactorEnabled: true
    }
  ];

  // Filter driven users based on search and filters - exact same logic
  const filteredUsers = mockDrivenUsers.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName}`.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    
    const matchesStatus = userStatusFilter === 'all' || 
                         (userStatusFilter === 'active' && user.active) ||
                         (userStatusFilter === 'inactive' && !user.active);
    
    return matchesSearch && matchesStatus;
  });

  // Get visible users based on display count - exact same logic
  const visibleUsers = filteredUsers.slice(0, displayedUsers);

  // Reset user pagination when filters change - exact same logic
  useEffect(() => {
    setDisplayedUsers(10);
  }, [userSearchQuery, userStatusFilter]);

  // Load more users handler - exact same logic
  const handleLoadMoreUsers = useCallback(() => {
    setDisplayedUsers(prev => prev + 10);
  }, []);

  // Handle edit user - exact same logic
  const handleEditUser = useCallback((user: any) => {
    console.log('Edit user clicked:', user);
    setSelectedUserId(user.id);
    setUserAccountActive(user.active); // Initialize with user's current status
    setUserTwoFactorEnabled(user.twoFactorEnabled); // Initialize with user's current 2FA status
  }, []);

  // Handle save edited user - exact same logic
  const handleSaveEditedUser = useCallback((updatedUser: any) => {
    console.log('Save edited user:', updatedUser);
    // Here you would typically make an API call to update the user
    // For now, we'll just log the action
    alert('User updated successfully!');
  }, []);

  // Handle account status toggle - simplified to toggle directly
  const handleAccountStatusToggle = useCallback(() => {
    const newStatus = !userAccountActive;
    setUserAccountActive(newStatus);
    console.log(`Account ${newStatus ? 'activated' : 'deactivated'} for user:`, selectedUserId);
  }, [userAccountActive, selectedUserId]);

  // Handle 2FA toggle - exact same logic
  const handleTwoFactorToggle = useCallback(() => {
    setUserTwoFactorEnabled(!userTwoFactorEnabled);
    console.log('2FA toggled for user:', selectedUserId, 'New state:', !userTwoFactorEnabled);
  }, [userTwoFactorEnabled, selectedUserId]);

  // Confirm account deactivation - exact same logic
  const confirmAccountDeactivation = useCallback(() => {
    setUserAccountActive(false);
    setShowInactiveWarning(false);
    console.log('Account deactivated for user:', selectedUserId);
  }, [selectedUserId]);

  // Cancel account deactivation - exact same logic
  const cancelAccountDeactivation = useCallback(() => {
    setShowInactiveWarning(false);
    // Keep the checkbox checked since user cancelled
  }, []);

  // Handle save driven user - exact same logic
  const handleSaveDrivenUser = useCallback((userData: any) => {
    console.log('Save new driven user:', userData);
    // Here you would typically make an API call to create the user
    // For now, we'll just simulate success
    alert('User created successfully!');
  }, []);

  // Handle save user profile - exact same logic
  const handleSaveUserProfile = useCallback((profileData: any) => {
    console.log('Save user profile:', profileData);
    // Here you would typically make an API call to update the profile
    // For now, we'll just simulate success
    alert('Profile updated successfully!');
  }, []);

  // Handle reset password - exact same logic
  const handleResetPassword = useCallback((user: any) => {
    // In a real app, this would make an API call to send reset email
    console.log('Sending password reset email to:', user.email);
    
    // Show success message
    alert(`Password reset email sent to ${user.email}!\n\nThe user will receive instructions to reset their password.`);
  }, []);

  return {
    // State
    userSearchQuery,
    setUserSearchQuery,
    displayedUsers,
    userStatusFilter,
    setUserStatusFilter,
    selectedUserId,
    setSelectedUserId,
    showInactiveWarning,
    userAccountActive,
    userTwoFactorEnabled,
    
    // Data
    mockDrivenUsers,
    filteredUsers,
    visibleUsers,
    
    // Handlers
    handleLoadMoreUsers,
    handleEditUser,
    handleSaveEditedUser,
    handleAccountStatusToggle,
    handleTwoFactorToggle,
    confirmAccountDeactivation,
    cancelAccountDeactivation,
    handleSaveDrivenUser,
    handleSaveUserProfile,
    handleResetPassword
  };
};
