
import React from 'react';
import Layout from '../components/Layout';
import InsightsDashboard from '../components/insights/InsightsDashboard';
import { useLanguage } from '../context/LanguageContext';

const InsightsPage = () => {
  const { t } = useLanguage();
  
  return (
    <Layout currentPage="insights">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{t('insightsAnalytics')}</h1>
        <InsightsDashboard />
      </div>
    </Layout>
  );
};

export default InsightsPage;
