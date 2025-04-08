
import React from 'react';
import Layout from '../components/Layout';
import Reports from '../components/Reports';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, BarChart, FileText, Download } from 'lucide-react';

const ReportsPage = () => {
  const { language } = useLanguage();
  
  // Mock company ID for demo purposes
  const companyId = 'comp1';
  
  const reportTypes = [
    {
      title: language === 'ar' ? 'التعليقات التفصيلية' : 'Detailed Comments',
      description: language === 'ar' 
        ? 'عرض وتحليل التعليقات النصية للمستجيبين مع أدوات الفرز والفلترة' 
        : 'View and analyze respondent text comments with sorting and filtering tools',
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
      link: `/company/${companyId}/reports/comments`
    },
    {
      title: language === 'ar' ? 'تقارير الإحصائيات' : 'Statistics Reports',
      description: language === 'ar'
        ? 'تحليلات شاملة لبيانات NPS وتقييمات المقياس ومؤشرات الأداء الرئيسية'
        : 'Comprehensive analytics for NPS data, scale ratings, and key performance indicators',
      icon: <BarChart className="h-8 w-8 text-green-500" />,
      link: `/company/${companyId}/reports`
    },
    {
      title: language === 'ar' ? 'تقارير شهرية PDF' : 'Monthly PDF Reports',
      description: language === 'ar'
        ? 'توليد تقارير PDF الشاملة للمشاركة مع أصحاب المصلحة'
        : 'Generate comprehensive PDF reports for stakeholder sharing',
      icon: <FileText className="h-8 w-8 text-purple-500" />,
      link: `/company/${companyId}/reports`
    },
    {
      title: language === 'ar' ? 'تصدير البيانات الخام' : 'Raw Data Export',
      description: language === 'ar'
        ? 'تصدير بيانات الاستجابة إلى CSV للتحليل المتقدم'
        : 'Export response data to CSV for advanced analysis',
      icon: <Download className="h-8 w-8 text-amber-500" />,
      link: `/company/${companyId}/reports/comments`
    }
  ];
  
  return (
    <Layout currentPage="reports">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          {language === 'ar' ? 'التقارير' : 'Reports'}
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reportTypes.map((report, index) => (
            <Link to={report.link} key={index}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex justify-start items-center mb-2">
                    {report.icon}
                  </div>
                  <CardTitle>{report.title}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-blue-600 hover:underline">
                    {language === 'ar' ? 'عرض التقرير' : 'View Report'} →
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-10">
          <Reports />
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
