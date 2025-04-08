
import { useAuth } from '@/context/AuthContext';

type PermissionTypes = 
  | 'view_insights'
  | 'export_reports'
  | 'edit_alert_rules'
  | 'save_segments'
  | 'view_branch_data'
  | 'delete_comments'
  | 'view_reports'; // إضافة صلاحية لعرض التقارير

export const useHasPermission = () => {
  const { currentUser, userRole, isSuperAdmin } = useAuth();
  
  const hasPermission = (permission: PermissionTypes, branchId?: string): boolean => {
    // Super admins have all permissions regardless of subscription status
    if (isSuperAdmin) {
      return true;
    }
    
    // System admins have all permissions
    if (userRole === 'system_admin') {
      return true;
    }
    
    // Check role-based permissions
    switch (userRole) {
      case 'company_admin':
      case 'company_owner':
        // Company admins and owners can do everything
        return true;
        
      case 'editor':
        // Editors can view insights, export reports, and save segments
        // but cannot edit alert rules
        if (permission === 'edit_alert_rules') {
          return false;
        }
        return true;
        
      case 'viewer':
        // Viewers can only view insights and export reports
        if (permission === 'view_insights' || permission === 'export_reports' || permission === 'view_reports') {
          return true;
        }
        return false;
        
      case 'branchManager':
        // Branch managers can do everything but only for their branch
        if (branchId && currentUser?.branches?.includes(branchId)) {
          return true;
        } else if (!branchId && (permission === 'view_insights' || permission === 'view_reports')) {
          // Branch managers can view insights generally
          return true;
        }
        return false;
        
      default:
        return false;
    }
  };
  
  return { hasPermission };
};
