
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

  console.log("Protected Route Check - isSuperAdmin:", isSuperAdmin);
  console.log("Protected Route Check - Current User Role:", currentUser?.role);
  console.log("Protected Route Check - Subscription Active:", userOrganization?.active);
  console.log("Protected Route Check - Required Active Subscription:", requireActiveSubscription);

  if (!isAuthenticated || !currentUser) {
    // إذا لم يتم المصادقة على المستخدم، قم بتوجيهه إلى صفحة تسجيل الدخول
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // السوبر أدمن يتخطى جميع فحوص الأدوار والاشتراكات
  if (isSuperAdmin) {
    console.log("Super admin detected - bypassing all checks");
    return <>{children}</>;
  }

  // التحقق من أدوار المستخدم إذا كانت محددة
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.includes(currentUser.role);
    if (!hasAllowedRole) {
      // إذا لم يكن للمستخدم دور مسموح به، قم بتوجيهه إلى صفحة غير مصرح بها
      console.log("User does not have allowed role, redirecting to unauthorized");
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // التحقق من حالة الاشتراك إذا كان مطلوبًا
  if (requireActiveSubscription) {
    if (!userOrganization?.active) {
      // إذا كان الاشتراك غير نشط، قم بتوجيهه إلى صفحة تجديد الاشتراك
      console.log("Subscription not active, redirecting to subscription expired");
      return <Navigate to="/subscription-expired" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
