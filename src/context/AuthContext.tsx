
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, mockUsers, Organization, mockOrganizations } from '../components/vendor-settings/types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  userOrganization: Organization | null;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => Promise.resolve(false),
  logout: () => {},
  isAdmin: false,
  userOrganization: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userOrganization, setUserOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    // التحقق من وجود مستخدم محفوظ في localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        setCurrentUser(parsedUser);
        setIsAdmin(parsedUser.role === 'admin');
        
        if (parsedUser.organizationId) {
          const org = mockOrganizations.find(o => o.id === parsedUser.organizationId);
          setUserOrganization(org || null);
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin');
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      if (user.organizationId) {
        const org = mockOrganizations.find(o => o.id === user.organizationId);
        setUserOrganization(org || null);
      } else {
        setUserOrganization(null);
      }
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setUserOrganization(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin, userOrganization }}>
      {children}
    </AuthContext.Provider>
  );
};
