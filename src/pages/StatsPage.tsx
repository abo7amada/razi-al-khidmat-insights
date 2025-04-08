
import React from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';

const StatsPage = () => {
  const { language } = useLanguage();

  return (
    <Layout currentPage="reports">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          {language === 'ar' ? 'التقارير والإحصائيات' : 'Reports & Statistics'}
        </h1>
        
        {/* Stats content will go here */}
        <div className="text-center text-muted-foreground p-12">
          {language === 'ar' ? 'سيتم إضافة هذه الميزة قريباً' : 'This feature will be added soon'}
        </div>
      </div>
    </Layout>
  );
};

export default StatsPage;
