
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, mockUsers, Organization, mockOrganizations } from '../components/vendor-settings/types';
import { UserRole } from '../types/company';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userOrganization: Organization | null;
  checkAuth: () => void;
  isUserInRole: (roles: UserRole[]) => boolean;
  isSuperAdmin: boolean;
  isCompanyAdmin: boolean;
  isEditor: boolean;
  isViewer: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => Promise.resolve(false),
  logout: () => {},
  isAuthenticated: false,
  userRole: null,
  userOrganization: null,
  checkAuth: () => {},
  isUserInRole: () => false,
  isSuperAdmin: false,
  isCompanyAdmin: false,
  isEditor: false,
  isViewer: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userOrganization, setUserOrganization] = useState<Organization | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // تحقق من المصادقة عند تحميل التطبيق
  useEffect(() => {
    checkAuth();
  }, []);
  
  // استرجاع بيانات المستخدم المخزنة من localStorage
  const checkAuth = () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        
        // استرجاع معلومات المؤسسة إذا كان المستخدم مرتبطًا بمؤسسة
        if (user.organizationId) {
          const org = mockOrganizations.find(o => o.id === user.organizationId);
          setUserOrganization(org || null);
        }
      } catch (e) {
        console.error('Error parsing saved user data:', e);
        localStorage.removeItem('currentUser');
      }
    }
  };

  // تسجيل الدخول
  const login = async (email: string, password: string): Promise<boolean> => {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.email === email && u.password === password && u.active);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      // حفظ المستخدم في localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      if (user.organizationId) {
        const org = mockOrganizations.find(o => o.id === user.organizationId);
        setUserOrganization(org || null);
      } else {
        setUserOrganization(null);
      }
      
      // تحديث وقت آخر تسجيل دخول
      user.lastLogin = new Date().toISOString();
      
      return true;
    }
    
    return false;
  };

  // تسجيل الخروج
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserOrganization(null);
    localStorage.removeItem('currentUser');
    navigate('/login');
  };
  
  // التحقق مما إذا كان المستخدم له دور محدد
  const isUserInRole = (roles: UserRole[]): boolean => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };
  
  // الدوال المساعدة للتحقق من أدوار المستخدمين
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isCompanyAdmin = currentUser?.role === 'company_admin';
  const isEditor = currentUser?.role === 'editor';
  const isViewer = currentUser?.role === 'viewer';

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        login, 
        logout, 
        isAuthenticated,
        userRole: currentUser?.role || null,
        userOrganization,
        checkAuth,
        isUserInRole,
        isSuperAdmin,
        isCompanyAdmin,
        isEditor,
        isViewer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
