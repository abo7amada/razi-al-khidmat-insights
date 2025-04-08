import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockSatisfactionData, locations, calculateSummaryStatistics } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import LocationSelector from './LocationSelector';
import { useIsMobile } from '../hooks/use-mobile';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>(undefined);
  const isMobile = useIsMobile();
  const { userOrganization } = useAuth();
  
  // Get company ID for the LocationSelector
  const companyId = userOrganization?.id;
  
  // Filter data by location if selected
  const filteredData = selectedLocationId 
    ? mockSatisfactionData.filter(item => {
        const location = locations.find(loc => loc.id === selectedLocationId);
        if (!location) return false;
        
        if (location.type === 'headquarters') {
          return item.location === 'headquarters';
        } else {
          return item.location === 'hospital' && 
                 (language === 'en' ? item.hospitalName === location.nameEn : item.hospitalName === location.nameAr);
        }
      })
    : mockSatisfactionData;
  
  const stats = calculateSummaryStatistics(filteredData);
  
  // Prepare data for charts
  const monthlyData = stats.monthlyAverages.map(item => ({
    name: item.month,
    average: parseFloat((item.average * 20).toFixed(1)), // Convert to percentage
    count: item.count,
  }));
  
  const categoryData = [
    { name: t('serviceQuality'), value: parseFloat((stats.categoryAverages.serviceQuality * 20).toFixed(1)) },
    { name: t('staffBehavior'), value: parseFloat((stats.categoryAverages.staffBehavior * 20).toFixed(1)) },
    { name: t('waitingTime'), value: parseFloat((stats.categoryAverages.waitingTime * 20).toFixed(1)) },
    { name: t('facilities'), value: parseFloat((stats.categoryAverages.facilities * 20).toFixed(1)) },
  ];
  
  const locationData = stats.locationAverages.map(item => ({
    name: item.location === 'headquarters' ? t('headquarters') : t('hospitalOffices'),
    value: parseFloat((item.average * 20).toFixed(1)),
  }));
  
  const COLORS = ['#0F766E', '#1E40AF', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('overallSatisfaction')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-primary">
              {(stats.overallSatisfaction * 20).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' 
                ? `من ${stats.responseCount} استجابة`
                : `from ${stats.responseCount} responses`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('responseRate')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-primary">
              {stats.responseCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' 
                ? 'إجمالي الاستجابات'
                : 'Total responses'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('selectLocation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LocationSelector 
              onSelectLocation={setSelectedLocationId} 
              selectedLocationId={selectedLocationId}
              companyId={companyId}
            />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="mb-4 w-full flex justify-center md:justify-start">
          <TabsTrigger value="monthly" className="flex-1 md:flex-none">{t('monthlySurveys')}</TabsTrigger>
          <TabsTrigger value="categories" className="flex-1 md:flex-none">{t('feedbackAnalysis')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>{t('monthlySurveys')}</CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'متوسط الرضا الشهري للمستفيدين'
                  : 'Monthly average satisfaction of beneficiaries'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ 
                      top: 20, 
                      right: isMobile ? 10 : 30, 
                      left: isMobile ? 0 : 20, 
                      bottom: isMobile ? 60 : 50 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end"
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      height={60}
                    />
                    <YAxis 
                      label={{ 
                        value: language === 'ar' ? 'النسبة المئوية (%)' : 'Percentage (%)', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fontSize: isMobile ? 10 : 12 }
                      }} 
                    />
                    <Tooltip formatter={(value) => [`${value}%`, language === 'ar' ? 'الرضا' : 'Satisfaction']} />
                    <Legend />
                    <Bar dataKey="average" fill="#0F766E" name={language === 'ar' ? 'متوسط الرضا' : 'Avg. Satisfaction'} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('feedbackAnalysis')}</CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? 'تحليل الرضا حسب الفئة'
                    : 'Satisfaction analysis by category'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryData}
                      layout="vertical"
                      margin={{ 
                        top: 20, 
                        right: isMobile ? 20 : 30, 
                        left: isMobile ? 35 : 40, 
                        bottom: isMobile ? 5 : 20 
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={isMobile ? 80 : 100} 
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <Tooltip formatter={(value) => [`${value}%`, language === 'ar' ? 'الرضا' : 'Satisfaction']} />
                      <Bar 
                        dataKey="value" 
                        fill="#1E40AF" 
                        label={{ 
                          position: 'right', 
                          formatter: (value) => `${value}%`,
                          fontSize: isMobile ? 10 : 12
                        }} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'توزيع الرضا' : 'Satisfaction Distribution'}</CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? 'مقارنة بين المركز الرئيسي والمستشفيات'
                    : 'Comparison between headquarters and hospitals'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={isMobile ? 65 : 80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {locationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, language === 'ar' ? 'الرضا' : 'Satisfaction']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
