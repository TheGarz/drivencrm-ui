// Custom hook for organization management state and handlers
// Extracted from CompanyAdminDashboard to maintain exact behavior

import { useState, useEffect, useCallback } from 'react';

export const useOrganizationManagement = () => {
  // Organizations page state - exact same as original
  const [orgSearchQuery, setOrgSearchQuery] = useState<string>('');
  const [displayedOrgs, setDisplayedOrgs] = useState<number>(10);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | null>(null);

  // Mock organizations data - exact same as original
  const mockOrganizations = [
    { id: 1, name: 'Cross Pest Control', active: true, userCount: 47, branchCount: 3, integrationCount: 5, reviewsEnabled: true, rewardsEnabled: true },
    { id: 2, name: 'White Knight', active: true, userCount: 23, branchCount: 2, integrationCount: 3, reviewsEnabled: false, rewardsEnabled: true },
    { id: 3, name: 'Pest-Stop', active: false, userCount: 8, branchCount: 1, integrationCount: 1, reviewsEnabled: false, rewardsEnabled: false },
    { id: 4, name: 'ACTION Termite & Pest Control', active: true, userCount: 156, branchCount: 8, integrationCount: 7, reviewsEnabled: true, rewardsEnabled: false },
    { id: 5, name: 'Thorn Pest Solutions', active: true, userCount: 34, branchCount: 2, integrationCount: 4, reviewsEnabled: true, rewardsEnabled: true },
    { id: 6, name: 'Pest Master', active: true, userCount: 67, branchCount: 4, integrationCount: 6, reviewsEnabled: false, rewardsEnabled: true },
    { id: 7, name: 'Trads Pest Control', active: false, userCount: 12, branchCount: 1, integrationCount: 2, reviewsEnabled: false, rewardsEnabled: false },
    { id: 8, name: 'Kanga Pest Control', active: true, userCount: 89, branchCount: 5, integrationCount: 5, reviewsEnabled: true, rewardsEnabled: false },
    { id: 9, name: 'Cape Pest Control', active: true, userCount: 45, branchCount: 3, integrationCount: 4, reviewsEnabled: false, rewardsEnabled: true },
    { id: 10, name: 'Elite Pest Solutions', active: true, userCount: 78, branchCount: 4, integrationCount: 6, reviewsEnabled: true, rewardsEnabled: true },
    { id: 11, name: 'Guardian Pest Control', active: false, userCount: 15, branchCount: 1, integrationCount: 1, reviewsEnabled: false, rewardsEnabled: false },
    { id: 12, name: 'ProShield Exterminating', active: true, userCount: 123, branchCount: 6, integrationCount: 8, reviewsEnabled: true, rewardsEnabled: true },
    { id: 13, name: 'Apex Pest Management', active: true, userCount: 56, branchCount: 3, integrationCount: 5, reviewsEnabled: false, rewardsEnabled: false },
    { id: 14, name: 'SafeGuard Pest Control', active: true, userCount: 91, branchCount: 5, integrationCount: 7, reviewsEnabled: true, rewardsEnabled: true },
    { id: 15, name: 'Premier Pest Services', active: false, userCount: 22, branchCount: 2, integrationCount: 2, reviewsEnabled: false, rewardsEnabled: false },
    { id: 16, name: 'BugBusters Inc', active: true, userCount: 38, branchCount: 2, integrationCount: 3, reviewsEnabled: true, rewardsEnabled: false },
    { id: 17, name: 'Termite Shield Solutions', active: true, userCount: 72, branchCount: 4, integrationCount: 6, reviewsEnabled: false, rewardsEnabled: true },
    { id: 18, name: 'EcoSafe Pest Control', active: true, userCount: 29, branchCount: 2, integrationCount: 4, reviewsEnabled: true, rewardsEnabled: true }
  ];

  // Filter organizations based on search - exact same logic
  const filteredOrganizations = mockOrganizations.filter(org =>
    org.name.toLowerCase().includes(orgSearchQuery.toLowerCase())
  );

  // Get visible organizations based on display count - exact same logic
  const visibleOrganizations = filteredOrganizations.slice(0, displayedOrgs);

  // Reset pagination when search changes - exact same logic
  useEffect(() => {
    setDisplayedOrgs(10);
  }, [orgSearchQuery]);

  // Load more handler - exact same logic
  const handleLoadMoreOrgs = useCallback(() => {
    setDisplayedOrgs(prev => prev + 10);
  }, []);

  // Handle saving new organization - exact same logic
  const handleSaveNewOrganization = useCallback(async (orgData: any) => {
    console.log('Save new organization:', orgData);
    // Here you would typically make an API call to create the organization
    // For now, we'll just simulate a successful creation
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Organization created successfully!');
        resolve(true);
      }, 1000);
    });
  }, []);

  return {
    // State
    orgSearchQuery,
    setOrgSearchQuery,
    displayedOrgs,
    selectedOrganizationId,
    setSelectedOrganizationId,
    
    // Data
    mockOrganizations,
    filteredOrganizations,
    visibleOrganizations,
    
    // Handlers
    handleLoadMoreOrgs,
    handleSaveNewOrganization
  };
};
