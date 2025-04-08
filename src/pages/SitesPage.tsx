
import React from 'react';
import Layout from '../components/Layout';
import SiteManagement from '../components/SiteManagement';
import { useLanguage } from '../context/LanguageContext';

const SitesPage = () => {
  const { t } = useLanguage();
  
  return (
    <Layout currentPage="sites">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{t('sitesManagement')}</h1>
        <SiteManagement />
      </div>
    </Layout>
  );
};

export default SitesPage;
