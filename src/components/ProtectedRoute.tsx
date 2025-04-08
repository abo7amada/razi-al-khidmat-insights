
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/company';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireActiveSubscription?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireActiveSubscription = false
}) => {
  const { isAuthenticated, currentUser, userOrganization, isSuperAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    // إذا لم يتم المصادقة على المستخدم، قم بتوجيهه إلى صفحة تسجيل الدخول
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // التحقق من أدوار المستخدم إذا كانت محددة
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(currentUser.role)) {
      // إذا لم يكن للمستخدم دور مسموح به، قم بتوجيهه إلى صفحة غير مصرح بها
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // تجاوز التحقق من الاشتراك للمستخدمين super_admin
  if (requireActiveSubscription && !isSuperAdmin) {
    if (!userOrganization?.active) {
      // إذا كان الاشتراك غير نشط، قم بتوجيهه إلى صفحة تجديد الاشتراك
      return <Navigate to="/subscription-expired" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
