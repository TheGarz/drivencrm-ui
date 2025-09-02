import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type UserRole = 
  | 'DRIVEN_EMPLOYEE' 
  | 'THIRD_PARTY' 
  | 'OWNER' 
  | 'ADMIN' 
  | 'EXECUTIVE_BRANCH_MANAGER'
  | 'BRANCH_MANAGER'
  | 'TEAM_CAPTAIN'
  | 'CSR_UNIT_LEADER'
  | 'CSR_MEMBER'
  | 'SALES_UNIT_LEADER'
  | 'SALES_MEMBER'
  | 'TECH_UNIT_LEADER'
  | 'TECH_MEMBER'
  | 'GUEST';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  location?: string;
  plan?: string;
  permissions?: string[];
  twoFactorEnabled?: boolean;
  twoFactorSetupComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const authDataStr = localStorage.getItem('driven-auth-data');
      
      if (authDataStr) {
        try {
          const authData = JSON.parse(authDataStr);
          
          // Check if session has expired
          if (authData.expiresAt && Date.now() > authData.expiresAt) {
            // Session expired, clear storage
            localStorage.removeItem('driven-auth-data');
            localStorage.removeItem('driven-user');
            localStorage.removeItem('driven-auth-token');
          } else {
            // Session is still valid
            setUser(authData.user);
          }
        } catch (error) {
          console.error('Failed to parse auth data:', error);
          // Fall back to old method
          const savedUser = localStorage.getItem('driven-user');
          const authToken = localStorage.getItem('driven-auth-token');
          
          if (savedUser && authToken) {
            try {
              setUser(JSON.parse(savedUser));
            } catch (error) {
              console.error('Failed to parse saved user:', error);
              localStorage.removeItem('driven-user');
              localStorage.removeItem('driven-auth-token');
            }
          }
        }
      } else {
        // Fall back to old method for backward compatibility
        const savedUser = localStorage.getItem('driven-user');
        const authToken = localStorage.getItem('driven-auth-token');
        
        if (savedUser && authToken) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (error) {
            console.error('Failed to parse saved user:', error);
            localStorage.removeItem('driven-user');
            localStorage.removeItem('driven-auth-token');
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication with different demo users
      let mockUser: User | null = null;
      
      if (credentials.email === 'admin@driven.com' && credentials.password === 'demo123') {
        mockUser = {
          id: '1',
          name: 'Sarah Mitchell',
          email: credentials.email,
          role: 'DRIVEN_EMPLOYEE',
          avatar: 'SM',
          company: 'Driven Software',
          location: 'Salt Lake City, UT',
          plan: 'Enterprise',
          permissions: ['all_access', 'company_admin', 'super_admin'],
          twoFactorEnabled: true,
          twoFactorSetupComplete: true
        };
      } else if (credentials.email === 'admin-no2fa@driven.com' && credentials.password === 'demo123') {
        mockUser = {
          id: '5',
          name: 'Alex Johnson',
          email: credentials.email,
          role: 'ADMIN',
          avatar: 'AJ',
          company: 'Driven Software',
          location: 'Salt Lake City, UT',
          plan: 'Enterprise',
          permissions: ['all_access', 'company_admin', 'super_admin'],
          twoFactorEnabled: true,
          twoFactorSetupComplete: false
        };
      } else if (credentials.email === 'owner@demo.com' && credentials.password === 'demo123') {
        mockUser = {
          id: '2',
          name: 'John Doe',
          email: credentials.email,
          role: 'OWNER',
          avatar: 'JD',
          company: 'Demo Pest Control',
          location: 'Denver, CO',
          plan: 'Professional',
          permissions: ['dashboard', 'analytics', 'integrations', 'metrics', 'users', 'reviews', 'settings', 'billing'],
          twoFactorEnabled: true,
          twoFactorSetupComplete: true
        };
      } else if (credentials.email === 'manager@demo.com' && credentials.password === 'demo123') {
        mockUser = {
          id: '3',
          name: 'Jane Smith',
          email: credentials.email,
          role: 'BRANCH_MANAGER',
          avatar: 'JS',
          company: 'Demo Pest Control',
          location: 'Phoenix, AZ',
          plan: 'Professional',
          permissions: ['dashboard', 'analytics', 'metrics', 'users', 'scheduling', 'reports'],
          twoFactorEnabled: true,
          twoFactorSetupComplete: true
        };
      } else if (credentials.email === 'tech@demo.com' && credentials.password === 'demo123') {
        mockUser = {
          id: '4',
          name: 'Mike Johnson',
          email: credentials.email,
          role: 'TECH_MEMBER',
          avatar: 'MJ',
          company: 'Demo Pest Control',
          location: 'Austin, TX',
          plan: 'Basic',
          permissions: ['dashboard', 'scheduling', 'service_tickets'],
          twoFactorEnabled: true,
          twoFactorSetupComplete: true
        };
      } else if (credentials.email === 'demo@driven.com' && credentials.password === 'demo123') {
        // Backward compatibility
        mockUser = {
          id: '1',
          name: 'Sarah Mitchell',
          email: credentials.email,
          role: 'DRIVEN_EMPLOYEE',
          avatar: 'SM',
          company: 'Driven Software',
          location: 'Salt Lake City, UT',
          plan: 'Enterprise',
          permissions: ['all_access', 'company_admin', 'super_admin'],
          twoFactorEnabled: true,
          twoFactorSetupComplete: true
        };
      }

      if (mockUser) {
        
        // Save to localStorage with expiration based on rememberMe
        const expirationTime = credentials.rememberMe 
          ? Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
          : Date.now() + (24 * 60 * 60 * 1000); // 1 day
        
          const authData = {
            user: mockUser,
            token: 'mock-jwt-token',
            expiresAt: expirationTime,
            rememberMe: credentials.rememberMe || false
          };
          
          localStorage.setItem('driven-auth-data', JSON.stringify(authData));
          // Keep backward compatibility
          localStorage.setItem('driven-user', JSON.stringify(mockUser));
          localStorage.setItem('driven-auth-token', 'mock-jwt-token');
          
          setUser(mockUser);
        } else {
          throw new Error('Invalid email or password');
        }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('driven-auth-data');
    localStorage.removeItem('driven-user');
    localStorage.removeItem('driven-auth-token');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};