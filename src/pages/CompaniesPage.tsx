
import React, { useState } from 'react';
import Layout from '../components/Layout';
import CompanyManagement from '../components/super-admin/CompanyManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PricingManagement from '../components/super-admin/PricingManagement';

const CompaniesPage = () => {
  const { canManageCompanies } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('companies');

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
            <Tabs defaultValue="companies" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="companies">الشركات</TabsTrigger>
                <TabsTrigger value="pricing">أسعار الاشتراكات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="companies" className="mt-4">
                <CompanyManagement />
              </TabsContent>
              
              <TabsContent value="pricing" className="mt-4">
                <PricingManagement />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Layout>
    </ProtectedRoute>
  );
};

export default CompaniesPage;
