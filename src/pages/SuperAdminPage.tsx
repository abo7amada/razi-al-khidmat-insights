
import React, { useState } from 'react';
import Layout from '../components/Layout';
import CompanyManagement from '../components/super-admin/CompanyManagement';
import BillingManagement from '../components/super-admin/BillingManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

const SuperAdminPage = () => {
  const { isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('companies');
  
  if (!isSuperAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <Layout currentPage="dashboard">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">لوحة تحكم المدير الرئيسي</h1>
          
          <Tabs defaultValue="companies" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="companies">الشركات</TabsTrigger>
              <TabsTrigger value="billing">الفواتير والاشتراكات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="companies" className="mt-4">
              <CompanyManagement />
            </TabsContent>
            
            <TabsContent value="billing" className="mt-4">
              <BillingManagement />
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default SuperAdminPage;
