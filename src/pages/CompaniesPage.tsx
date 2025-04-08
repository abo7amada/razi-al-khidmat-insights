
import React from 'react';
import Layout from '../components/Layout';
import CompanyManagement from '../components/super-admin/CompanyManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

const CompaniesPage = () => {
  const { canManageCompanies } = useAuth();

  if (!canManageCompanies) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <ProtectedRoute allowedRoles={['super_admin', 'system_admin', 'admin']}>
      <Layout currentPage="companies">
        <Card>
          <CardHeader>
            <CardTitle>إدارة الشركات</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyManagement />
          </CardContent>
        </Card>
      </Layout>
    </ProtectedRoute>
  );
};

export default CompaniesPage;
