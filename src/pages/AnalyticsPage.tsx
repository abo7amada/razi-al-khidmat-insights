
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Dashboard from '../components/Dashboard';
import KPIStats from '../components/KPIStats';
import APIIntegration from '../components/APIIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AnalyticsPage = () => {
  const { t, language } = useLanguage();
  const { isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // إذا كان المستخدم هو السوبر أدمن، قم بإعادة توجيهه إلى الصفحة الرئيسية
  if (isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <Layout currentPage="analytics">
      <div className="space-y-6">
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle>{language === 'ar' ? 'التحليلات والتكامل' : 'Analytics & Integration'}</CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'تحليل أداء الاستبيانات وإدارة تكامل API'
                : 'Analyze survey performance and manage API integration'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <KPIStats data={null} />
          </CardContent>
        </Card>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-6">
            <TabsTrigger value="dashboard">
              {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
            </TabsTrigger>
            <TabsTrigger value="api">
              {language === 'ar' ? 'تكامل API' : 'API Integration'}
            </TabsTrigger>
            <TabsTrigger value="reports">
              {language === 'ar' ? 'التقارير' : 'Reports'}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          <TabsContent value="api">
            <APIIntegration />
          </TabsContent>
          <TabsContent value="reports">
            {/* Reuse the existing Reports component */}
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'تقارير متقدمة' : 'Advanced Reports'}</CardTitle>
                  <CardDescription>
                    {language === 'ar' 
                      ? 'عرض تقارير تفصيلية عن أداء الاستبيانات والمستخدمين'
                      : 'View detailed reports about survey performance and users'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {language === 'ar' 
                      ? 'اضغط على زر "التقارير" في الشريط الجانبي للوصول إلى التقارير التفصيلية.'
                      : 'Click on the "Reports" button in the sidebar to access detailed reports.'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
