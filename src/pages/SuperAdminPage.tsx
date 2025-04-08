import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CompanyManagement from '../components/super-admin/CompanyManagement';
import BillingManagement from '../components/super-admin/BillingManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { mockCompanies } from '../types/company';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Added this import

const SuperAdminPage = () => {
  const { isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('companies');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [companies, setCompanies] = useState(mockCompanies);
  
  useEffect(() => {
    // محاكاة تحميل البيانات
    const timer = setTimeout(() => {
      setCompanies(mockCompanies);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isSuperAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <Layout currentPage="dashboard">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">لوحة تحكم المدير الرئيسي</h1>
            <Button asChild variant="outline">
              <Link to="/companies">
                <Building className="w-4 h-4 ml-2" />
                إدارة الشركات
              </Link>
            </Button>
          </div>
          
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="dashboard">لوحة القيادة</TabsTrigger>
              <TabsTrigger value="billing">الفواتير والاشتراكات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>إحصائيات الشركات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>إجمالي الشركات: {companies.length}</p>
                    <p>شركات نشطة: {companies.filter(c => c.isActive).length}</p>
                    <p>شركات غير نشطة: {companies.filter(c => !c.isActive).length}</p>
                  </CardContent>
                </Card>
                
                {/* يمكن إضافة المزيد من البطاقات للإحصائيات هنا */}
              </div>
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
