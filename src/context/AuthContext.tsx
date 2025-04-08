
import React, { createContext, useContext, useState } from 'react';
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
  // تم تعطيل التحقق من وجود مستخدم محفوظ مؤقتًا
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]); // تعيين المستخدم الأول افتراضيا
  const [isAdmin, setIsAdmin] = useState(true); // افتراض أن المستخدم هو مسؤول
  const [userOrganization, setUserOrganization] = useState<Organization | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin');
      
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
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin, userOrganization }}>
      {children}
    </AuthContext.Provider>
  );
};
