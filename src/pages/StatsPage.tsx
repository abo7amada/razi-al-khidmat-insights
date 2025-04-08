
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  BarChart,
  Bar,
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer, 
  LineChart, 
  Line,
  CartesianGrid
} from 'recharts';

// Importing mock data (in a real application, these would come from API)
import { mockResponses } from '@/types/company';

// Demo data for charts
const npsDistribution = [
  { name: 'Promoters', value: 65 },
  { name: 'Passives', value: 25 },
  { name: 'Detractors', value: 10 },
];

const likertByCategory = [
  { name: 'جودة الخدمة', score: 4.2 },
  { name: 'نظافة المكان', score: 4.5 },
  { name: 'سلوك الموظفين', score: 4.1 },
  { name: 'سرعة الخدمة', score: 3.8 },
  { name: 'جودة المنتج', score: 4.3 },
];

const monthlyTrend = [
  { month: 'Jan', nps: 42, satisfaction: 82 },
  { month: 'Feb', nps: 44, satisfaction: 80 },
  { month: 'Mar', nps: 48, satisfaction: 85 },
  { month: 'Apr', nps: 52, satisfaction: 87 },
  { month: 'May', nps: 55, satisfaction: 89 },
  { month: 'Jun', nps: 58, satisfaction: 90 },
];

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

const StatsPage = () => {
  const { language } = useLanguage();
  const [timeRange, setTimeRange] = useState('month');
  
  // Calculate demo metrics
  const totalEvaluations = 234;
  const totalComplaints = 27;
  const avgSatisfaction = 86.7;
  const avgNPS = 54;
  const complaintsResolved = 23;
  const complaintsResolvedRatio = (complaintsResolved / totalComplaints * 100).toFixed(1);

  return (
    <Layout currentPage="reports">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {language === 'ar' ? 'التقارير والإحصائيات' : 'Reports & Statistics'}
          </h1>
          
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={language === 'ar' ? 'اختر الفترة' : 'Select time range'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">{language === 'ar' ? 'آخر أسبوع' : 'Last Week'}</SelectItem>
                <SelectItem value="month">{language === 'ar' ? 'آخر شهر' : 'Last Month'}</SelectItem>
                <SelectItem value="quarter">{language === 'ar' ? 'آخر ربع سنة' : 'Last Quarter'}</SelectItem>
                <SelectItem value="year">{language === 'ar' ? 'آخر سنة' : 'Last Year'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {language === 'ar' ? 'إجمالي التقييمات' : 'Total Evaluations'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvaluations}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {language === 'ar' ? 'متوسط رضا العملاء' : 'Avg. Customer Satisfaction'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSatisfaction}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {language === 'ar' ? 'متوسط مؤشر NPS' : 'Avg. NPS'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgNPS}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {language === 'ar' ? 'نسبة حل الشكاوى' : 'Complaints Resolved'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complaintsResolvedRatio}%</div>
              <p className="text-xs text-muted-foreground">
                {complaintsResolved} / {totalComplaints}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Section */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              {language === 'ar' ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="nps">
              {language === 'ar' ? 'مؤشر NPS' : 'NPS Analysis'}
            </TabsTrigger>
            <TabsTrigger value="satisfaction">
              {language === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction'}
            </TabsTrigger>
            <TabsTrigger value="complaints">
              {language === 'ar' ? 'الشكاوى' : 'Complaints'}
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'ar' ? 'توزيع مؤشر NPS' : 'NPS Distribution'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ar' ? 'توزيع المروجين والمحايدين والمنتقدين' : 'Distribution of promoters, passives and detractors'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={npsDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {npsDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'ar' ? 'الاتجاهات الشهرية' : 'Monthly Trends'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ar' ? 'مؤشر NPS ورضا العملاء عبر الوقت' : 'NPS and customer satisfaction over time'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyTrend}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="nps"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                        <Line type="monotone" dataKey="satisfaction" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* NPS Tab */}
          <TabsContent value="nps">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ar' ? 'تحليل مؤشر NPS' : 'NPS Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  {language === 'ar' 
                    ? 'مؤشر NPS الحالي هو 54، وهو أعلى من متوسط القطاع البالغ 42.'
                    : 'Current NPS score is 54, which is above the industry average of 42.'}
                </p>
                
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { score: 0, count: 2 },
                        { score: 1, count: 3 },
                        { score: 2, count: 1 },
                        { score: 3, count: 3 },
                        { score: 4, count: 2 },
                        { score: 5, count: 4 },
                        { score: 6, count: 3 },
                        { score: 7, count: 12 },
                        { score: 8, count: 15 },
                        { score: 9, count: 25 },
                        { score: 10, count: 30 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="score" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="count" 
                        name={language === 'ar' ? 'عدد التقييمات' : 'Number of Ratings'}
                        fill={(entry) => {
                          const score = entry.score;
                          if (score >= 9) return '#22c55e'; // Promoters
                          if (score >= 7) return '#eab308'; // Passives
                          return '#ef4444'; // Detractors
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Customer Satisfaction Tab */}
          <TabsContent value="satisfaction">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ar' ? 'متوسط التقييمات حسب الفئة' : 'Average Ratings by Category'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={likertByCategory}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 5]} />
                      <YAxis type="category" dataKey="name" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Complaints Tab */}
          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ar' ? 'تحليل الشكاوى' : 'Complaints Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  {language === 'ar' 
                    ? `تم حل ${complaintsResolved} من إجمالي ${totalComplaints} شكوى (${complaintsResolvedRatio}%).`
                    : `${complaintsResolved} out of ${totalComplaints} complaints resolved (${complaintsResolvedRatio}%).`}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: language === 'ar' ? 'تم الحل' : 'Resolved', value: complaintsResolved },
                            { name: language === 'ar' ? 'قيد المعالجة' : 'In Progress', value: totalComplaints - complaintsResolved }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#22c55e" />
                          <Cell fill="#eab308" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { type: language === 'ar' ? 'جودة المنتج' : 'Product Quality', count: 8 },
                          { type: language === 'ar' ? 'خدمة العملاء' : 'Customer Service', count: 12 },
                          { type: language === 'ar' ? 'التوصيل' : 'Delivery', count: 5 },
                          { type: language === 'ar' ? 'أسعار' : 'Pricing', count: 2 }
                        ]}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="type" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="count" 
                          name={language === 'ar' ? 'عدد الشكاوى' : 'Number of Complaints'}
                          fill="#ef4444" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StatsPage;
