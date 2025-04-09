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
  currentCompany: { id: string } | null;
  checkAuth: () => void;
  isUserInRole: (roles: UserRole[]) => boolean;
  isSuperAdmin: boolean;
  isSystemAdmin: boolean;
  isCompanyOwner: boolean;
  isCompanyAdmin: boolean;
  isEditor: boolean;
  isViewer: boolean;
  isAdmin: boolean;
  canManageCompanies: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => Promise.resolve(false),
  logout: () => {},
  isAuthenticated: false,
  userRole: null,
  userOrganization: null,
  currentCompany: null,
  checkAuth: () => {},
  isUserInRole: () => false,
  isSuperAdmin: false,
  isSystemAdmin: false,
  isCompanyOwner: false,
  isCompanyAdmin: false,
  isEditor: false,
  isViewer: false,
  isAdmin: false,
  canManageCompanies: false
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
  const isSystemAdmin = currentUser?.role === 'system_admin';
  const isCompanyOwner = currentUser?.role === 'company_owner';
  const isCompanyAdmin = currentUser?.role === 'company_admin';
  const isEditor = currentUser?.role === 'editor';
  const isViewer = currentUser?.role === 'viewer';
  
  // خاصية للتحقق مما إذا كان المستخدم مسؤولًا بأي شكل
  const isAdmin = isSuperAdmin || isSystemAdmin || isCompanyAdmin || isCompanyOwner;
  
  // تحديث خاصية التحكم بإمكانية إدارة الشركات لتشمل دور admin أيضًا
  const canManageCompanies = isSuperAdmin || isSystemAdmin || currentUser?.role === 'admin';
  
  // Set current company from the user organization
  const currentCompany = userOrganization ? { id: userOrganization.id } : null;

  console.log("Current user role:", currentUser?.role);
  console.log("Is super admin:", isSuperAdmin);

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        login, 
        logout, 
        isAuthenticated,
        userRole: currentUser?.role || null,
        userOrganization,
        currentCompany,
        checkAuth,
        isUserInRole,
        isSuperAdmin,
        isSystemAdmin,
        isCompanyOwner,
        isCompanyAdmin,
        isEditor,
        isViewer,
        isAdmin,
        canManageCompanies
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
